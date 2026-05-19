import { ArrowLeft, Plane, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";

export function AuthPage({
  title,
  description,
  marketing,
  children,
}: {
  title: string;
  description: string;
  marketing: {
    brand: string;
    tagline: string;
    pill: string;
    heroTitle: string;
    heroSubtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-10">
        <div className="hidden lg:flex flex-col justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Plane size={18} />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-foreground">
                {marketing.brand}
              </div>
              <div className="text-sm text-muted-foreground">
                {marketing.tagline}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-fit rounded-full border bg-background/50 px-3 py-1 text-xs font-medium text-primary">
              {marketing.pill}
            </div>
            <div className="text-4xl font-semibold tracking-tight text-foreground">
              {marketing.heroTitle}
            </div>
            <div className="text-base text-muted-foreground max-w-md">
              {marketing.heroSubtitle}
            </div>
          </div>

          <div className="grid gap-3 max-w-md">
            <div className="flex items-start gap-3 rounded-2xl border bg-background/40 p-4">
              <div className="text-primary">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-foreground">
                  {marketing.feature1Title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {marketing.feature1Desc}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-background/40 p-4">
              <div className="text-primary">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-foreground">
                  {marketing.feature2Title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {marketing.feature2Desc}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-background/40 p-4">
              <div className="text-primary">
                <Plane size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-foreground">
                  {marketing.feature3Title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {marketing.feature3Desc}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-3xl border bg-background/70 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center justify-start">
              <Button variant="ghost" size="sm" className="-ml-2" asChild>
                <Link href="/" className="gap-2">
                  <ArrowLeft size={16} />
                  <span>Voltar à Home</span>
                </Link>
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
