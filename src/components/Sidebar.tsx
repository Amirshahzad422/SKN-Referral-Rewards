import { cookies } from "next/headers";
import SidebarClient from "./SidebarClient";
import { verifyAuthToken, getUserRole } from "@/lib/auth";

export default async function Sidebar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("skn_token")?.value;
  const user = verifyAuthToken(token || "") || { uid: "", email: "" };
  const role = getUserRole(user.uid);
  console.log('Sidebar user data:', user);
  return <SidebarClient user={user} role={role} />;
} 