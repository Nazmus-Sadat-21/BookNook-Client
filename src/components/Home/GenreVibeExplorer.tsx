"use client";

import React, { useState } from "react";
import { Sparkles, Compass, Coffee, Flame, Moon, BookOpen, Clock, User, Bookmark } from "lucide-react";
import Link from "next/link";

export default function GenreVibeExplorer() {
  const [selectedVibe, setSelectedVibe] = useState("cozy");

  const vibes = [
    {
      id: "cozy",
      label: "Cozy Rainy Day",
      icon: Coffee,
      description: "Heartwarming tales, comforting classics, and slow-burn stories for a quiet afternoon by the window.",
      featuredBook: "The Secret Garden Classics",
      author: "Frances Hodgson Burnett",
      readTime: "3-4 days avg.",
      badge: "Reader Favorite",
      coverColor: "from-[#4a3525] via-[#2f2319] to-[#1a130f]",
    },
    {
      id: "thrill",
      label: "Late Night Mystery",
      icon: Flame,
      description: "Gripping page-turners, psychological twists, and suspenseful whodunits to keep you guessing.",
      featuredBook: "The Shadow on the Shelf",
      author: "Arthur Conan Doyle",
      readTime: "2 days avg.",
      badge: "High Suspense",
      coverColor: "from-[#25384a] via-[#16242f] to-[#0e161c]",
    },
    {
      id: "focus",
      label: "Mind & Wisdom",
      icon: Compass,
      description: "Philosophical insights, historical deep dives, and reflective growth essays for deep contemplation.",
      featuredBook: "Meditations on Solitude",
      author: "Marcus Aurelius",
      readTime: "5 days avg.",
      badge: "Timeless Classic",
      coverColor: "from-[#4a2525] via-[#2f1919] to-[#1c0f0f]",
    },
    {
      id: "dreamy",
      label: "Quiet Evening",
      icon: Moon,
      description: "Atmospheric fiction and poetic prose designed to gently wind down before sleep.",
      featuredBook: "Under the Starlit Library",
      author: "Elena Rostova",
      readTime: "3 days avg.",
      badge: "Atmospheric",
      coverColor: "from-[#254a31] via-[#162f1e] to-[#0f1c12]",
    },
  ];

  const currentVibeData = vibes.find((v) => v.id === selectedVibe) || vibes[0];
  const IconComponent = currentVibeData.icon;

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8c6d46]/15 border border-[#8c6d46]/30 text-[#8c6d46] dark:text-[#d4a373] font-mono text-xs uppercase tracking-widest mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Interactive Reading Matcher
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1]">
          What is Your Reading Vibe Today?
        </h2>
        <p className="mt-2 text-sm font-mono text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
          Select your current mood below and let BookNook recommend a matching atmosphere from our catalog.
        </p>
      </div>

      {/* Main Container */}
      <div className="relative rounded-3xl border border-stone-300 dark:border-stone-800 bg-[#fbf9f5] dark:bg-[#161412] p-6 sm:p-10 shadow-2xl overflow-hidden transition-colors">
        
        {/* Vibe Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {vibes.map((vibe) => {
            const VibeIcon = vibe.icon;
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#3e342a] text-[#faf8f5] dark:bg-[#d4a373] dark:text-[#181614] border-transparent shadow-lg scale-[1.02]"
                    : "bg-stone-200/50 dark:bg-stone-900/60 border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-[#8c6d46] dark:hover:border-[#d4a373]"
                }`}
              >
                <VibeIcon className="h-5 w-5 mb-2" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">{vibe.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vibe Showcase Card */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-[#8c6d46]/40 bg-[#f2ede4]/50 dark:bg-[#12100e] flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500">
          
          {/* Simulated 3D Book Cover Card */}
          <div className={`relative w-40 sm:w-48 aspect-[3/4] rounded-xl p-5 flex flex-col justify-between shadow-xl border border-[#e9d9ab]/30 bg-gradient-to-br ${currentVibeData.coverColor} shrink-0 transform transition-all duration-500 hover:scale-105`}>
            {/* Gold foil decorative inner border */}
            <div className="absolute inset-2.5 border border-[#e9d9ab]/40 rounded-lg pointer-events-none" />
            
            <div className="relative z-10">
              <span className="px-2 py-0.5 rounded bg-[#b4473f] text-[9px] font-mono font-bold tracking-wider text-white uppercase shadow">
                {currentVibeData.badge}
              </span>
            </div>

            <div className="relative z-10 my-auto text-center px-1">
              <h4 className="font-serif text-lg font-bold text-[#faf8f5] leading-snug drop-shadow">
                {currentVibeData.featuredBook}
              </h4>
              <p className="mt-1 font-mono text-[10px] text-[#e9d9ab] tracking-wider uppercase truncate">
                {currentVibeData.author}
              </p>
            </div>

            <div className="relative z-10 text-center font-mono text-[9px] uppercase text-stone-300 tracking-widest">
              BookNook Archives
            </div>
          </div>

          {/* Vibe Details */}
          <div className="space-y-4 max-w-xl text-left flex-1">
            <div className="inline-flex items-center gap-2 text-[#8c6d46] dark:text-[#d4a373] font-mono text-xs font-semibold uppercase tracking-widest">
              <IconComponent className="h-4 w-4" />
              <span>Curated Vibe Match: {currentVibeData.label}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#2d2a26] dark:text-[#f0eae1]">
              {currentVibeData.featuredBook}
            </h3>

            <p className="text-stone-700 dark:text-stone-300 font-serif text-base leading-relaxed italic border-l-2 border-[#8c6d46] pl-4">
              &ldquo;{currentVibeData.description}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#8c6d46] dark:text-[#d4a373]" />
                <span>Author: <strong className="text-[#2d2a26] dark:text-[#f0eae1]">{currentVibeData.author}</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#8c6d46] dark:text-[#d4a373]" />
                <span>Typical Borrow: <strong className="text-[#2d2a26] dark:text-[#f0eae1]">{currentVibeData.readTime}</strong></span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="shrink-0 w-full md:w-auto text-center md:text-right">
            <Link
              href="/books"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3e342a] text-[#faf8f5] font-mono text-xs font-bold uppercase tracking-wider dark:bg-[#d4a373] dark:text-[#181614] shadow-lg hover:brightness-110 transition cursor-pointer w-full md:w-auto"
            >
              <BookOpen className="h-4 w-4" />
              <span>Borrow This Vibe</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}