"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Home, Library, Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] bg-[#faf8f5] dark:bg-[#151312] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#d4a373]/15 dark:bg-[#d4a373]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#3e342a]/10 dark:bg-[#d4a373]/5 blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        
        {/* Visual 404 Badge with Library Bookmark Motif */}
        <div className="relative inline-block">
          <div className="mx-auto h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-[#3e342a] dark:bg-[#201d1a] border-2 border-[#8c6d46]/30 dark:border-[#d4a373]/30 shadow-2xl flex items-center justify-center text-[#faf8f5] dark:text-[#d4a373] transform -rotate-3 transition-transform hover:rotate-0 duration-300">
            <BookOpen className="h-12 w-12 sm:h-14 sm:w-14" />
          </div>
          
          {/* Overlaid 404 Tag */}
          <div className="absolute -bottom-3 -right-3 bg-[#8c6d46] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] font-mono text-sm font-bold px-3 py-1 rounded-full shadow-lg tracking-wider">
            PAGE 404
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2d2a26] dark:text-[#f0eae1] tracking-tight">
            Lost Between the <span className="text-[#8c6d46] dark:text-[#d4a373]">Pages</span>
          </h1>
          <p className="text-sm sm:text-base text-[#625b52] dark:text-[#a89f91] max-w-md mx-auto leading-relaxed">
            The volume or shelf you are searching for seems to have been misplaced, moved, or checked out permanently.
          </p>
        </div>

        {/* Quick Navigation Action Card */}
        <div className="p-6 rounded-3xl bg-[#fdfcfa] dark:bg-[#1c1a18] border border-[#e8e2d9] dark:border-[#2a2622] shadow-xl space-y-4">
          <p className="text-xs uppercase font-bold tracking-wider text-[#8c8275] dark:text-[#8a8175]">
            Where would you like to wander next?
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="py-3 px-4 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] font-medium text-sm hover:opacity-95 shadow-md transition flex items-center justify-center gap-2 group"
            >
              <Home className="h-4 w-4" />
              <span>Back to Reading Nook</span>
            </Link>

            <Link
              href="/books"
              className="py-3 px-4 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-[#2d2a26] dark:text-[#f0eae1] font-medium text-sm hover:bg-[#f2ede4] dark:hover:bg-[#23201d] transition flex items-center justify-center gap-2"
            >
              <Library className="h-4 w-4 text-[#8c6d46] dark:text-[#d4a373]" />
              <span>Explore All Books</span>
            </Link>
          </div>
        </div>

        {/* Subtle Back Button */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c6d46] dark:text-[#d4a373] hover:underline transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Previous Page
          </button>
        </div>

      </div>
    </div>
  );
}