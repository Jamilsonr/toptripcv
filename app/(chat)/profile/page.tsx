import { auth } from "@/app/(auth)/auth";
import { Onboarding } from "@/components/custom/onboarding";
import { Profile } from "@/components/custom/profile";
import { getUserPreferenceByUserId } from "@/db/queries";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return null;
  }

  const pref = await getUserPreferenceByUserId({ id: session.user.id });

  if (!pref) {
    return <Onboarding redirectTo="/profile" />;
  }

  let preferences: any = pref.preferences;
  if (typeof preferences === "string") {
    try {
      preferences = JSON.parse(preferences);
    } catch {
      preferences = null;
    }
  }

  if (!preferences) {
    return <Onboarding redirectTo="/profile" />;
  }

  return <Profile email={session.user.email} initialPreferences={preferences} />;
}

