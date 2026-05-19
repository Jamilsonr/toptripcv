"use client";

import { useChat } from "ai/react";
import { parseISO } from "date-fns";
import { PlaneTakeoff, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TripIntakeValues = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
};

export function TripIntake({
  chatId,
  initialValues,
}: {
  chatId: string;
  initialValues?: Partial<TripIntakeValues>;
}) {
  const t = useTranslations("TripIntake");
  const { append } = useChat({
    id: chatId,
    body: { id: chatId },
    maxSteps: 5,
  });

  const [values, setValues] = useState<TripIntakeValues>({
    origin: initialValues?.origin ?? "",
    destination: initialValues?.destination ?? "",
    departureDate: initialValues?.departureDate ?? "",
    returnDate: initialValues?.returnDate ?? "",
    passengers: initialValues?.passengers ?? 1,
  });

  const setField = useCallback(
    <K extends keyof TripIntakeValues>(key: K, value: TripIntakeValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const canSubmit = useMemo(() => {
    return (
      values.origin.trim().length > 0 &&
      values.destination.trim().length > 0 &&
      values.departureDate.trim().length > 0 &&
      values.passengers >= 1
    );
  }, [values]);

  const minReturnDate = useMemo(() => {
    return values.departureDate.trim() ? parseISO(values.departureDate) : undefined;
  }, [values.departureDate]);

  const submit = useCallback(() => {
    if (!canSubmit) return;

    append({
      role: "user",
      content: `Quero ver voos com estes dados: Origem: ${values.origin}. Destino: ${values.destination}. Ida: ${values.departureDate}.${values.returnDate.trim().length > 0 ? ` Volta: ${values.returnDate}.` : ""} Passageiros: ${values.passengers}.`,
    });
  }, [append, canSubmit, values]);

  return (
    <div className="rounded-2xl border bg-gradient-to-b from-blue-50/70 to-background/70 backdrop-blur-sm p-4">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-foreground">{t("title")}</div>
        <div className="text-xs text-muted-foreground">{t("subtitle")}</div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-origin" className="text-sm">
              {t("origin")}
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-600">
                <PlaneTakeoff size={18} />
              </div>
              <Input
                id="trip-origin"
                value={values.origin}
                onChange={(e) => setField("origin", e.target.value)}
                placeholder={t("originPlaceholder")}
                className="h-11 rounded-xl pl-10 bg-white/70 border-blue-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-destination" className="text-sm">
              {t("destination")}
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-600">
                <PlaneTakeoff size={18} />
              </div>
              <Input
                id="trip-destination"
                value={values.destination}
                onChange={(e) => setField("destination", e.target.value)}
                placeholder={t("destinationPlaceholder")}
                className="h-11 rounded-xl pl-10 bg-white/70 border-blue-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white/60 p-3 grid gap-3">
          <div className="grid sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-departure" className="text-sm">
              {t("departure")}
            </Label>
            <DatePicker
              value={values.departureDate}
              onChange={(next) => {
                setValues((v) => {
                  const shouldClearReturn =
                    v.returnDate.trim() && next.trim() && v.returnDate < next;
                  return {
                    ...v,
                    departureDate: next,
                    returnDate: shouldClearReturn ? "" : v.returnDate,
                  };
                });
              }}
              className="bg-white/70 border-blue-200 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-return" className="text-sm">
              {t("return")}
            </Label>
            <DatePicker
              value={values.returnDate}
              minDate={minReturnDate}
              onChange={(next) => setField("returnDate", next)}
              className="bg-white/70 border-blue-200 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-passengers" className="text-sm">
              {t("passengers")}
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-600">
                <Users size={18} />
              </div>
              <Input
                id="trip-passengers"
                type="number"
                min={1}
                value={values.passengers}
                onChange={(e) =>
                  setField("passengers", Math.max(1, Number(e.target.value)))
                }
                className="h-11 rounded-xl pl-10 bg-white/70 border-blue-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        </div>
        </div>

        <div className="flex justify-end">
          <Button
            className="text-white"
            type="button"
            disabled={!canSubmit}
            onClick={submit}
          >
            {t("submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
