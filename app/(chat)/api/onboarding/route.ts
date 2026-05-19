import { z } from "zod";

import { auth } from "@/app/(auth)/auth";
import {
  getUserPreferenceByUserId,
  upsertUserPreference,
} from "@/db/queries";

const preferencesSchema = z.object({
  travelStyle: z.enum(["relax", "balanced", "adventure"]),
  interests: z.array(z.string()).min(1),
  pace: z.enum(["slow", "normal", "fast"]),
  likes: z.string().min(3),
  avoid: z.string().optional().default(""),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const pref = await getUserPreferenceByUserId({ id: session.user.id });

  return Response.json({
    exists: Boolean(pref),
    preferences: pref?.preferences ?? null,
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const preferences = preferencesSchema.parse(body);

  await upsertUserPreference({
    userId: session.user.id,
    preferences,
  });

  return new Response(null, { status: 204 });
}
