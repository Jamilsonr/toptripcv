"use client";

import { parseISO } from "date-fns";
import { MapPin, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AirportAutocomplete } from "@/components/ui/airport-autocomplete";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

type Values = {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  passageiros: number;
};

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

  const minReturnDate = useMemo(() => {
    return values.dataIda.trim() ? parseISO(values.dataIda) : undefined;
  }, [values.dataIda]);

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

  const heroImageUrl = "/images/banner.jpg";

  return (
    <section
      id="pesquisa"
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.65), rgba(30,64,175,0.55)), url(${heroImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Viaje mais, gaste menos
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/85">
            Encontra os melhores voos, hotéis e carros — tudo num só lugar, com a ajuda da
            IA.
          </p>
        </div>

        <div className="mt-10 rounded-2xl bg-white/95 backdrop-blur border border-white/30 shadow-sm p-4 md:p-6">
          <div className="grid gap-3 md:flex md:flex-row md:flex-nowrap md:items-end">
            <div className="md:flex-1">
              <AirportAutocomplete
                value={values.origem}
                onChange={(next) => setValues((v) => ({ ...v, origem: next }))}
                placeholder="De onde partes?"
                icon={MapPin}
              />
            </div>

            <div className="md:flex-1">
              <AirportAutocomplete
                value={values.destino}
                onChange={(next) => setValues((v) => ({ ...v, destino: next }))}
                placeholder="Para onde vais?"
                icon={MapPin}
              />
            </div>

            <div className="md:w-44">
              <DatePicker
                value={values.dataIda}
                onChange={(next) =>
                  setValues((v) => {
                    const shouldClearReturn =
                      v.dataVolta.trim() && next.trim() && v.dataVolta < next;
                    return {
                      ...v,
                      dataIda: next,
                      dataVolta: shouldClearReturn ? "" : v.dataVolta,
                    };
                  })
                }
              />
            </div>

            <div className="md:w-44">
              <DatePicker
                value={values.dataVolta}
                minDate={minReturnDate}
                onChange={(next) => setValues((v) => ({ ...v, dataVolta: next }))}
              />
            </div>

            <div className="md:w-52">
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

            <div className="md:w-32 md:shrink-0">
              <Button
                type="button"
                onClick={submit}
                className="h-11 w-full"
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
