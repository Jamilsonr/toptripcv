"use client";

import { useTranslations } from "next-intl";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: any;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const t = useTranslations("Form");

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-sm text-muted-foreground"
        >
          {t("email")}
        </Label>

        <Input
          id="email"
          name="email"
          className="h-11 rounded-xl bg-muted/60 border border-border/60"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
        />

        <Label
          htmlFor="password"
          className="text-sm text-muted-foreground"
        >
          {t("password")}
        </Label>

        <Input
          id="password"
          name="password"
          className="h-11 rounded-xl bg-muted/60 border border-border/60"
          type="password"
          required
        />
      </div>

      {children}
    </form>
  );
}
