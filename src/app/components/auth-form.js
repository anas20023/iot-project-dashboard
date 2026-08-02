"use client";

import Link from "next/link";
import { useActionState } from "react";

const initialState = { error: "" };

export default function AuthForm({ mode, action }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isLogin = mode === "login";

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="brand-mark">SD</div>
        <p className="eyebrow">Smart Door</p>
        <h1 id="auth-title">{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="auth-subtitle">
          {isLogin ? "Sign in to monitor and control your door." : "Set up secure access to your smart door."}
        </p>
        <form action={formAction} className="auth-form">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required minLength="6" placeholder="At least 6 characters" />
          <p className="password-note">Use at least 6 characters, including a letter and a number.</p>
          {state?.error && <p className="form-error" role="alert">{state.error}</p>}
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </button>
        </form>
        <p className="auth-switch">
          {isLogin ? "New here?" : "Already have an account?"} {" "}
          <Link href={isLogin ? "/signup" : "/login"}>{isLogin ? "Create an account" : "Log in"}</Link>
        </p>
      </section>
    </main>
  );
}
