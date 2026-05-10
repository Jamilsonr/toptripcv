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

type Preferences = {
  travelStyle: TravelStyle;
  interests: string[];
  pace: Pace;
  likes: string;
  avoid?: string;
};

type ProfileValues = {
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

export function Profile({
  email,
  initialPreferences,
}: {
  email: string;
  initialPreferences: Preferences;
}) {
  const t = useTranslations("Profile");
  const o = useTranslations("Onboarding");
  const router = useRouter();

  const known = new Set(allInterests);
  const initialKnown = (initialPreferences.interests ?? []).filter((x) =>
    known.has(x),
  );
  const initialOther = (initialPreferences.interests ?? [])
    .filter((x) => !known.has(x))
    .join(", ");

  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<ProfileValues>({
    travelStyle: initialPreferences.travelStyle ?? null,
    interests: initialKnown,
    interestsOther: initialOther,
    pace: initialPreferences.pace ?? null,
    likes: initialPreferences.likes ?? "",
    avoid: initialPreferences.avoid ?? "",
  });

  const setField = useCallback(
    <K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) => {
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

  const canSave = useMemo(() => {
    return Boolean(values.travelStyle) && Boolean(values.pace) && values.likes.trim().length >= 3;
  }, [values.likes, values.pace, values.travelStyle]);

  const save = useCallback(async () => {
    if (!values.travelStyle || !values.pace) return;

    const extraInterests = values.interestsOther
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const interests = Array.from(new Set([...values.interests, ...extraInterests]));

    setSaving(true);
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
      router.refresh();
    } catch {
      toast.error(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }, [router, t, values]);

  return (
    <div className="min-h-dvh w-full bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 pt-24 pb-10">
        <div className="flex flex-col gap-6">
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
          </div>

          <div className="rounded-3xl border bg-background/60 backdrop-blur-sm p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold text-foreground">
                  {t("accountTitle")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("accountSubtitle")}
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm">{t("email")}</Label>
                <Input
                  value={email}
                  readOnly
                  className="h-11 rounded-xl bg-muted"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-background/60 backdrop-blur-sm p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold text-foreground">
                  {t("prefsTitle")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("prefsSubtitle")}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium text-foreground">
                  {o("qStyle")}
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {(
                    [
                      ["relax", o("styleRelax")],
                      ["balanced", o("styleBalanced")],
                      ["adventure", o("styleAdventure")],
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

              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium text-foreground">
                  {o("qInterests")}
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
                        {o(`interest.${interest}`)}
                      </button>
                    );
                  })}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interestsOther" className="text-sm">
                    {o("qInterestsOther")}
                  </Label>
                  <Input
                    id="interestsOther"
                    value={values.interestsOther}
                    onChange={(e) => setField("interestsOther", e.target.value)}
                    placeholder={o("qInterestsOtherPlaceholder")}
                    className="h-11 rounded-xl"
                  />
                  <div className="text-xs text-muted-foreground">
                    {o("qInterestsHint")}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium text-foreground">
                  {o("qPace")}
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {(
                    [
                      ["slow", o("paceSlow")],
                      ["normal", o("paceNormal")],
                      ["fast", o("paceFast")],
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

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="likes" className="text-sm">
                    {o("qLikes")}
                  </Label>
                  <Input
                    id="likes"
                    value={values.likes}
                    onChange={(e) => setField("likes", e.target.value)}
                    placeholder={o("qLikesPlaceholder")}
                    className="h-11 rounded-xl"
                  />
                  <div className="text-xs text-muted-foreground">
                    {o("qLikesHint")}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="avoid" className="text-sm">
                    {o("qAvoid")}
                  </Label>
                  <Input
                    id="avoid"
                    value={values.avoid}
                    onChange={(e) => setField("avoid", e.target.value)}
                    placeholder={o("qAvoidPlaceholder")}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="text-white"
                  type="button"
                  disabled={!canSave || saving}
                  onClick={save}
                >
                  {saving ? t("saving") : t("save")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

