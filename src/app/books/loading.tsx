import React from "react";

const LOADER_SPINES = [
  { h: 52, c: "#6b4f33" },
  { h: 40, c: "#8c6d46" },
  { h: 56, c: "#52402d" },
  { h: 46, c: "#a07a4f" },
  { h: 54, c: "#7a5c3a" },
  { h: 42, c: "#8c6d46" },
];

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-[75vh] w-full flex-col items-center justify-center bg-[#f4efe6] px-4 dark:bg-[#151312] transition-colors duration-300"
    >
      {/* Animated Bookshelf Spines */}
      <div className="flex items-end gap-1.5" aria-hidden>
        {LOADER_SPINES.map((s, i) => (
          <span
            key={i}
            className="w-3.5 animate-pulse rounded-t-[2px] motion-reduce:animate-none shadow-sm"
            style={{
              height: s.h,
              backgroundColor: s.c,
              animationDelay: `${i * 140}ms`,
            }}
          />
        ))}
      </div>

      {/* Shelf Base */}
      <div
        aria-hidden
        className="h-1.5 w-56 rounded-[1px] bg-[#3e342a] shadow-sm dark:bg-[#d4a373]/70"
      />

      {/* Status Text */}
      <p className="mt-5 font-serif text-lg font-medium text-[#3e342a] dark:text-[#f0eae1] tracking-wide">
        Pulling your books off the shelf...
      </p>
    </main>
  );
}