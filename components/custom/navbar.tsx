import { Plane } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { auth, signOut } from "@/app/(auth)/auth";

import { History } from "./history";
import { LocaleSwitcher } from "./locale-switcher";
import { NavbarLoginCta } from "./navbar-login-cta";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function getNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const firstToken = localPart.split(/[._-]/)[0] ?? localPart;
  const match = firstToken.match(/^[a-zA-ZÀ-ÿ]+/);
  const raw = (match?.[0] ?? firstToken).trim();
  if (!raw) return email;
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

export const Navbar = async () => {
  let session = await auth();
  const t = await getTranslations("Navbar");

  if (!session) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane size={18} />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                TopTrip
              </span>
            </Link>
            <div className="flex flex-row gap-2 items-center">
              <LocaleSwitcher />
              <NavbarLoginCta label={t("login")} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <History user={session?.user} />
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane size={18} />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                TopTrip
              </span>
            </Link>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <LocaleSwitcher />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-9 px-3 font-normal" variant="secondary">
                  {session.user?.email
                    ? getNameFromEmail(session.user.email)
                    : t("profile")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full">
                    {t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ThemeToggle />
                </DropdownMenuItem>
                <DropdownMenuItem className="p-1 z-50">
                  <form
                    className="w-full"
                    action={async () => {
                      "use server";

                      await signOut({
                        redirectTo: "/",
                      });
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full text-left px-1 py-0.5 text-red-500"
                    >
                      {t("logout")}
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
