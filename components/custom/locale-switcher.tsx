"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";

import { Button } from "../ui/button";

export function LocaleSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Locale");

  const setLocale = useCallback(
    (nextLocale: string) => {
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${maxAge}`;
      router.refresh();
    },
    [router],
  );

  return (
    <div className="w-full flex flex-row gap-1">
      <Button
        type="button"
        variant={locale === "pt" ? "secondary" : "ghost"}
        className="h-8 px-2 w-full justify-center"
        onClick={() => setLocale("pt")}
      >
        {t("pt")}
      </Button>
      <Button
        type="button"
        variant={locale === "en" ? "secondary" : "ghost"}
        className="h-8 px-2 w-full justify-center"
        onClick={() => setLocale("en")}
      >
        {t("en")}
      </Button>
    </div>
  );
}
