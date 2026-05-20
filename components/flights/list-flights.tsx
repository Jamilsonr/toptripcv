"use client";

import { useChat } from "ai/react";
import { differenceInHours, format } from "date-fns";
import { Plane } from "lucide-react";
import { useTranslations } from "next-intl";

const SAMPLE = {
  flights: [
    {
      id: "result_1",
      departure: {
        cityName: "San Francisco",
        airportCode: "SFO",
        timestamp: "2024-05-19T18:00:00Z",
      },
      arrival: {
        cityName: "Rome",
        airportCode: "FCO",
        timestamp: "2024-05-20T14:30:00Z",
      },
      airlines: ["United Airlines", "Lufthansa"],
      priceInUSD: 1200.5,
      numberOfStops: 1,
    },
    {
      id: "result_2",
      departure: {
        cityName: "San Francisco",
        airportCode: "SFO",
        timestamp: "2024-05-19T17:30:00Z",
      },
      arrival: {
        cityName: "Rome",
        airportCode: "FCO",
        timestamp: "2024-05-20T15:00:00Z",
      },
      airlines: ["British Airways"],
      priceInUSD: 1350,
      numberOfStops: 0,
    },
    {
      id: "result_3",
      departure: {
        cityName: "San Francisco",
        airportCode: "SFO",
        timestamp: "2024-05-19T19:15:00Z",
      },
      arrival: {
        cityName: "Rome",
        airportCode: "FCO",
        timestamp: "2024-05-20T16:45:00Z",
      },
      airlines: ["Delta Air Lines", "Air France"],
      priceInUSD: 1150.75,
      numberOfStops: 1,
    },
    {
      id: "result_4",
      departure: {
        cityName: "San Francisco",
        airportCode: "SFO",
        timestamp: "2024-05-19T16:30:00Z",
      },
      arrival: {
        cityName: "Rome",
        airportCode: "FCO",
        timestamp: "2024-05-20T13:50:00Z",
      },
      airlines: ["American Airlines", "Iberia"],
      totalDurationInMinutes: 740,
      priceInUSD: 1250.25,
      numberOfStops: 1,
    },
  ],
};

export function ListFlights({
  chatId,
  results = SAMPLE,
}: {
  chatId: string;
  results?: typeof SAMPLE;
}) {
  const t = useTranslations("Flights");
  const { append } = useChat({
    id: chatId,
    body: { id: chatId },
    maxSteps: 5,
  });

  return (
    <div className="rounded-3xl border bg-background/60 backdrop-blur-sm p-4 shadow-sm">
      <div className="flex flex-row items-center gap-3">
        <div className="size-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
          <Plane size={18} />
        </div>
        <div className="text-sm font-medium text-foreground">
          {t("resultsTitle")}
        </div>
      </div>

      <div className="-mx-4 mt-4 px-4 overflow-x-auto">
        <div className="flex flex-row gap-4 pb-2 snap-x snap-mandatory">
          {results.flights.map((flight) => {
            const duration = differenceInHours(
              new Date(flight.arrival.timestamp),
              new Date(flight.departure.timestamp),
            );

            const initials = flight.airlines[0]
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join("");

            return (
              <button
                key={flight.id}
                type="button"
                className="flex-none w-[280px] rounded-2xl border bg-background p-4 text-left shadow-sm hover:shadow-md transition-shadow snap-start"
                onClick={() => {
                  append({
                    role: "user",
                    content: `Quero escolher o voo da ${flight.airlines.join(", ")}.`,
                  });
                }}
              >
                <div className="flex flex-row items-center gap-3">
                  <div className="size-10 rounded-2xl bg-muted flex items-center justify-center text-sm font-semibold text-foreground">
                    {initials}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {flight.airlines[0]}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {t("roundTrip")}
                    </div>
                  </div>

                  <div className="text-blue-600 dark:text-blue-500 font-semibold">
                    ${flight.priceInUSD}
                  </div>
                </div>

                <div className="mt-4 flex flex-row items-end justify-between">
                  <div className="flex flex-col">
                    <div className="text-lg font-semibold text-foreground">
                      {format(new Date(flight.departure.timestamp), "HH:mm")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {flight.departure.airportCode}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="text-xs text-muted-foreground">
                      {duration} {t("hoursShort")}
                    </div>
                    <div className="w-16 h-px bg-border" />
                    <div className="text-xs text-muted-foreground">
                      {flight.numberOfStops} {t("stops")}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-lg font-semibold text-foreground">
                      {format(new Date(flight.arrival.timestamp), "HH:mm")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {flight.arrival.airportCode}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full rounded-full bg-zinc-900 text-white py-2 text-center text-sm font-medium dark:bg-white dark:text-zinc-900">
                    {t("chooseThisFlight")}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
