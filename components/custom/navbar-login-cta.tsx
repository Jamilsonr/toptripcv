"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";

export function NavbarLoginCta({ label }: { label: string }) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <Button className="h-9 px-3 font-normal" asChild>
      <Link href="/login">{label}</Link>
    </Button>
  );
}
