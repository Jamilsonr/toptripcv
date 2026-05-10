import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { auth, signOut } from "@/app/(auth)/auth";

import { History } from "./history";
import { LocaleSwitcher } from "./locale-switcher";
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
      <div className="bg-background absolute top-0 left-0 w-dvw py-3 px-4 flex flex-row items-center justify-between z-30">
        <div className="text-xl md:text-2xl font-semibold tracking-tight text-blue-600 dark:text-blue-500">
          Top Trip
        </div>
        <LocaleSwitcher />
      </div>
    );
  }

  return (
    <>
      <div className="bg-background absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30">
        <div className="flex flex-row gap-3 items-center">
          <History user={session?.user} />
          <Link
            href="/"
            className="text-xl md:text-2xl font-semibold tracking-tight text-blue-600 dark:text-blue-500"
          >
            Top Trip
          </Link>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <LocaleSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="py-1.5 px-2 h-fit font-normal"
                variant="secondary"
              >
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
    </>
  );
};
