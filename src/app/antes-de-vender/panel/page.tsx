import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LoginForm } from "@/app/admin/blog/AdminBlogClient";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";
import PanelDiagnostico from "@/components/diagnostico/PanelDiagnostico";

// Panel interno: protegido con la misma sesión que /admin (cookie HMAC).
export const metadata: Metadata = {
  title: "Panel de diagnósticos — demo interna",
  robots: { index: false, follow: false },
};

export default async function PanelPage() {
  const cookieStore = await cookies();
  const isAuth = verifySession(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!isAuth) return <LoginForm />;
  return <PanelDiagnostico />;
}
