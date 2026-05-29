/**
 * Skeleton shown by Next.js while a property detail page is loading.
 * Matches the layout: gallery hero + content + contact sidebar.
 */
export default function PropertyLoading() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      {/* Gallery skeleton */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-[16/9] lg:aspect-[21/9] max-h-[80vh] bg-[#111] animate-pulse" />
          {/* Thumbnail strip */}
          <div className="hidden lg:flex gap-1 p-1 bg-black">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 aspect-[4/3] bg-[#1a1a1a] animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title + location */}
            <div className="space-y-3">
              <div className="h-9 w-3/4 bg-[#1a1a1a] animate-pulse rounded-sm" />
              <div className="h-5 w-1/2 bg-[#1a1a1a] animate-pulse rounded-sm" />
            </div>
            {/* Price */}
            <div className="h-10 w-40 bg-[#1a1a1a] animate-pulse rounded-sm" />
            {/* Features row */}
            <div className="flex gap-6 py-4 border-y border-[#1e1e1e]">
              {[60, 60, 80].map((w, i) => (
                <div key={i} className="h-12 bg-[#1a1a1a] animate-pulse rounded-sm" style={{ width: `${w}px` }} />
              ))}
            </div>
            {/* Description */}
            <div className="space-y-2">
              {[100, 95, 88, 92, 70].map((w, i) => (
                <div key={i} className="h-4 bg-[#1a1a1a] animate-pulse rounded-sm" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Agent card */}
            <div className="bg-[#111] border border-[#1e1e1e] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#1a1a1a] animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-[#1a1a1a] animate-pulse rounded-sm" />
                  <div className="h-3 w-24 bg-[#1a1a1a] animate-pulse rounded-sm" />
                </div>
              </div>
              <div className="h-11 w-full bg-[#C9B99A]/20 animate-pulse" />
              <div className="h-11 w-full bg-[#1a1a1a] animate-pulse" />
              <div className="h-11 w-full bg-[#1a1a1a] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
