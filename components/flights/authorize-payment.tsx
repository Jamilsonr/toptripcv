"use client";

import { differenceInMinutes } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";

import { CheckCircle, InfoIcon } from "../custom/icons";
import { Input } from "../ui/input";

export function AuthorizePayment({
  intent = { reservationId: "sample-uuid" },
}: {
  intent?: { reservationId: string };
}) {
  const t = useTranslations("Payments");
  const { data: reservation, mutate } = useSWR(
    `/api/reservation?id=${intent.reservationId}`,
    fetcher,
  );

  const [input, setInput] = useState("");

  const handleAuthorize = async (magicWord: string) => {
    try {
      const response = await fetch(
        `/api/reservation?id=${intent.reservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ magicWord }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }

      const updatedReservation = await response.json();
      mutate(updatedReservation);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("unknownError"));
      }
    }
  };

  return reservation?.hasCompletedPayment ? (
    <div className="bg-blue-600 p-4 rounded-lg gap-4 flex flex-row justify-between items-center">
      <div className="text-blue-50 font-medium">
        {t("verified")}
      </div>
      <div className="text-blue-50">
        <CheckCircle size={20} />
      </div>
    </div>
  ) : differenceInMinutes(new Date(), new Date(reservation?.createdAt)) >
    150 ? (
    <div className="bg-red-500 p-4 rounded-lg gap-4 flex flex-row justify-between items-center">
      <div className="text-background">{t("gatewayTimedOut")}</div>
      <div className="text-background">
        <InfoIcon size={20} />
      </div>
    </div>
  ) : (
    <div className="bg-muted p-4 rounded-lg flex flex-col gap-2">
      <div className="text font-medium">{t("useSavedInfo")}</div>
      <div className="text-muted-foreground text-sm sm:text-base">
        {t("enterMagicWord")}
      </div>

      <Input
        type="text"
        placeholder={t("magicWordPlaceholder")}
        className="dark:bg-zinc-700 text-base border-none mt-2"
        onChange={(event) => setInput(event.currentTarget.value)}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            await handleAuthorize(input);
            setInput("");
          }
        }}
      />
    </div>
  );
}
