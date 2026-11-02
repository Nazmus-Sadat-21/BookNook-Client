"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, LogIn } from "lucide-react";
import AuthDialog from "./../sign-in-2/page";

const FOIL = "#e9d9ab";

export default function UserLoginCheck() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section
        aria-labelledby="locked-title"
        className="flex w-full max-w-md flex-col items-center text-center"
      >
        {/* ───────── The locked book ───────── */}
        <div aria-hidden className="relative w-40 sm:w-44">
          {/* page block */}
          <div
            className="absolute inset-y-[6px] -right-[8px] left-3 rounded-r-[5px] bg-stone-200 dark:bg-stone-600"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,.09) 2px 3px)",
            }}
          />

          {/* cover */}
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-l-[3px] rounded-r-[7px] bg-[#3e342a] shadow-[0_26px_34px_-16px_rgba(0,0,0,.6)]"
          >
            {/* gold-foil border */}
            <div
              className="absolute inset-3 left-6 rounded-[3px] border"
              style={{ borderColor: "rgba(233,217,171,.5)" }}
            />
            <div
              className="absolute inset-[18px] left-[30px] rounded-[2px] border"
              style={{ borderColor: "rgba(233,217,171,.22)" }}
            />

            {/* spine + hinge */}
            <div
              className="absolute inset-y-0 left-0 w-4"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,.45) 0%, rgba(255,255,255,.2) 45%, rgba(0,0,0,.18) 80%, transparent 100%)",
              }}
            />
            <div className="absolute inset-y-0 left-[19px] w-px bg-black/30" />

            {/* gloss */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/25" />

            {/* leather strap with stitching */}
            <div className="absolute inset-x-0 top-[44%] h-7 border-y border-black/40 bg-[#2a2219] shadow-[0_3px_6px_rgba(0,0,0,.35)]">
              <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed"
                style={{ borderColor: "rgba(233,217,171,.45)" }}
              />
            </div>

            {/* brass lock */}
            <div
              className="absolute left-1/2 top-[44%] flex h-12 w-12 -translate-x-1/2 -translate-y-[6px] items-center justify-center rounded-full border border-[#6b4f1c] shadow-[0_6px_10px_-2px_rgba(0,0,0,.55),inset_0_1px_1px_rgba(255,255,255,.55)]"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #f1dc9c 0%, #d2ac55 45%, #8a6a28 100%)",
              }}
            >
              <Lock className="h-5 w-5 text-[#3a280d]" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        {/* shelf */}
        <div aria-hidden className="w-64">
          <div className="h-3 rounded-t-[2px] bg-[#3e342a]/20 dark:bg-white/10" />
          <div className="h-1.5 bg-[#3e342a]/40 dark:bg-white/20" />
        </div>

        {/* ───────── Message ───────── */}
        <h1
          id="locked-title"
          className="mt-10 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#2d2a26] dark:text-[#f0eae1] sm:text-4xl"
        >
          Sign in to open this shelf
        </h1>
        <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
          This part of BookNook is for signed-in members. Sign in to add books,
          borrow them and manage your own shelf.
        </p>

        {/* ───────── Actions ───────── */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-2 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-[6px] bg-[#3e342a] px-7 text-sm font-semibold text-[#faf8f5] shadow-md outline-none transition-[filter,transform] hover:brightness-125 focus-visible:ring-2 focus-visible:ring-[#8c6d46] focus-visible:ring-offset-2 active:translate-y-px dark:bg-[#d4a373] dark:text-[#181614] dark:focus-visible:ring-offset-stone-950 sm:w-auto"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </button>

          <Link
            href="/"
            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[6px] px-6 text-sm font-medium text-stone-600 outline-none transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#8c6d46] dark:text-stone-400 dark:hover:bg-white/10 sm:w-auto"
          >
            Return home
          </Link>
        </div>
      </section>

      {/* Controlled AuthDialog modal */}
      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode="login"
      />
    </main>
  );
}