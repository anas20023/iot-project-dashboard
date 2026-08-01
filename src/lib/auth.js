import "server-only";

import { randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";

import { getDatabase } from "@/lib/mongodb";

const SESSION_COOKIE = "smart_door_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function cookieOptions(expires) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export async function createSession(userId) {
  const db = await getDatabase();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.collection("sessions").insertOne({
    token,
    userId,
    expiresAt,
    createdAt: new Date(),
  });
  await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, cookieOptions(expiresAt));
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDatabase();
    await db.collection("sessions").deleteOne({ token });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = await getDatabase();
  const session = await db.collection("sessions").findOne({
    token,
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;

  const user = await db.collection("users").findOne(
    { _id: session.userId },
    { projection: { email: 1 } },
  );
  if (!user) return null;

  return { id: user._id.toString(), email: user.email };
});
