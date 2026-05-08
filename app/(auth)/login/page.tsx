"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { AuthPage } from "@/components/custom/auth-page";
import { SubmitButton } from "@/components/custom/submit-button";

import { login, LoginActionState } from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Credenciais inválidas!");
    } else if (state.status === "invalid_data") {
      toast.error("Não foi possível validar os dados do formulário!");
    } else if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <AuthPage
      title="Iniciar sessão"
      description="Usa o teu email e palavra-passe para iniciar sessão"
    >
      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton>Entrar</SubmitButton>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {"Ainda não tens conta? "}
          <Link href="/register" className="font-semibold text-foreground">
            Registar
          </Link>
          {" grátis."}
        </p>
      </AuthForm>
    </AuthPage>
  );
}
