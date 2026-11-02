import React from "react";

export default function ProfileLoading() {
  return (
    <main className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Title Header Skeleton */}
      <div className="mb-10 text-center sm:text-left space-y-3">
        <div className="mx-auto sm:mx-0 h-6 w-44 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
        <div className="mx-auto sm:mx-0 h-12 w-3/4 max-w-sm animate-pulse rounded-md bg-stone-300 dark:bg-stone-800" />
        <div className="mx-auto sm:mx-0 h-4 w-full max-w-md animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
      </div>

      {/* Card Wrapper Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[6px] bg-stone-200/50 dark:bg-stone-800/30" />
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[6px] bg-stone-100 dark:bg-stone-800/60" />

        <section className="relative rounded-[6px] border border-stone-300 bg-white px-6 pb-16 pt-6 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:px-10 sm:pt-8 space-y-8">
          {/* Header Rule Skeleton */}
          <div className="flex items-baseline justify-between border-b-2 border-stone-200 dark:border-stone-800 pb-3">
            <div className="h-5 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-28 animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
          </div>

          {/* Main Grid Content Skeleton */}
          <div className="grid gap-8 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-10 items-start">
            {/* Avatar Skeleton */}
            <div className="mx-auto w-40 sm:mx-0 sm:w-full space-y-2">
              <div className="aspect-[3/4] w-full animate-pulse rounded-[4px] bg-stone-200 dark:bg-stone-800" />
              <div className="mx-auto h-3 w-24 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            </div>

            {/* Details Skeleton */}
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <div className="h-8 w-3/4 animate-pulse rounded bg-stone-300 dark:bg-stone-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
              </div>

              <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                    <div className="h-4 w-40 animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar Skeleton */}
          <div className="grid grid-cols-2 divide-x divide-stone-200 rounded-[6px] border-2 border-dashed border-stone-300 p-4 dark:divide-stone-700 dark:border-stone-700">
            <div className="space-y-2 text-center">
              <div className="mx-auto h-8 w-12 animate-pulse rounded bg-stone-300 dark:bg-stone-800" />
              <div className="mx-auto h-4 w-20 animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
            </div>
            <div className="space-y-2 text-center">
              <div className="mx-auto h-8 w-12 animate-pulse rounded bg-stone-300 dark:bg-stone-800" />
              <div className="mx-auto h-4 w-28 animate-pulse rounded bg-stone-200 dark:bg-stone-800/60" />
            </div>
          </div>

          {/* Button Action Bar Skeleton */}
          <div className="flex justify-end pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="h-11 w-32 animate-pulse rounded-[6px] bg-stone-300 dark:bg-stone-700" />
          </div>
        </section>
      </div>
    </main>
  );
}