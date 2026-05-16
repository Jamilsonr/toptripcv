import { auth } from "@/app/(auth)/auth";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { ComoFunciona } from "@/components/home/how-it-works";
import { Navbar } from "@/components/home/navbar";
import { Ofertas } from "@/components/home/offers";
import { DestinosPopulares } from "@/components/home/popular-destinations";
import { Testemunhos } from "@/components/home/testimonials";

export default async function Page() {
  const session = await auth();

  return (
    <main className="min-h-dvh bg-white text-slate-900">
      <Navbar session={session} />
      <Hero isAuthenticated={Boolean(session?.user)} />
      <ComoFunciona />
      <DestinosPopulares />
      <Ofertas />
      <Testemunhos />
      <Footer />
    </main>
  );
}
