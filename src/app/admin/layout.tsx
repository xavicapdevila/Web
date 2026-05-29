import { cookies } from "next/headers";
import { LoginForm } from "./blog/AdminBlogClient";
import AdminShell from "./AdminShell";
import { initDbFromBlob } from "@/lib/db";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("tvh_admin")?.value === "authenticated";

  if (!isAuth) {
    return <LoginForm />;
  }

  // Restore DB from Blob on cold container starts so admin pages always
  // see the latest synced data regardless of which container handles the request.
  await initDbFromBlob();

  return <AdminShell>{children}</AdminShell>;
}
