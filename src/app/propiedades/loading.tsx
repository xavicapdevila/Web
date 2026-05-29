/**
 * Skeleton shown by Next.js while the /propiedades server component is loading.
 * Matches the exact layout: header + sidebar filters + property grid.
 */
export default function PropiedadesLoading() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-[#1e1e1e] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="h-8 w-52 bg-[#1a1a1a] animate-pulse rounded-sm mb-3" />
          <div className="h-4 w-32 bg-[#1a1a1a] animate-pulse rounded-sm" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar skeleton */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-[#111] border border-[#1e1e1e] p-6 space-y-5">
              {[80, 60, 70, 50, 65].map((w, i) => (
                <div key={i}>
                  <div
                    className="h-3 bg-[#1a1a1a] animate-pulse rounded-sm mb-2"
                    style={{ width: `${w}%` }}
                  />
                  <div className="h-10 w-full bg-[#0a0a0a] border border-[#1e1e1e] animate-pulse" />
                </div>
              ))}
              <div className="h-10 w-full bg-[#C9B99A]/20 animate-pulse" />
            </div>
          </aside>

          {/* Grid skeleton — 9 cards */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-[#111] border border-[#1e1e1e]">
                  <div className="aspect-[4/3] bg-[#1a1a1a] animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-7 w-32 bg-[#1a1a1a] animate-pulse rounded-sm" />
                    <div className="h-4 w-44 bg-[#1a1a1a] animate-pulse rounded-sm" />
                    <div className="flex gap-4 pt-2 border-t border-[#1e1e1e]">
                      <div className="h-4 w-8 bg-[#1a1a1a] animate-pulse rounded-sm" />
                      <div className="h-4 w-8 bg-[#1a1a1a] animate-pulse rounded-sm" />
                      <div className="h-4 w-14 bg-[#1a1a1a] animate-pulse rounded-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
