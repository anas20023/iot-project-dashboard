import { redirect } from "next/navigation";

import { logOut } from "@/app/actions/auth";
import DoorDashboard from "@/app/components/door-dashboard";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <DoorDashboard email={user.email} logoutAction={logOut} />;
}
