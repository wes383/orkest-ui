/**
 * Route-level loading fallback. Mirrors the real page top-down — sticky
 * header (logo + nav pills + toggles), hero CTA pills, then stacked
 * sections of (title + description + content grid) — so the swap to the
 * hydrated page does not reflow.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-sticky bg-background">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-6 min-w-0">
              <div className="animate-shimmer h-5 w-20 shrink-0 rounded-md" />
              <div className="hidden items-center gap-1 md:flex">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-shimmer h-6 w-14 shrink-0 rounded-md" />
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-shimmer h-8 w-8 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero CTA pills */}
      <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-16 pb-12">
        <div className="flex flex-wrap gap-3">
          <div className="animate-shimmer h-10 w-36 rounded-full" />
          <div className="animate-shimmer h-10 w-36 rounded-full" />
        </div>
      </section>

      {/* Sections: title + description + content grid */}
      <main className="mx-auto max-w-[1200px] px-6 lg:px-8 pb-24 space-y-14">
        {Array.from({ length: 3 }).map((_, s) => (
          <section key={s}>
            <div className="animate-shimmer h-7 w-48 rounded-md mb-2" />
            <div className="animate-shimmer h-4 w-80 max-w-full rounded-md mb-6" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-shimmer h-24 rounded-md border border-border"
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
