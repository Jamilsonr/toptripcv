"use client";

import { CalendarDays, MapPin, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Values = {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  passageiros: number;
};

const destinations = [
  "Lisboa",
  "Paris",
  "Nova Iorque",
  "Bangkok",
  "Dubai",
  "Barcelona",
];

export function Hero({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [values, setValues] = useState<Values>({
    origem: "",
    destino: "",
    dataIda: "",
    dataVolta: "",
    passageiros: 1,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (typeof window === "undefined") return;

    const stored = window.sessionStorage.getItem("toptrip_search_params");
    if (!stored) return;

    const params = new URLSearchParams(stored);
    const origem = params.get("origem")?.trim() ?? "";
    const destino = params.get("destino")?.trim() ?? "";
    const dataIda = params.get("dataIda")?.trim() ?? "";
    const dataVolta = params.get("dataVolta")?.trim() ?? "";
    const passageiros = Math.min(
      9,
      Math.max(1, Number(params.get("passageiros") ?? "1")),
    );

    setValues({
      origem,
      destino,
      dataIda,
      dataVolta,
      passageiros: Number.isFinite(passageiros) ? passageiros : 1,
    });
    window.sessionStorage.removeItem("toptrip_search_params");
  }, [isAuthenticated]);

  useEffect(() => {
    const destino = searchParams.get("destino")?.trim();
    if (!destino) return;
    setValues((v) => ({ ...v, destino }));
  }, [searchParams]);

  const canSubmit = useMemo(() => {
    return values.destino.trim().length > 0 && values.dataIda.trim().length > 0;
  }, [values.dataIda, values.destino]);

  const submit = () => {
    setError(null);

    if (!canSubmit) {
      setError("Preenche pelo menos o destino e a data de ida.");
      return;
    }

    const params = new URLSearchParams();
    if (values.origem.trim()) params.set("origem", values.origem.trim());
    params.set("destino", values.destino.trim());
    params.set("dataIda", values.dataIda.trim());
    if (values.dataVolta.trim()) params.set("dataVolta", values.dataVolta.trim());
    params.set("passageiros", String(values.passageiros));

    if (!isAuthenticated) {
      window.sessionStorage.setItem("toptrip_search_params", params.toString());
      router.push("/login");
      return;
    }

    router.push(`/chat?${params.toString()}`);
  };

  const heroImageUrl = useMemo(() => {
    const prompt = encodeURIComponent(
      "ultra realistic modern travel destination photo, coastal city sunset view, warm lights, minimal composition, high-end editorial photography, sharp focus, 35mm, no text, no watermark",
    );
    return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_16_9`;
  }, []);

  return (
    <section
      id="pesquisa"
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.88), rgba(30,64,175,0.78)), url(${heroImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Viaja mais, gasta menos.
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/85">
            Encontra os melhores voos, hotéis e carros — tudo num só lugar, com a ajuda
            da IA.
          </p>
        </div>

        <div className="mt-10 rounded-2xl bg-white/95 backdrop-blur border border-white/30 shadow-sm p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-6">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <MapPin size={18} />
                </div>
                <Input
                  value={values.origem}
                  onChange={(e) => setValues((v) => ({ ...v, origem: e.target.value }))}
                  placeholder="De onde partes?"
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <MapPin size={18} />
                </div>
                <Input
                  value={values.destino}
                  onChange={(e) => setValues((v) => ({ ...v, destino: e.target.value }))}
                  placeholder="Para onde vais?"
                  list="toptrip-destinos"
                  className="h-11 rounded-xl pl-10"
                />
                <datalist id="toptrip-destinos">
                  {destinations.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <CalendarDays size={18} />
                </div>
                <Input
                  type="date"
                  value={values.dataIda}
                  onChange={(e) => setValues((v) => ({ ...v, dataIda: e.target.value }))}
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <CalendarDays size={18} />
                </div>
                <Input
                  type="date"
                  value={values.dataVolta}
                  onChange={(e) => setValues((v) => ({ ...v, dataVolta: e.target.value }))}
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-6">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <Users size={18} />
                </div>
                <select
                  value={values.passageiros}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      passageiros: Math.min(9, Math.max(1, Number(e.target.value))),
                    }))
                  }
                  className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {Array.from({ length: 9 }).map((_, i) => {
                    const value = i + 1;
                    return (
                      <option key={value} value={value}>
                        {value} passageiro{value > 1 ? "s" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="md:col-span-4 flex items-stretch gap-3 md:justify-end">
              <Button
                type="button"
                onClick={submit}
                className="h-11 w-full md:w-auto bg-amber-500 text-slate-900 hover:bg-amber-400"
              >
                Pesquisar
              </Button>
            </div>
          </div>

          {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
        </div>
      </div>
    </section>
  );
}
