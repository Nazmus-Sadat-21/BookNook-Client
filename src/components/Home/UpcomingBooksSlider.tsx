"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingBooks = [
  {
    id: 1,
    title: "The Midnight Archivist",
    author: "Elena Vance",
    genre: "Historical Mystery",
    releaseDate: "Arriving Nov 18, 2026",
    description: "Deep within the catacombs of an ancient European monastery, a junior archivist discovers a series of missing manuscripts that rewrite the timeline of the Renaissance.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    badge: "Most Anticipated"
  },
  {
    id: 2,
    title: "Chronicles of the Glass Tower",
    author: "Julian Sterling",
    genre: "Epic Fantasy",
    releaseDate: "Arriving Dec 02, 2026",
    description: "In a world where light is harnessed as currency, a disgraced scholar stumbles upon a forbidden spell capable of shattering the eternal twilight.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    badge: "Staff Pick"
  },
  {
    id: 3,
    title: "Echoes on the Silk Road",
    author: "Amina Al-Farooq",
    genre: "Historical Fiction",
    releaseDate: "Arriving Dec 15, 2026",
    description: "A sweeping journey across ancient trade routes following two star-crossed merchants carrying a secret ledger that could change empires.",
    coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=600",
    badge: "Exclusive Preview"
  },
  {
    id: 4,
    title: "The Quantum Botanist",
    author: "Dr. Silas Thorne",
    genre: "Sci-Fi / Speculative",
    releaseDate: "Arriving Jan 10, 2027",
    description: "When rare flora brought back from a distant exoplanet begins communicating with its caretaker, humanity must reconsider what it means to be alive.",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    badge: "Next Wave"
  }
];

export default function UpcomingBooksSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slider every 4.5 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % upcomingBooks.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + upcomingBooks.length) % upcomingBooks.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % upcomingBooks.length);
  };

  const currentBook = upcomingBooks[currentIndex];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8c6d46]/15 border border-[#8c6d46]/30 text-[#8c6d46] dark:text-[#d4a373] font-mono text-xs uppercase tracking-widest mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Curated Catalog Preview
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1]">
          Upcoming Books
        </h2>
        <p className="mt-2 text-sm font-mono text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
          Get a sneak peek at the highly anticipated titles soon joining our community shelves.
        </p>
      </div>

      {/* Main Container with Light and Dark Mode Support */}
      <div
        className="relative rounded-3xl border border-stone-300 dark:border-stone-800 bg-[#fbf9f5] dark:bg-[#161412] p-6 sm:p-12 shadow-2xl overflow-hidden max-w-5xl mx-auto transition-colors"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative grid grid-cols-1 md:grid-cols-[15rem_minmax(0,1fr)] gap-8 sm:gap-12 items-center">
          
          {/* Real Book Cover Image Card */}
          <div className="relative mx-auto w-48 sm:w-60 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#8c6d46]/40 bg-stone-200 dark:bg-stone-900 transition-transform duration-500 hover:scale-[1.02]">
            <img
              src={currentBook.coverUrl}
              alt={currentBook.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            
            {/* Top Badge Overlay */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <span className="px-2.5 py-1 rounded bg-[#b4473f] text-[10px] font-mono font-bold tracking-wider text-white uppercase shadow-md">
                {currentBook.badge}
              </span>
            </div>

            {/* Genre on Cover Bottom */}
            <div className="absolute bottom-3 left-3 right-3 text-center z-10">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#e9d9ab] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                {currentBook.genre}
              </span>
            </div>
          </div>

          {/* Book Information & Navigation Area */}
          <div className="space-y-6 text-left flex flex-col justify-center">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#8c6d46] dark:text-[#d4a373] uppercase tracking-widest font-semibold">
                <Calendar className="h-4 w-4" /> {currentBook.releaseDate}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d2a26] dark:text-[#f0eae1] mt-2">
                {currentBook.title}
              </h3>
              <p className="font-mono text-sm text-stone-600 dark:text-stone-400 mt-1">
                By <span className="text-[#8c6d46] dark:text-[#e9d9ab] font-medium">{currentBook.author}</span>
              </p>
            </div>

            <p className="text-stone-700 dark:text-stone-300 font-serif text-base sm:text-lg leading-relaxed border-l-2 border-[#8c6d46] pl-4 italic">
              &ldquo;{currentBook.description}&rdquo;
            </p>

            {/* Slider Controls & Indicators */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {upcomingBooks.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx ? "w-8 bg-[#8c6d46] dark:bg-[#d4a373]" : "w-2.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400 dark:hover:bg-stone-500"
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  aria-label="Previous book"
                  className="h-10 w-10 rounded-xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/60 text-[#2d2a26] dark:text-[#f0eae1] hover:bg-[#3e342a] hover:text-[#e9d9ab] cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  aria-label="Next book"
                  className="h-10 w-10 rounded-xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/60 text-[#2d2a26] dark:text-[#f0eae1] hover:bg-[#3e342a] hover:text-[#e9d9ab] cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}