import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  country: string;
  rating: number;
  text: string;
  prompt: string;
};

const testimonials: Array<Testimonial> = [
  {
    name: "Mariana Silva",
    country: "Portugal",
    rating: 5,
    text: "Encontrei uma combinação de voo + hotel mais barata em minutos. A experiência é super simples.",
    prompt:
      "ultra realistic portrait photo of a young woman, neutral background, soft light, minimal style, high-end editorial, no text, no watermark",
  },
  {
    name: "Lucas Pereira",
    country: "Brasil",
    rating: 5,
    text: "O assistente dá sugestões mesmo úteis e poupa-me tempo quando comparo opções para viajar.",
    prompt:
      "ultra realistic portrait photo of a young man, neutral background, soft light, minimal style, high-end editorial, no text, no watermark",
  },
  {
    name: "Sofia Martin",
    country: "Espanha",
    rating: 4,
    text: "Adorei as sugestões de lugares próximos. É uma ótima forma de planear a viagem sem stress.",
    prompt:
      "ultra realistic portrait photo of a woman in her 30s, neutral background, soft light, minimal style, high-end editorial, no text, no watermark",
  },
];

function avatarUrl(prompt: string) {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=square`;
}

export function Testemunhos() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            O que dizem os nossos utilizadores
          </h2>
          <p className="mt-3 text-slate-600">
            Pessoas reais, feedback real (dados mockados).
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl(t.prompt)}
                  alt={t.name}
                  className="size-12 rounded-full border object-cover"
                />
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-slate-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-600">{t.country}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < t.rating ? "fill-amber-500" : "opacity-30"}
                  />
                ))}
              </div>

              <div className="mt-4 text-sm text-slate-600">{t.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

