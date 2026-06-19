// Loading UI para la home (y rutas sin su propio loading.tsx). Aparece al
// instante al navegar, dando feedback mientras el servidor renderiza —
// evita la sensacion de que el clic "no responde" cuando la home tarda.
export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-[#0a0a0a] flex items-center justify-center pt-20">
      <div
        className="w-8 h-8 rounded-full border-2 border-[#C9B99A]/25 border-t-[#C9B99A] animate-spin"
        role="status"
        aria-label="Cargando"
      />
    </div>
  );
}
