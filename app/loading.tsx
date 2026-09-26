/**
 * Route-level loading fallback. Uses the token-driven skeleton utility so
 * it matches the final layout without flashing.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-8">
        <div className="animate-shimmer h-10 w-64 rounded-lg" />
        <div className="animate-shimmer mt-4 h-5 w-96 max-w-full rounded-md" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-shimmer h-40 rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
