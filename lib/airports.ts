export type AirportOption = {
  city: string
  airport: string
  code: string
  country: string
}

export const airportOptions: Array<AirportOption> = [
  { city: "Lisboa", airport: "Aeroporto Humberto Delgado", code: "LIS", country: "Portugal" },
  { city: "Porto", airport: "Aeroporto Francisco Sa Carneiro", code: "OPO", country: "Portugal" },
  { city: "Faro", airport: "Aeroporto de Faro", code: "FAO", country: "Portugal" },
  { city: "Madrid", airport: "Adolfo Suarez Madrid-Barajas", code: "MAD", country: "Espanha" },
  { city: "Barcelona", airport: "Aeroporto Josep Tarradellas Barcelona-El Prat", code: "BCN", country: "Espanha" },
  { city: "Sevilha", airport: "Aeroporto de Sevilha", code: "SVQ", country: "Espanha" },
  { city: "Paris", airport: "Aeroporto Charles de Gaulle", code: "CDG", country: "Franca" },
  { city: "Paris", airport: "Aeroporto de Orly", code: "ORY", country: "Franca" },
  { city: "Londres", airport: "Aeroporto de Heathrow", code: "LHR", country: "Reino Unido" },
  { city: "Londres", airport: "Aeroporto de Gatwick", code: "LGW", country: "Reino Unido" },
  { city: "Amesterdao", airport: "Aeroporto Schiphol", code: "AMS", country: "Paises Baixos" },
  { city: "Berlim", airport: "Aeroporto Berlin Brandenburg", code: "BER", country: "Alemanha" },
  { city: "Frankfurt", airport: "Aeroporto de Frankfurt", code: "FRA", country: "Alemanha" },
  { city: "Roma", airport: "Aeroporto Fiumicino", code: "FCO", country: "Italia" },
  { city: "Milao", airport: "Aeroporto de Malpensa", code: "MXP", country: "Italia" },
  { city: "Zurique", airport: "Aeroporto de Zurique", code: "ZRH", country: "Suica" },
  { city: "Genebra", airport: "Aeroporto de Genebra", code: "GVA", country: "Suica" },
  { city: "Bruxelas", airport: "Aeroporto de Bruxelas", code: "BRU", country: "Belgica" },
  { city: "Nova Iorque", airport: "John F. Kennedy International", code: "JFK", country: "Estados Unidos" },
  { city: "Nova Iorque", airport: "Newark Liberty International", code: "EWR", country: "Estados Unidos" },
  { city: "Boston", airport: "Logan International", code: "BOS", country: "Estados Unidos" },
  { city: "Miami", airport: "Miami International", code: "MIA", country: "Estados Unidos" },
  { city: "Los Angeles", airport: "Los Angeles International", code: "LAX", country: "Estados Unidos" },
  { city: "Sao Paulo", airport: "Aeroporto Internacional de Guarulhos", code: "GRU", country: "Brasil" },
  { city: "Rio de Janeiro", airport: "Aeroporto Galeao", code: "GIG", country: "Brasil" },
  { city: "Salvador", airport: "Aeroporto Deputado Luis Eduardo Magalhaes", code: "SSA", country: "Brasil" },
  { city: "Recife", airport: "Aeroporto Internacional do Recife", code: "REC", country: "Brasil" },
  { city: "Dubai", airport: "Dubai International", code: "DXB", country: "Emirados Arabes Unidos" },
  { city: "Doha", airport: "Hamad International", code: "DOH", country: "Catar" },
  { city: "Istambul", airport: "Aeroporto de Istambul", code: "IST", country: "Turquia" },
  { city: "Bangkok", airport: "Suvarnabhumi Airport", code: "BKK", country: "Tailandia" },
  { city: "Singapura", airport: "Changi Airport", code: "SIN", country: "Singapura" },
  { city: "Toquio", airport: "Haneda Airport", code: "HND", country: "Japao" },
  { city: "Toquio", airport: "Narita International", code: "NRT", country: "Japao" },
  { city: "Cidade do Cabo", airport: "Cape Town International", code: "CPT", country: "Africa do Sul" },
  { city: "Luanda", airport: "Aeroporto Internacional 4 de Fevereiro", code: "LAD", country: "Angola" },
  { city: "Maputo", airport: "Aeroporto Internacional de Maputo", code: "MPM", country: "Mocambique" },
]

export function formatAirportOption(option: AirportOption) {
  return `${option.city} (${option.code})`
}

export function getAirportDescription(option: AirportOption) {
  return `${option.airport} · ${option.country}`
}

export function normalizeAirportSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}
