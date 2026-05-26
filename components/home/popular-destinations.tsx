import Link from "next/link";

import { Button } from "@/components/ui/button";

type Destination = {
  city: string;
  country: string;
  prompt: string;
  image?: string;
};

const destinations: Array<Destination> = [
  {
    city: "Lisboa",
    country: "Portugal",
    image: "/images/landing/lisboa.jpg",
    prompt:
      "ultra realistic travel photo of Lisbon Portugal, viewpoint over red rooftops and river, golden hour, high-end editorial, sharp focus, no text, no watermark",
  },
  {
    city: "Paris",
    country: "França",
    image: "/images/landing/paris.jpg",
    prompt:
      "ultra realistic travel photo of Paris France, Eiffel tower in distance, soft morning light, minimal composition, high-end editorial, no text, no watermark",
  },
  {
    city: "Tóquio",
    country: "Japão",
    image: "/images/landing/tokyo.jpg",
    prompt:
      "ultra realistic travel photo of Tokyo Japan, city skyline at night, neon lights, high-end editorial, no text, no watermark",
  },
];

function imageUrl(prompt: string) {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=landscape_4_3`;
}

export function DestinosPopulares() {
  return (
    <section id="destinos" className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Destinos em destaque
            </h2>
            <p className="mt-3 text-muted-foreground">
              Inspira-te e começa a planear a tua próxima viagem.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <div
              key={d.city}
              className="group relative overflow-hidden rounded-2xl border bg-background shadow-sm"
            >
              <div
                className="h-44 w-full bg-cover bg-center"
                style={{
                  backgroundImage: d.image
                    ? `url(${d.image}), url(${imageUrl(d.prompt)})`
                    : `url(${imageUrl(d.prompt)})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-lg font-semibold text-white">{d.city}</div>
                <div className="text-sm text-white/85">{d.country}</div>
                <div className="mt-4">
                  <Button
                    asChild
                  >
                    <Link href={`/?destino=${encodeURIComponent(d.city)}#pesquisa`}>
                      Explorar
                    </Link>
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
