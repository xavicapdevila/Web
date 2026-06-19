import { cookies } from "next/headers";
import { LoginForm } from "./blog/AdminBlogClient";
import AdminShell from "./AdminShell";
import { initDbFromBlob } from "@/lib/db";
import { verifySession, ADMIN_COOKIE } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuth = verifySession(cookieStore.get(ADMIN_COOKIE)?.value);

  if (!isAuth) {
    return <LoginForm />;
  }

  // Restore DB from Blob on cold container starts so admin pages always
  // see the latest synced data regardless of which container handles the request.
  await initDbFromBlob();

  return <AdminShell>{children}</AdminShell>;
}
