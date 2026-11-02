export default function AddBookLoading() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="grid min-h-screen lg:grid-cols-[minmax(340px,5fr)_7fr]">
        
        {/* ───────── Left Column: Preview Placeholder ───────── */}
        <aside
          aria-label="Loading preview"
          className="relative flex flex-col items-center justify-center px-6 pb-14 pt-24 bg-[#3e342a]/80 dark:bg-[#201d1a] lg:sticky lg:top-0 lg:h-screen lg:py-10"
        >
          {/* Back button pulse */}
          <div className="absolute left-5 top-5 h-9 w-20 animate-pulse rounded-full bg-white/10 sm:left-8 sm:top-8" />

          {/* Book Spine / Cover Skeleton */}
          <div className="relative w-[min(60%,260px)] lg:w-[min(58%,300px)]">
            <div className="aspect-[3/4] w-full animate-pulse rounded-l-[4px] rounded-r-[8px] bg-white/10 shadow-2xl" />
          </div>

          {/* Shelf Skeleton */}
          <div className="mt-6 w-[88%] max-w-[420px] space-y-1">
            <div className="h-3 w-full animate-pulse rounded-t-[2px] bg-black/30" />
            <div className="h-1.5 w-full animate-pulse bg-black/50" />
          </div>

          {/* Cover Action Button Pulse */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="h-10 w-36 animate-pulse rounded-full bg-white/10" />
            <div className="h-3 w-48 animate-pulse rounded bg-white/5" />
          </div>
        </aside>

        {/* ───────── Right Column: Form Inputs Skeleton ───────── */}
        <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-10 lg:py-16">
          {/* Heading pulse */}
          <div className="h-10 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800 sm:h-12" />
          <div className="mt-3 h-4 w-3/4 max-w-md animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />

          {/* Form Card Skeleton */}
          <div className="mt-8 rounded-[4px] border border-stone-300 bg-white px-6 pb-14 pt-4 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:px-8 space-y-7">
            {/* Header border rule */}
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-stone-200 dark:border-stone-800 pb-2">
              <div className="h-5 w-24 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-4 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
            </div>

            {/* Title Field Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-12 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-10 w-full animate-pulse rounded border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/30" />
            </div>

            {/* Author Field Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-14 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-10 w-full animate-pulse rounded border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/30" />
            </div>

            {/* Shelf/Category Pills Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-12 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-11 w-20 animate-pulse rounded-[4px] bg-stone-200 dark:bg-stone-800" />
                ))}
              </div>
            </div>

            {/* Copies Counter Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-14 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-11 w-36 animate-pulse rounded-[4px] bg-stone-200 dark:bg-stone-800" />
            </div>

            {/* Synopsis Textarea Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-16 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-36 w-full animate-pulse rounded bg-stone-100 dark:bg-stone-800/30" />
            </div>
          </div>

          {/* Submit Slip Skeleton */}
          <div className="mt-8 rounded-[4px] border-2 border-dashed border-stone-300 p-5 dark:border-stone-700 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="h-4 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="flex items-center gap-2">
              <div className="h-11 w-20 animate-pulse rounded-[6px] bg-stone-200 dark:bg-stone-800" />
              <div className="h-12 flex-1 sm:w-36 animate-pulse rounded-[6px] bg-stone-300 dark:bg-stone-700" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}