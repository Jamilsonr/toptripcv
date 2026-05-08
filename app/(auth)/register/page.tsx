"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { AuthPage } from "@/components/custom/auth-page";
import { SubmitButton } from "@/components/custom/submit-button";

import { register, RegisterActionState } from "../actions";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("Auth");

  const [email, setEmail] = useState("");
  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error(t("accountExists"));
    } else if (state.status === "failed") {
      toast.error(t("createAccountFailed"));
    } else if (state.status === "invalid_data") {
      toast.error(t("invalidSubmission"));
    } else if (state.status === "success") {
      toast.success(t("accountCreated"));
      router.refresh();
    }
  }, [state, router, t]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <AuthPage title={t("signUpTitle")} description={t("signUpDescription")}>
      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton>{t("signUpButton")}</SubmitButton>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-semibold text-foreground">
            {t("signInLink")}
          </Link>
        </p>
      </AuthForm>
    </AuthPage>
  );
}
