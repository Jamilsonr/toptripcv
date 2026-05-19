"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import { Chat } from "@/components/custom/chat";

type TripDefaults = {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
};

function readTripDefaults(params: URLSearchParams): TripDefaults {
  const origin = params.get("origem")?.trim() || undefined;
  const destination = params.get("destino")?.trim() || undefined;
  const departureDate = params.get("dataIda")?.trim() || undefined;
  const returnDate = params.get("dataVolta")?.trim() || undefined;
  const passengersRaw = params.get("passageiros");
  const passengers = passengersRaw ? Number(passengersRaw) : undefined;

  return {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers: Number.isFinite(passengers) ? passengers : undefined,
  };
}

export function ChatPageClient({ chatId }: { chatId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  const storedParams =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("toptrip_search_params")
      : null;

  const shouldRedirectToStored =
    !hasRedirected.current &&
    Boolean(storedParams) &&
    searchParams.toString().length === 0;

  useEffect(() => {
    if (!shouldRedirectToStored) return;
    hasRedirected.current = true;
    router.replace(`/chat?${storedParams}`);
    window.sessionStorage.removeItem("toptrip_search_params");
  }, [router, shouldRedirectToStored, storedParams]);

  const tripDefaults = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return readTripDefaults(params);
  }, [searchParams]);

  if (shouldRedirectToStored) {
    return null;
  }

  return <Chat key={chatId} id={chatId} initialMessages={[]} tripDefaults={tripDefaults} />;
}
