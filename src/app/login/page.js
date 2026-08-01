import { redirect } from "next/navigation";

import { logIn } from "@/app/actions/auth";
import AuthForm from "@/app/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthForm mode="login" action={logIn} />;
}
