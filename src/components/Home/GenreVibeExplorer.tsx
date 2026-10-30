"use client";

import React, { useState } from "react";
import { Sparkles, Compass, Coffee, Flame, Moon, BookOpen } from "lucide-react";

export default function GenreVibeExplorer() {
  const [selectedVibe, setSelectedVibe] = useState("cozy");

  const vibes = [
    {
      id: "cozy",
      label: "Cozy Rainy Day",
      icon: Coffee,
      description: "Heartwarming tales, comforting classics, and slow-burn stories for a quiet afternoon.",
      featuredBook: "The Secret Garden Classics",
      author: "Frances Hodgson Burnett",
      readTime: "3-4 days avg.",
    },
    {
      id: "thrill",
      label: "Late Night Mystery",
      icon: Flame,
      description: "Gripping page-turners, psychological twists, and suspenseful whodunits.",
      featuredBook: "The Shadow on the Shelf",
      author: "Arthur Conan Doyle",
      readTime: "2 days avg.",
    },
    {
      id: "focus",
      label: "Mind & Wisdom",
      icon: Compass,
      description: "Philosophical insights, historical deep dives, and reflective growth essays.",
      featuredBook: "Meditations on Solitude",
      author: "Marcus Aurelius",
      readTime: "5 days avg.",
    },
    {
      id: "dreamy",
      label: "Quiet Evening",
      icon: Moon,
      description: "Atmospheric fiction and poetic prose to wind down before sleep.",
      featuredBook: "Under the Starlit Library",
      author: "Elena Rostova",
      readTime: "3 days avg.",
    },
  ];

  const currentVibeData = vibes.find((v) => v.id === selectedVibe) || vibes[0];
  const IconComponent = currentVibeData.icon;

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#f4efe6] dark:bg-[#151312] border border-[#e8e2d9] dark:border-[#2d2924] rounded-2xl transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3e342a]/10 dark:bg-[#d4a373]/10 text-[#8c6d46] dark:text-[#d4a373] text-xs font-medium tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Reading Matcher</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1] font-serif">
            What is Your Reading Vibe Today?
          </h2>
          <p className="text-xs sm:text-sm text-[#625b52] dark:text-[#a89f91] max-w-lg mx-auto">
            Select your current mood below and let BookNook recommend a matching atmosphere from our catalog.
          </p>
        </div>

        {/* Vibe Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vibes.map((vibe) => {
            const VibeIcon = vibe.icon;
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                  isSelected
                    ? "bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] border-transparent shadow-md scale-[1.02]"
                    : "bg-[#faf8f5] dark:bg-[#1c1917] border-[#e8e2d9] dark:border-[#2d2924] text-[#625b52] dark:text-[#a89f91] hover:border-[#8c6d46] dark:hover:border-[#d4a373]"
                }`}
              >
                <VibeIcon className="h-5 w-5 mb-2" />
                <span className="text-xs font-semibold">{vibe.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vibe Showcase Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#faf8f5] dark:bg-[#1c1917] border border-[#e8e2d9] dark:border-[#2d2924] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-[#8c6d46] dark:text-[#d4a373] text-xs font-semibold uppercase tracking-wider">
              <IconComponent className="h-4 w-4" />
              <span>Curated Vibe Match</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2d2a26] dark:text-[#f0eae1]">
              {currentVibeData.featuredBook}
            </h3>
            <p className="text-xs sm:text-sm text-[#625b52] dark:text-[#a89f91] leading-relaxed">
              {currentVibeData.description}
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-[#736a5e] dark:text-[#8a8175]">
              <span>Author: <strong className="text-[#2d2a26] dark:text-[#f0eae1]">{currentVibeData.author}</strong></span>
              <span>•</span>
              <span>Typical Borrow: <strong className="text-[#2d2a26] dark:text-[#f0eae1]">{currentVibeData.readTime}</strong></span>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href="/books"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-xs font-medium shadow hover:opacity-90 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Borrow This Vibe</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}