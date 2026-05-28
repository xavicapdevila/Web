import { cookies } from "next/headers";
import { LoginForm } from "./blog/AdminBlogClient";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("tvh_admin")?.value === "authenticated";

  if (!isAuth) {
    return <LoginForm />;
  }

  return <AdminShell>{children}</AdminShell>;
}
