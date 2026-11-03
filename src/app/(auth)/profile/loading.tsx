export default function ProfileLoading() {
  return (
    <main className="w-full py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-x-hidden animate-pulse">
      
      {/* Skeleton Header Banner */}
      <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl bg-[#3e342a]/80 px-5 sm:px-8 py-6 sm:py-8 pr-12 sm:pr-16 shadow-xl border-l-8 border-[#b4473f]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-3 w-40 bg-stone-500/30 rounded" />
            <div className="h-8 w-72 bg-stone-500/40 rounded" />
          </div>
          <div className="h-7 w-36 bg-white/10 rounded-xl" />
        </div>
      </div>

      {/* Skeleton Main Ledger Container */}
      <div className="relative rounded-2xl sm:rounded-3xl border-2 border-[#8c6d46]/20 bg-[#fbf9f5] dark:bg-[#161412] p-4 sm:p-10 shadow-xl">
        
        {/* Skeleton Tabs */}
        <div className="flex gap-3 border-b-2 border-stone-200 dark:border-stone-800 pb-4">
          <div className="h-9 w-36 bg-stone-200 dark:bg-stone-800 rounded-xl" />
          <div className="h-9 w-36 bg-stone-200 dark:bg-stone-800 rounded-xl" />
        </div>

        {/* Skeleton Content Area */}
        <div className="mt-6 sm:mt-8 space-y-6">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-[13rem_minmax(0,1fr)] items-start">
            
            {/* Skeleton Avatar Box */}
            <div className="mx-auto w-36 sm:w-44 aspect-[3/4] rounded-md bg-stone-200 dark:bg-stone-800 shadow-md" />

            {/* Skeleton Form Fields / Info Lines */}
            <div className="space-y-5 w-full">
              <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-7 w-3/4 bg-stone-300 dark:bg-stone-700 rounded" />
              </div>
              <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-5 w-2/3 bg-stone-300 dark:bg-stone-700 rounded" />
              </div>
              <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div className="h-3 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-5 w-1/2 bg-stone-300 dark:bg-stone-700 rounded" />
              </div>
            </div>
          </div>

          {/* Skeleton Action Button */}
          <div className="flex justify-end pt-6 border-t border-stone-200 dark:border-stone-800">
            <div className="h-11 w-40 bg-stone-300 dark:bg-stone-800 rounded-xl" />
          </div>
        </div>

      </div>
    </main>
  );
}