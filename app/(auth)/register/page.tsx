"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { AuthPage } from "@/components/custom/auth-page";
import { SubmitButton } from "@/components/custom/submit-button";

import { register, RegisterActionState } from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("A conta já existe");
    } else if (state.status === "failed") {
      toast.error("Não foi possível criar a conta");
    } else if (state.status === "invalid_data") {
      toast.error("Não foi possível validar os dados do formulário!");
    } else if (state.status === "success") {
      toast.success("Conta criada com sucesso");
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <AuthPage
      title="Criar conta"
      description="Cria uma conta com o teu email e palavra-passe"
    >
      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton>Registar</SubmitButton>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {"Já tens conta? "}
          <Link href="/login" className="font-semibold text-foreground">
            Iniciar sessão
          </Link>
          {"."}
        </p>
      </AuthForm>
    </AuthPage>
  );
}
