import React from "react";
import { PlusCircle, BookmarkCheck, RotateCcw, Library } from "lucide-react";

export default function BorrowingSteps() {
  const steps = [
    {
      step: "01",
      icon: PlusCircle,
      title: "Contribute or Browse",
      description: "Explore our community library catalog or add your own books to share knowledge with fellow readers.",
    },
    {
      step: "02",
      icon: BookmarkCheck,
      title: "Borrow for a Few Days",
      description: "Found something you like? Check it out instantly with our 1-click borrow system for a cozy reading window.",
    },
    {
      step: "03",
      icon: RotateCcw,
      title: "Return & Pass It On",
      description: "Finished reading? Return the book back to the library shelf so other community members can enjoy it next.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3e342a]/10 dark:bg-[#d4a373]/10 text-[#8c6d46] dark:text-[#d4a373] text-xs font-medium tracking-wide">
            <Library className="h-3.5 w-3.5" />
            <span>Simple Library Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1] font-serif">
            How BookNook Works
          </h2>
          <p className="text-xs sm:text-sm text-[#625b52] dark:text-[#a89f91] max-w-md mx-auto">
            A frictionless community library system built on three simple principles.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, index) => {
            const StepIcon = item.icon;
            return (
              <div
                key={index}
                className="relative group p-6 sm:p-8 rounded-2xl bg-[#faf8f5] dark:bg-[#181614] border border-[#e8e2d9] dark:border-[#2d2924] shadow-sm hover:border-[#8c6d46] dark:hover:border-[#d4a373] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Step Number Watermark */}
                <span className="absolute top-4 right-6 text-3xl font-serif font-bold text-[#e8e2d9] dark:text-[#2d2924] select-none group-hover:text-[#8c6d46]/30 dark:group-hover:text-[#d4a373]/30 transition">
                  {item.step}
                </span>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f2ede4] dark:bg-[#23201d] border border-[#e8e2d9] dark:border-[#2d2924] flex items-center justify-center text-[#8c6d46] dark:text-[#d4a373]">
                    <StepIcon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-bold font-serif text-[#2d2a26] dark:text-[#f0eae1]">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#625b52] dark:text-[#a89f91] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#e8e2d9]/60 dark:border-[#2d2924]/60 flex items-center text-xs font-medium text-[#8c6d46] dark:text-[#d4a373]">
                  <span>Step {item.step} of 03</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}