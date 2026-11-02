"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, LogIn, Sparkles } from "lucide-react";
import AuthDialog from './../sign-in-2/page';

export default function UserLoginCheck() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[2.5rem] bg-[#fdfcfa] dark:bg-[#1c1a18] border border-[#e8e2d9] dark:border-[#2a2622] p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#8c6d46]/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Icon Badge */}
        <div className="h-16 w-16 rounded-3xl bg-[#8c6d46]/15 text-[#8c6d46] dark:text-[#d4a373] mx-auto flex items-center justify-center shadow-inner">
          <Lock className="h-8 w-8" />
        </div>

        {/* Heading & Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8c6d46]/10 text-[#8c6d46] dark:text-[#d4a373] text-xs font-semibold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Restricted Archive</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d2a26] dark:text-[#f0eae1] tracking-tight">
            Authentication Required
          </h1>
          <p className="text-xs sm:text-sm text-[#8c8275] dark:text-[#a89f91] leading-relaxed">
            You must be logged in to your BookNook account to access this private section and manage your literary collection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Open Auth Dialog Button */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-sm font-bold shadow-xl hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Login to Access</span>
          </button>

          {/* Return Home Link */}
          <Link
            href="/"
            className="w-full py-3 rounded-2xl border border-[#e8e2d9] dark:border-[#2d2924] text-[#625b52] dark:text-[#a89f91] text-sm font-semibold hover:bg-[#faf8f5] dark:hover:bg-[#23201d] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>
        </div>

      </div>

      {/* Controlled AuthDialog Modal */}
      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode="login"
      />
    </main>
  );
}