import { redirect } from "next/navigation";

import { signUp } from "@/app/actions/auth";
import AuthForm from "@/app/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export default async function SignUpPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthForm mode="signup" action={signUp} />;
}
