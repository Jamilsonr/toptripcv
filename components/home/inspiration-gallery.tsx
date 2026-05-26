import Link from "next/link";

import { Button } from "@/components/ui/button";

type InspirationItem = {
  title: string;
  subtitle: string;
  image: string;
  prompt: string;
  href: string;
};

const items: Array<InspirationItem> = [
  {
    title: "Lisboa",
    subtitle: "Ruas históricas e vista sobre o Tejo",
    image: "/images/landing/lisboa.jpg",
    prompt:
      "ultra realistic travel photo of Lisbon Portugal, viewpoint over a large historic square and red rooftops, soft daylight, high-end editorial, no text, no watermark",
    href: "/?destino=Lisboa#pesquisa",
  },
  {
    title: "Paris",
    subtitle: "Romance, cultura e gastronomia",
    image: "/images/landing/paris.jpg",
    prompt:
      "ultra realistic travel photo of Paris France, Eiffel tower in the background, candid street travel scene, soft daylight, high-end editorial, no text, no watermark",
    href: "/?destino=Paris#pesquisa",
  },
  {
    title: "Tóquio",
    subtitle: "Tecnologia, tradição e noites incríveis",
    image: "/images/landing/tokyo.jpg",
    prompt:
      "ultra realistic travel photo of Tokyo Japan at night, city lights, skyline and bridge, high-end editorial, no text, no watermark",
    href: "/?destino=Tóquio#pesquisa",
  },
];

function imageUrl(prompt: string) {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=landscape_16_9`;
}

export function Inspiracao() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Inspiração para a tua próxima viagem
          </h2>
          <p className="mt-3 text-muted-foreground">
            Explora ideias rápidas e começa já a tua pesquisa.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border bg-background shadow-sm"
            >
              <div
                className="h-56 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03] md:h-64"
                style={{
                  backgroundImage: `url(${item.image}), url(${imageUrl(item.prompt)})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-lg font-semibold text-primary-foreground">
                  {item.title}
                </div>
                <div className="text-sm text-primary-foreground/85">{item.subtitle}</div>
                <div className="mt-4">
                  <Button asChild>
                    <Link href={item.href}>Pesquisar</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
