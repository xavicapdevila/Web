import { cookies } from "next/headers";
import { LoginForm } from "./blog/AdminBlogClient";
import AdminDashboard from "./AdminDashboard";
import { getDb } from "@/lib/db";

export const metadata = { title: "Admin — The Vila Home" };
export const dynamic = "force-dynamic";

function getAdminStats() {
  try {
    const db = getDb();
    const total = (db.prepare("SELECT COUNT(*) as c FROM properties WHERE estado_ficha = 1").get() as { c: number }).c;
    const venta = (db.prepare("SELECT COUNT(*) as c FROM properties WHERE operacion = 'venta' AND estado_ficha = 1").get() as { c: number }).c;
    const alquiler = (db.prepare("SELECT COUNT(*) as c FROM properties WHERE operacion = 'alquiler' AND estado_ficha = 1").get() as { c: number }).c;
    const lastSync = db.prepare(
      "SELECT synced_at, properties_added, properties_updated, properties_removed, status, source FROM sync_log ORDER BY id DESC LIMIT 1"
    ).get() as { synced_at: string; properties_added: number; properties_updated: number; properties_removed: number; status: string; source: string } | undefined;
    return { total, venta, alquiler, lastSync };
  } catch {
    return { total: 0, venta: 0, alquiler: 0, lastSync: undefined };
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("tvh_admin");
  const isAuth = session?.value === "authenticated";

  if (!isAuth) {
    return <LoginForm />;
  }

  const stats = getAdminStats();

  return <AdminDashboard stats={stats} />;
}
