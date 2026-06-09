import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import PlanoEditor from "./PlanoEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ ref: string }> };

export default async function PlanoAdminPage({ params }: Props) {
  const { ref } = await params;
  const db  = getDb();
  const row = db.prepare("SELECT ref, titulo, imagenes, plano_pins FROM properties WHERE ref = ?").get(ref) as
    { ref: string; titulo: string; imagenes: string; plano_pins: string } | undefined;

  if (!row) notFound();

  const imagenes   = JSON.parse(row.imagenes   ?? "[]");
  const planoPins  = JSON.parse(row.plano_pins  ?? "[]");
  const planoImg   = imagenes.find((i: { url: string; eti?: string }) => i.eti === "plano");

  if (!planoImg) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-[#888] text-sm">Esta propiedad no tiene imagen de plano (eti = &quot;plano&quot;).</p>
        <p className="text-[#555] text-xs mt-2">Asegúrate de que la imagen del plano esté etiquetada con <code className="text-[#C9B99A]">eti=plano</code> en el origen de datos.</p>
      </div>
    );
  }

  return (
    <PlanoEditor
      ref_={ref}
      titulo={row.titulo}
      planoUrl={planoImg.url}
      imagenes={imagenes}
      initialPins={planoPins}
    />
  );
}
