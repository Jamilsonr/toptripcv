"use client";

import { useTranslations } from "next-intl";

export function VerifyPayment({
  result: { hasCompletedPayment },
}: {
  result: {
    hasCompletedPayment: boolean;
  };
}) {
  const t = useTranslations("Payments");

  return (
    <div>
      {hasCompletedPayment
        ? t("verifySuccess")
        : t("verifyFail")}
    </div>
  );
}
