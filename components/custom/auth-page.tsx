import { Plane, ShieldCheck, Sparkles } from "lucide-react";

export function AuthPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-blue-50/70 to-background dark:from-blue-950/20">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-10">
        <div className="hidden lg:flex flex-col justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Plane size={18} />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-foreground">
                Top Trip
              </div>
              <div className="text-sm text-muted-foreground">
                Planeamento de viagens, mais rápido
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-4xl font-semibold tracking-tight text-foreground">
              Viaja com confiança.
            </div>
            <div className="text-base text-muted-foreground max-w-md">
              Cria uma conta para guardar conversas, reservas e histórico, e
              retomar tudo quando quiseres.
            </div>
          </div>

          <div className="grid gap-3 max-w-md">
            <div className="flex items-start gap-3 rounded-2xl border bg-background/40 p-4">
              <div className="text-blue-600 dark:text-blue-500">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-foreground">
                  Experiência premium
                </div>
                <div className="text-sm text-muted-foreground">
                  Interface rápida, limpa e focada no que importa.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-background/40 p-4">
              <div className="text-blue-600 dark:text-blue-500">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-foreground">
                  Conta e histórico
                </div>
                <div className="text-sm text-muted-foreground">
                  Mantém as tuas conversas e reservas num só lugar.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-3xl border bg-background/70 backdrop-blur-sm p-6 shadow-sm">
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

