import { Plane } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { Session } from "next-auth";

function getNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const firstToken = localPart.split(/[._-]/)[0] ?? localPart;
  const match = firstToken.match(/^[a-zA-ZÀ-ÿ]+/);
  const raw = (match?.[0] ?? firstToken).trim();
  if (!raw) return email;
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

export function Navbar({ session }: { session: Session | null }) {
  const name = session?.user?.email ? getNameFromEmail(session.user.email) : null;
  const initial = name?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Plane size={18} />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              TopTrip
            </span>
          </Link>

          <input id="toptrip-nav" type="checkbox" className="peer sr-only" />

          <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <Link href="#destinos" className="hover:text-slate-900">
              Destinos
            </Link>
            <Link href="#ofertas" className="hover:text-slate-900">
              Ofertas
            </Link>
            <Link href="#como-funciona" className="hover:text-slate-900">
              Como Funciona
            </Link>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {!session ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" asChild>
                  <Link href="/register">Registar</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-full border bg-white px-2.5 py-1.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {initial}
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {name ?? "Conta"}
                  </span>
                </div>
                <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" asChild>
                  <Link href="/chat">Ir para o Chat</Link>
                </Button>
              </>
            )}
          </div>

          <label
            htmlFor="toptrip-nav"
            className="flex items-center justify-center rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 md:hidden"
          >
            Menu
          </label>
        </div>

        <div className="hidden peer-checked:block md:hidden pb-4">
          <nav className="flex flex-col gap-3 text-sm text-slate-700">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <Link href="#destinos" className="hover:text-slate-900">
              Destinos
            </Link>
            <Link href="#ofertas" className="hover:text-slate-900">
              Ofertas
            </Link>
            <Link href="#como-funciona" className="hover:text-slate-900">
              Como Funciona
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              {!session ? (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" asChild>
                    <Link href="/register">Registar</Link>
                  </Button>
                </>
              ) : (
                <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" asChild>
                  <Link href="/chat">Ir para o Chat</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
