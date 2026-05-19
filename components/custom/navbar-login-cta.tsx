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
    <Button className="py-1.5 px-2 h-fit font-normal text-white" asChild>
      <Link href="/login">{label}</Link>
    </Button>
  );
}

