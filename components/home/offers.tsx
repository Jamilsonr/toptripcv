import { BadgePercent, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const offers = [
  { route: "Porto → Londres", price: "a partir de €89" },
  { route: "Lisboa → Paris", price: "a partir de €79" },
  { route: "Madrid → Roma", price: "a partir de €69" },
];

export function Ofertas() {
  return (
    <section id="ofertas" className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Ofertas da semana
          </h2>
          <p className="mt-3 text-muted-foreground">
            Promoções selecionadas (dados mockados por agora).
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {offers.map((offer) => (
            <div
              key={offer.route}
              className="rounded-2xl border bg-background p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-foreground">
                  {offer.route}
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <BadgePercent size={14} />
                  Promoção
                </div>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {offer.price}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/chat">
                    Ver oferta <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
