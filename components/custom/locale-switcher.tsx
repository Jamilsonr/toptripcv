"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="size-9 p-0"
          aria-label={t("switch")}
        >
          <Languages size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => setLocale("pt")}
          className={locale === "pt" ? "font-medium" : undefined}
        >
          {t("pt")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setLocale("en")}
          className={locale === "en" ? "font-medium" : undefined}
        >
          {t("en")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
