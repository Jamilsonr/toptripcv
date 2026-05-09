import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiProModel } from "@/ai";
import {
  generateReservationPrice,
  generateSampleFlightSearchResults,
  generateSampleFlightStatus,
  generateSampleSeatSelection,
} from "@/ai/actions";
import { auth } from "@/app/(auth)/auth";
import {
  createReservation,
  deleteChatById,
  getChatById,
  getUserPreferenceByUserId,
  getReservationById,
  saveChat,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const pref = session.user?.id
    ? await getUserPreferenceByUserId({ id: session.user.id })
    : null;

  let profile: any = null;
  if (pref?.preferences) {
    try {
      profile =
        typeof pref.preferences === "string"
          ? JSON.parse(pref.preferences)
          : pref.preferences;
    } catch {
      profile = pref.preferences;
    }
  }

  const result = await streamText({
    model: geminiProModel,
    system: `\n
        - You are Top Trip, an AI travel assistant.
        - Always reply in Portuguese (pt-PT). Only switch language if the user clearly writes in another language.
        - If this is the first assistant response in a new chat (only one user message so far), call tripIntake to show a form for Origem/Destino/Datas/Passageiros.
        - Primary goal: help the user plan a complete trip itinerary (day-by-day) based on their destination, dates/duration and preferences.
        - Never say you "can't create an itinerary".
        - User profile (saved preferences). Use these to personalize suggestions and tone:
          ${profile ? JSON.stringify(profile) : "null"}
        - Itinerary flow (keep it simple and consistent):
          - Step 1: Confirm destination (city + country).
          - Step 2: Confirm dates OR trip duration (e.g. “5 dias”) and approximate month if dates are unknown.
          - Step 3: Ask who is traveling (solo/casal/família) and any must-see / avoid (1 short question).
          - Step 4: Ask for confirmation: “Queres que eu gere o itinerário agora?”
          - Step 5 (after confirmation): Deliver the full itinerary as the outcome of the conversation.
        - Ask at most 1–2 questions per message. If the user already provided a detail, do not ask again.
        - If the user asks about weather, call getWeather with a city name (e.g. "Praia, Cabo Verde", "Lisboa, PT") and NEVER ask for latitude/longitude.
        - If the user provides travel details (origem, destino, data de ida/volta, passageiros) call searchFlights with those fields.
        - Use tools only when they improve the experience (weather, flight search/status, seats, payment). Do not force a flight-booking flow unless the user asks to book.
        - Output style:
          - Prefer short paragraphs and compact bullet points when listing an itinerary.
          - Avoid long walls of text.
          - For itineraries use headings like: "Resumo", "Dia 1", "Dia 2", ..., "Dicas".
        - Today's date is ${new Date().toLocaleDateString()}.
      `,
    messages: coreMessages,
    tools: {
      tripIntake: {
        description:
          "Show a trip details form (origin, destination, departure/return dates, passengers) to collect structured info",
        parameters: z.object({
          origin: z.string().optional(),
          destination: z.string().optional(),
          departureDate: z.string().optional(),
          returnDate: z.string().optional(),
          passengers: z.number().int().min(1).optional(),
        }),
        execute: async (args) => args,
      },
      getWeather: {
        description:
          "Get the current weather for a city name (no latitude/longitude needed)",
        parameters: z.object({
          location: z
            .string()
            .describe('City name, e.g. "San Francisco" or "Lisbon, PT"'),
        }),
        execute: async ({ location }) => {
          const coordinateMatch = location
            .trim()
            .match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);

          let latitude: number | null = null;
          let longitude: number | null = null;

          if (coordinateMatch) {
            latitude = Number(coordinateMatch[1]);
            longitude = Number(coordinateMatch[2]);
          } else {
            const geocodeResponse = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                location,
              )}&count=1&language=pt&format=json`,
            );

            const geocodeData = await geocodeResponse.json();
            const first = geocodeData?.results?.[0];

            if (!first) {
              return {
                error:
                  "Não encontrei essa cidade. Diz o nome da cidade e o país (ex.: “Lisboa, PT”).",
              };
            }

            latitude = first.latitude;
            longitude = first.longitude;
          }

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
      displayFlightStatus: {
        description: "Display the status of a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
          date: z.string().describe("Date of the flight"),
        }),
        execute: async ({ flightNumber, date }) => {
          const flightStatus = await generateSampleFlightStatus({
            flightNumber,
            date,
          });

          return flightStatus;
        },
      },
      searchFlights: {
        description: "Search for flights based on the given parameters",
        parameters: z.object({
          origin: z.string().describe("Origin airport or city"),
          destination: z.string().describe("Destination airport or city"),
          departureDate: z.string().optional().describe("Departure date (YYYY-MM-DD)"),
          returnDate: z.string().optional().describe("Return date (YYYY-MM-DD)"),
          passengers: z.number().int().min(1).optional().describe("Number of passengers"),
        }),
        execute: async ({ origin, destination, departureDate, returnDate, passengers }) => {
          const results = await generateSampleFlightSearchResults({
            origin,
            destination,
            departureDate,
            returnDate,
            passengers,
          });

          return results;
        },
      },
      selectSeats: {
        description: "Select seats for a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
        }),
        execute: async ({ flightNumber }) => {
          const seats = await generateSampleSeatSelection({ flightNumber });
          return seats;
        },
      },
      createReservation: {
        description: "Display pending reservation details",
        parameters: z.object({
          seats: z.string().array().describe("Array of selected seat numbers"),
          flightNumber: z.string().describe("Flight number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            gate: z.string().describe("Departure gate"),
            terminal: z.string().describe("Departure terminal"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            gate: z.string().describe("Arrival gate"),
            terminal: z.string().describe("Arrival terminal"),
          }),
          passengerName: z.string().describe("Name of the passenger"),
        }),
        execute: async (props) => {
          const { totalPriceInUSD } = await generateReservationPrice(props);
          const session = await auth();

          const id = generateUUID();

          if (session && session.user && session.user.id) {
            await createReservation({
              id,
              userId: session.user.id,
              details: { ...props, totalPriceInUSD },
            });

            return { id, ...props, totalPriceInUSD };
          } else {
            return {
              error: "User is not signed in to perform this action!",
            };
          }
        },
      },
      authorizePayment: {
        description:
          "User will enter credentials to authorize payment, wait for user to repond when they are done",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          return { reservationId };
        },
      },
      verifyPayment: {
        description: "Verify payment status",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          const reservation = await getReservationById({ id: reservationId });

          if (reservation.hasCompletedPayment) {
            return { hasCompletedPayment: true };
          } else {
            return { hasCompletedPayment: false };
          }
        },
      },
      displayBoardingPass: {
        description: "Display a boarding pass",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
          passengerName: z
            .string()
            .describe("Name of the passenger, in title case"),
          flightNumber: z.string().describe("Flight number"),
          seat: z.string().describe("Seat number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            airportName: z.string().describe("Name of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            terminal: z.string().describe("Departure terminal"),
            gate: z.string().describe("Departure gate"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            airportName: z.string().describe("Name of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            terminal: z.string().describe("Arrival terminal"),
            gate: z.string().describe("Arrival gate"),
          }),
        }),
        execute: async (boardingPass) => {
          return boardingPass;
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
