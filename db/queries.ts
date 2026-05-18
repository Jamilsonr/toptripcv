import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { user, chat, User, reservation, userPreference } from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
function getDatabaseUrl() {
  const raw =
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL_NON_POOLING;

  if (!raw) {
    throw new Error(
      "Database URL not defined. Set POSTGRES_URL (preferred) or DATABASE_URL.",
    );
  }

  try {
    const url = new URL(raw);
    url.searchParams.set("sslmode", "require");
    return url.toString();
  } catch {
    const joiner = raw.includes("?") ? "&" : "?";
    return `${raw}${joiner}sslmode=require`;
  }
}

let db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (db) return db;
  const client = postgres(getDatabaseUrl());
  db = drizzle(client);
  return db;
}

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await getDb().select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await getDb().insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await getDb().select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await getDb()
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await getDb().insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await getDb().delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await getDb()
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await getDb()
      .select()
      .from(chat)
      .where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function createReservation({
  id,
  userId,
  details,
}: {
  id: string;
  userId: string;
  details: any;
}) {
  return await getDb().insert(reservation).values({
    id,
    createdAt: new Date(),
    userId,
    hasCompletedPayment: false,
    details: JSON.stringify(details),
  });
}

export async function getReservationById({ id }: { id: string }) {
  const [selectedReservation] = await getDb()
    .select()
    .from(reservation)
    .where(eq(reservation.id, id));

  return selectedReservation;
}

export async function updateReservation({
  id,
  hasCompletedPayment,
}: {
  id: string;
  hasCompletedPayment: boolean;
}) {
  return await getDb()
    .update(reservation)
    .set({
      hasCompletedPayment,
    })
    .where(eq(reservation.id, id));
}

export async function getUserPreferenceByUserId({ id }: { id: string }) {
  const [selected] = await getDb()
    .select()
    .from(userPreference)
    .where(eq(userPreference.userId, id));

  return selected;
}

export async function upsertUserPreference({
  userId,
  preferences,
}: {
  userId: string;
  preferences: any;
}) {
  const now = new Date();
  const existing = await getUserPreferenceByUserId({ id: userId });

  if (existing) {
    return await getDb()
      .update(userPreference)
      .set({
        updatedAt: now,
        preferences: JSON.stringify(preferences),
      })
      .where(eq(userPreference.userId, userId));
  }

  return await getDb().insert(userPreference).values({
    userId,
    createdAt: now,
    updatedAt: now,
    preferences: JSON.stringify(preferences),
  });
}
