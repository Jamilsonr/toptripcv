import { Instagram, Plane, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Plane size={18} />
              </span>
              <div className="text-lg font-semibold tracking-tight text-slate-900">
                TopTrip
              </div>
            </div>
            <div className="text-sm text-slate-600">
              Viagens inteligentes, preços melhores.
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <Link href="#" className="hover:text-slate-900">
              Política de Privacidade
            </Link>
            <Link href="#" className="hover:text-slate-900">
              Termos de Uso
            </Link>
            <Link href="#" className="hover:text-slate-900">
              Contacto
            </Link>
          </div>

          <div className="flex items-start gap-3 md:justify-end">
            <Link href="#" className="text-slate-600 hover:text-slate-900" aria-label="Twitter">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900" aria-label="Instagram">
              <Instagram size={18} />
            </Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900" aria-label="YouTube">
              <Youtube size={18} />
            </Link>
          </div>
        </div>

        <div className="mt-10 text-xs text-slate-500">
          Copyright © 2025 TopTrip
        </div>
      </div>
    </footer>
  );
}
