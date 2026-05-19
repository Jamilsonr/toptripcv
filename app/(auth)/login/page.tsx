"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { AuthPage } from "@/components/custom/auth-page";
import { SubmitButton } from "@/components/custom/submit-button";

import { login, LoginActionState } from "../actions";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const m = useTranslations("PreLogin");

  const [email, setEmail] = useState("");

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast.error(t("invalidCredentials"));
    } else if (state.status === "invalid_data") {
      toast.error(t("invalidSubmission"));
    } else if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router, t]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <AuthPage
      title={t("signInTitle")}
      description={t("signInDescription")}
      marketing={{
        brand: m("brand"),
        tagline: m("tagline"),
        pill: m("pill"),
        heroTitle: m("heroTitle"),
        heroSubtitle: m("heroSubtitle"),
        feature1Title: m("feature1Title"),
        feature1Desc: m("feature1Desc"),
        feature2Title: m("feature2Title"),
        feature2Desc: m("feature2Desc"),
        feature3Title: m("feature3Title"),
        feature3Desc: m("feature3Desc"),
      }}
    >
      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton>{t("signInButton")}</SubmitButton>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-semibold text-foreground">
            {t("signUpLink")}
          </Link>{" "}
          {t("forFree")}
        </p>
      </AuthForm>
    </AuthPage>
  );
}
