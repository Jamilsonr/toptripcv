"use client";

import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

import { LoaderIcon } from "@/components/custom/icons";

import { Button } from "../ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  const t = useTranslations("Form");

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className="relative text-white"
    >
      {children}
      {pending && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? t("loading") : t("submitForm")}
      </span>
    </Button>
  );
}
