import { Bot, PlaneTakeoff, Search } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Pesquisa",
    description: "Indica o destino, datas e número de passageiros",
    Icon: Search,
  },
  {
    number: "2",
    title: "IA analisa",
    description: "O nosso assistente encontra as melhores opções de voo, hotel e carro",
    Icon: Bot,
  },
  {
    number: "3",
    title: "Viaja",
    description: "Escolhe a oferta ideal e parte em viagem",
    Icon: PlaneTakeoff,
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Como funciona o TopTrip?
          </h2>
          <p className="mt-3 text-slate-600">
            Um fluxo simples para encontrares as melhores opções com ajuda da IA.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ number, title, description, Icon }) => (
            <div
              key={number}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Icon size={18} />
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{title}</div>
                </div>
                <div className="text-sm font-semibold text-amber-600">#{number}</div>
              </div>
              <div className="mt-4 text-sm text-slate-600">{description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

