export default function BookDetailLoading() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d2a26] dark:bg-[#121110] dark:text-[#f0eae1]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(380px,5fr)_7fr]">
        
        {/* ───────── Left Panel: Book Binding & Shelf Showcase Skeleton ───────── */}
        <aside className="relative flex flex-col items-center justify-between px-6 pb-16 pt-24 lg:sticky lg:top-0 lg:h-screen lg:py-12 bg-transparent shadow-none">
          {/* Back Button Pulse */}
          <div className="w-full max-w-sm flex justify-start z-10">
            <div className="h-11 w-36 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
          </div>

          {/* Large 3D Book Cover Container Skeleton */}
          <div className="relative w-[min(85%,380px)] my-auto lg:w-[min(80%,420px)] aspect-[3/4] animate-pulse rounded-r-[10px] bg-stone-200 dark:bg-stone-800 shadow-xl" />

          {/* Wooden Shelf Base Skeleton */}
          <div className="w-[90%] max-w-[440px] pt-4 space-y-1">
            <div className="h-3.5 w-full animate-pulse rounded-t-[3px] bg-stone-300 dark:bg-stone-800" />
            <div className="h-2 w-full animate-pulse bg-stone-400 dark:bg-stone-700" />
          </div>
        </aside>

        {/* ───────── Right Panel: Archive Record & Borrow Slip Skeleton ───────── */}
        <article className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10 lg:py-20 flex flex-col justify-between">
          <div>
            {/* Title & Author Header Skeleton */}
            <div className="border-b border-stone-200 dark:border-stone-800 pb-8 space-y-4">
              <div className="h-4 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-10 w-4/5 animate-pulse rounded bg-stone-300 dark:bg-stone-800" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
            </div>

            {/* Catalog Index Card Details Skeleton */}
            <section className="mt-8 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8 space-y-6">
              <div className="flex items-baseline justify-between gap-4 border-b-2 border-stone-200 dark:border-stone-800 pb-3">
                <div className="h-6 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                <div className="h-5 w-24 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-1">
                    <div className="h-4 w-28 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                    <div className="h-4 w-36 animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
                  </div>
                ))}
              </div>
            </section>

            {/* Synopsis Section Skeleton */}
            <section className="mt-10 space-y-4">
              <div className="h-7 w-40 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="rounded-2xl border border-stone-200 bg-white/60 p-6 dark:border-stone-800 dark:bg-stone-900/40 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              </div>
            </section>
          </div>

          {/* Borrow Slip Action Bar Skeleton */}
          <section className="mt-12 flex flex-col gap-6 rounded-2xl border border-stone-300 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-12 animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800" />
              <div className="space-y-2">
                <div className="h-5 w-36 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                <div className="h-3 w-48 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
              </div>
            </div>
            <div className="h-11 w-32 animate-pulse rounded-lg bg-stone-300 dark:bg-stone-700" />
          </section>
        </article>
      </div>
    </main>
  );
}