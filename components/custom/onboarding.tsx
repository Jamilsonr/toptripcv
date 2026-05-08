"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TravelStyle = "relax" | "balanced" | "adventure";
type Pace = "slow" | "normal" | "fast";

type OnboardingValues = {
  travelStyle: TravelStyle | null;
  interests: Array<string>;
  interestsOther: string;
  pace: Pace | null;
  likes: string;
  avoid: string;
};

const allInterests = [
  "praia",
  "cultura",
  "gastronomia",
  "natureza",
  "vida_noturna",
  "familia",
  "compras",
];

export function Onboarding({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const t = useTranslations("Onboarding");

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<OnboardingValues>({
    travelStyle: null,
    interests: [],
    interestsOther: "",
    pace: null,
    likes: "",
    avoid: "",
  });

  const canNext = useMemo(() => {
    if (step === 0) return Boolean(values.travelStyle);
    if (step === 1)
      return (
        values.interests.length > 0 || values.interestsOther.trim().length > 0
      );
    if (step === 2) return Boolean(values.pace);
    if (step === 3) return values.likes.trim().length >= 3;
    return false;
  }, [step, values]);

  const setField = useCallback(
    <K extends keyof OnboardingValues>(key: K, value: OnboardingValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleInterest = useCallback((value: string) => {
    setValues((prev) => {
      const exists = prev.interests.includes(value);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((x) => x !== value)
          : [...prev.interests, value],
      };
    });
  }, []);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, 3));
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const submit = useCallback(async () => {
    if (!values.travelStyle || !values.pace) return;

    const extraInterests = values.interestsOther
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const interests = Array.from(
      new Set([...values.interests, ...extraInterests]),
    );

    setSubmitting(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          travelStyle: values.travelStyle,
          interests,
          pace: values.pace,
          likes: values.likes.trim(),
          avoid: values.avoid.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success(t("saved"));
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error(t("saveFailed"));
    } finally {
      setSubmitting(false);
    }
  }, [redirectTo, router, t, values]);

  return (
    <div className="min-h-dvh w-full bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 pt-24 pb-10">
        <div className="rounded-3xl border bg-background/60 backdrop-blur-sm p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-400">
              {t("kicker")}
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <div className="mt-8">
            <div className="text-xs text-muted-foreground">
              {t("stepLabel", { step: step + 1, total: 4 })}
            </div>

            <div className="mt-4">
              {step === 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="text-sm font-medium text-foreground">
                    {t("qStyle")}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {(
                      [
                        ["relax", t("styleRelax")],
                        ["balanced", t("styleBalanced")],
                        ["adventure", t("styleAdventure")],
                      ] as Array<[TravelStyle, string]>
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setField("travelStyle", value)}
                        className={[
                          "rounded-2xl border p-4 text-left transition-colors",
                          values.travelStyle === value
                            ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/20"
                            : "bg-background/40 hover:bg-accent",
                        ].join(" ")}
                      >
                        <div className="text-sm font-medium">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : step === 1 ? (
                <div className="flex flex-col gap-3">
                  <div className="text-sm font-medium text-foreground">
                    {t("qInterests")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allInterests.map((interest) => {
                      const active = values.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={[
                            "rounded-full border px-3 py-1 text-sm transition-colors",
                            active
                              ? "border-blue-500 bg-blue-50/60 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                              : "bg-background/40 hover:bg-accent",
                          ].join(" ")}
                        >
                          {t(`interest.${interest}`)}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="interestsOther" className="text-sm">
                      {t("qInterestsOther")}
                    </Label>
                    <Input
                      id="interestsOther"
                      value={values.interestsOther}
                      onChange={(e) => setField("interestsOther", e.target.value)}
                      placeholder={t("qInterestsOtherPlaceholder")}
                      className="h-11 rounded-xl"
                    />
                    <div className="text-xs text-muted-foreground">
                      {t("qInterestsHint")}
                    </div>
                  </div>
                </div>
              ) : step === 2 ? (
                <div className="flex flex-col gap-3">
                  <div className="text-sm font-medium text-foreground">
                    {t("qPace")}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {(
                      [
                        ["slow", t("paceSlow")],
                        ["normal", t("paceNormal")],
                        ["fast", t("paceFast")],
                      ] as Array<[Pace, string]>
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setField("pace", value)}
                        className={[
                          "rounded-2xl border p-4 text-left transition-colors",
                          values.pace === value
                            ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/20"
                            : "bg-background/40 hover:bg-accent",
                        ].join(" ")}
                      >
                        <div className="text-sm font-medium">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="likes" className="text-sm">
                      {t("qLikes")}
                    </Label>
                    <Input
                      id="likes"
                      value={values.likes}
                      onChange={(e) => setField("likes", e.target.value)}
                      placeholder={t("qLikesPlaceholder")}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="avoid" className="text-sm">
                      {t("qAvoid")}
                    </Label>
                    <Input
                      id="avoid"
                      value={values.avoid}
                      onChange={(e) => setField("avoid", e.target.value)}
                      placeholder={t("qAvoidPlaceholder")}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {t("qLikesHint")}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button type="button" variant="outline" onClick={back} disabled={step === 0 || submitting}>
              {t("back")}
            </Button>

            {step < 3 ? (
              <Button type="button" className="text-white" onClick={next} disabled={!canNext || submitting}>
                {t("next")}
              </Button>
            ) : (
              <Button type="button" className="text-white" onClick={submit} disabled={!canNext || submitting}>
                {submitting ? t("saving") : t("finish")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
