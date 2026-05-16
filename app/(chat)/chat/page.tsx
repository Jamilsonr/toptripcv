import { auth } from "@/app/(auth)/auth";
import { Onboarding } from "@/components/custom/onboarding";
import { getUserPreferenceByUserId } from "@/db/queries";
import { generateUUID } from "@/lib/utils";

import { ChatPageClient } from "./chat-page-client";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const pref = await getUserPreferenceByUserId({ id: session.user.id });

  if (!pref) {
    return <Onboarding redirectTo="/chat" />;
  }

  const id = generateUUID();
  return <ChatPageClient chatId={id} />;
}

