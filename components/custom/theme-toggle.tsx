"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Theme");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const nextMode = theme === "dark" ? "light" : "dark";

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        setTheme(nextMode);
      }}
    >
      {t("toggle", { mode: t(nextMode) })}
    </div>
  );
}
