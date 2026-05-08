import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/custom/chat";
import { Onboarding } from "@/components/custom/onboarding";
import { getUserPreferenceByUserId } from "@/db/queries";
import { generateUUID } from "@/lib/utils";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const pref = await getUserPreferenceByUserId({ id: session.user.id });

  if (!pref) {
    return <Onboarding />;
  }

  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
}
