"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plane, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { Button } from "../ui/button";

export const Overview = () => {
  const t = useTranslations("Overview");

  const focusComposer = useCallback(() => {
    const el = document.getElementById("chat-input") as HTMLTextAreaElement | null;
    el?.focus();
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <motion.div
      key="overview"
      className="w-full max-w-[720px] mt-24 mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-3xl border bg-background/60 backdrop-blur-sm p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center gap-3">
            <div className="size-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Plane size={18} />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-foreground">
                {t("brand")}
              </div>
              <div className="text-xs text-muted-foreground">{t("tagline")}</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-fit rounded-full border bg-background/50 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
              {t("pill")}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {t("heroTitle")}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              {t("heroSubtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="text-white" onClick={focusComposer}>
              {t("ctaPrimary")} <ArrowRight size={16} />
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://sdk.vercel.ai/docs" target="_blank">
                {t("ctaSecondary")}
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-background/40 p-4 flex flex-col gap-2">
              <div className="text-blue-600 dark:text-blue-500">
                <Sparkles size={18} />
              </div>
              <div className="text-sm font-medium text-foreground">
                {t("feature1Title")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("feature1Desc")}
              </div>
            </div>

            <div className="rounded-2xl border bg-background/40 p-4 flex flex-col gap-2">
              <div className="text-blue-600 dark:text-blue-500">
                <ShieldCheck size={18} />
              </div>
              <div className="text-sm font-medium text-foreground">
                {t("feature2Title")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("feature2Desc")}
              </div>
            </div>

            <div className="rounded-2xl border bg-background/40 p-4 flex flex-col gap-2">
              <div className="text-blue-600 dark:text-blue-500">
                <Plane size={18} />
              </div>
              <div className="text-sm font-medium text-foreground">
                {t("feature3Title")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("feature3Desc")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
