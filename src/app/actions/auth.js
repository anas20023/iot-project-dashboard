"use server";

import { redirect } from "next/navigation";

import { createSession, destroySession } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { hashPassword, verifyPassword } from "@/lib/password";

function credentialsFrom(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 6) return { error: "Use a password with at least 12 characters." };
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return { error: "Your password must include at least one letter and one number." };
  }
  return { email, password };
}

export async function signUp(_previousState, formData) {
  const credentials = credentialsFrom(formData);
  if (credentials.error) return credentials;

  const db = await getDatabase();
  try {
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    const result = await db.collection("users").insertOne({
      email: credentials.email,
      passwordHash: await hashPassword(credentials.password),
      createdAt: new Date(),
    });
    await createSession(result.insertedId);
  } catch (error) {
    if (error?.code === 11000) return { error: "An account with that email already exists. Please log in." };
    console.error("Sign-up failed", error);
    return { error: "We could not create your account. Please try again." };
  }

  redirect("/dashboard");
}

export async function logIn(_previousState, formData) {
  const credentials = credentialsFrom(formData);
  if (credentials.error) return credentials;

  try {
    const db = await getDatabase();
    const user = await db.collection("users").findOne({ email: credentials.email });
    if (!user || !(await verifyPassword(credentials.password, user.passwordHash))) {
      return { error: "Email or password is incorrect." };
    }
    await createSession(user._id);
  } catch (error) {
    console.error("Login failed", error);
    return { error: "We could not log you in. Please try again." };
  }

  redirect("/dashboard");
}

export async function logOut() {
  await destroySession();
  redirect("/login");
}
