"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Spine = { w: number; h: number; c: string };

// Spine colours, taken from your site's browns
const LEFT: Spine[] = [
  { w: 34, h: 150, c: "#3e342a" },
  { w: 42, h: 184, c: "#6b4f33" },
  { w: 30, h: 138, c: "#52402d" },
  { w: 38, h: 170, c: "#7a5c3a" },
  { w: 32, h: 156, c: "#4a3a2c" },
];
const LEAN: Spine = { w: 36, h: 176, c: "#5e4630" };
const RIGHT: Spine[] = [
  { w: 40, h: 162, c: "#52402d" },
  { w: 30, h: 190, c: "#3e342a" },
  { w: 36, h: 144, c: "#6b4f33" },
  { w: 34, h: 172, c: "#7a5c3a" },
];

function BookSpine({
  spine,
  className = "",
  style,
}: {
  spine: Spine;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative shrink-0 rounded-t-[2px] shadow-[2px_0_4px_-2px_rgba(0,0,0,.5)] ${className}`}
      style={{
        width: spine.w,
        height: spine.h,
        backgroundColor: spine.c,
        ...style,
      }}
    >
      {/* cloth shading */}
      <div
        className="absolute inset-0 rounded-t-[2px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,.35) 0%, rgba(255,255,255,.14) 35%, rgba(0,0,0,.05) 70%, rgba(0,0,0,.3) 100%)",
        }}
      />
      {/* gold-foil bands */}
      <span
        className="absolute inset-x-0 top-5 h-px"
        style={{ backgroundColor: "rgba(233,217,171,.6)" }}
      />
      <span
        className="absolute inset-x-0 top-[26px] h-px"
        style={{ backgroundColor: "rgba(233,217,171,.3)" }}
      />
      <span
        className="absolute inset-x-0 bottom-5 h-px"
        style={{ backgroundColor: "rgba(233,217,171,.6)" }}
      />
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="flex min-h-[85vh] items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
      <section
        aria-labelledby="not-found-title"
        className="flex w-full max-w-2xl flex-col items-center text-center"
      >
        {/* ───────── The shelf with a missing book ───────── */}
        <div aria-hidden className="w-full">
          <div className="flex items-end justify-center gap-[3px]">
            {LEFT.map((s, i) => (
              <BookSpine
                key={`l-${i}`}
                spine={s}
                className={i < 2 ? "hidden sm:block" : ""}
              />
            ))}

            {/* leaning book */}
            <BookSpine
              spine={LEAN}
              style={{ transform: "rotate(9deg)", transformOrigin: "bottom right" }}
            />

            {/* the gap */}
            <div
              className="mx-1 flex h-[176px] w-[64px] shrink-0 items-center justify-center rounded-t-[2px] border-2 border-dashed border-stone-400/70 dark:border-stone-500/70"
            >
              <span className="font-serif text-2xl font-semibold text-stone-500 dark:text-stone-400">
                404
              </span>
            </div>

            {RIGHT.map((s, i) => (
              <BookSpine
                key={`r-${i}`}
                spine={s}
                className={i > 1 ? "hidden sm:block" : ""}
              />
            ))}
          </div>

          {/* shelf board */}
          <div className="h-3 rounded-t-[2px] bg-[#3e342a]/25 dark:bg-white/10" />
          <div className="h-1.5 bg-[#3e342a]/50 dark:bg-white/25" />
        </div>

        {/* ───────── Message ───────── */}
        <h1
          id="not-found-title"
          className="mt-12 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-[#2d2a26] dark:text-[#f0eae1] sm:text-5xl"
        >
          This page isn&rsquo;t on the shelf
        </h1>
        <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400 sm:text-base">
          We couldn&rsquo;t find what you were looking for. The page may have
          moved, or the link might have a typo.
        </p>

        {/* ───────── Actions ───────── */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-2 sm:w-auto sm:flex-row">
          <Link
            href="/books"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-[6px] bg-[#3e342a] px-7 text-sm font-semibold text-[#faf8f5] shadow-md outline-none transition-[filter,transform] hover:brightness-125 focus-visible:ring-2 focus-visible:ring-[#8c6d46] focus-visible:ring-offset-2 active:translate-y-px dark:bg-[#d4a373] dark:text-[#181614] dark:focus-visible:ring-offset-stone-950 sm:w-auto"
          >
            Browse books
          </Link>

          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-[6px] px-6 text-sm font-medium text-stone-700 outline-none transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#8c6d46] dark:text-stone-300 dark:hover:bg-white/10 sm:w-auto"
          >
            Go home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] px-6 text-sm font-medium text-[#8c6d46] outline-none transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#8c6d46] dark:text-[#d4a373] dark:hover:bg-white/10 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </section>
    </main>
  );
}