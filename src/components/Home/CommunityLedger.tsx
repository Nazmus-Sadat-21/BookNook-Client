"use client";

import React, { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, BookmarkCheck, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "Eleanor Vance",
    role: "Verified Borrower • Avid Reader",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    bookTitle: "The Secret Garden Classics",
    rating: 5,
    date: "Circulated Oct 24, 2026",
    comment: "The physical ledger feel and seamless borrowing workflow make sharing books feel like stepping into a real neighborhood library. Absolutely love the vintage aesthetic!",
    stamp: "VERIFIED LOAN"
  },
  {
    id: 2,
    name: "Marcus Aurelius Thorne",
    role: "Community Contributor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    bookTitle: "Chronicles of the Glass Tower",
    rating: 5,
    date: "Circulated Nov 01, 2026",
    comment: "Adding my personal collection to the catalog took less than two minutes. Seeing local readers check out my books brings so much joy. A masterpiece of UI design.",
    stamp: "ARCHIVE STAMPED"
  },
  {
    id: 3,
    name: "Clara Sterling",
    role: "First-Time Borrower",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    bookTitle: "Echoes on the Silk Road",
    rating: 5,
    date: "Circulated Nov 03, 2026",
    comment: "The password strength indicator styled as a book spine and the interactive vibe matcher are genius touches. BookNook is easily my favorite web app this year.",
    stamp: "COMMUNITY FAVORITE"
  }
];

interface Contributor {
  name: string;
  email: string;
  image?: string;
  bookCount: number;
}

export default function CommunityLedger() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [topContributors, setTopContributors] = useState<Contributor[]>([]);
  const [loadingContributors, setLoadingContributors] = useState(true);

  // Fetch top contributors from your backend API
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/top-contributors`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTopContributors(data);
        }
        setLoadingContributors(false);
      })
      .catch((err) => {
        console.error("Failed to load top contributors:", err);
        setLoadingContributors(false);
      });
  }, []);

  // Auto-advance reviews slider every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8c6d46]/15 border border-[#8c6d46]/30 text-[#8c6d46] dark:text-[#d4a373] font-mono text-xs uppercase tracking-widest mb-3">
          <Quote className="h-3.5 w-3.5" /> Community Archive & Ledger
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1]">
          Voices of the Library
        </h2>
        <p className="mt-2 text-sm font-mono text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
          Explore reader reflections alongside the top contributors expanding our shared shelves.
        </p>
      </div>

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Reader Reviews Carousel (Span 7) */}
        <div
          className="lg:col-span-7 relative rounded-3xl border border-stone-300 dark:border-stone-800 bg-[#fbf9f5] dark:bg-[#161412] p-6 sm:p-8 shadow-xl overflow-hidden transition-colors h-full flex flex-col justify-between"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Vintage Watermark Quote Icon */}
          <Quote className="absolute right-6 bottom-6 h-32 w-32 text-stone-200 dark:text-stone-900/50 pointer-events-none -z-0 rotate-12" />

          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
            <h3 className="font-serif text-xl font-bold text-[#2d2a26] dark:text-[#f0eae1]">
              Borrower&apos;s Logbook
            </h3>
            <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
              0{currentIndex + 1} / 0{reviews.length}
            </span>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center my-auto">
            
            {/* Reviewer Avatar & Official Stamp Box */}
            <div className="relative shrink-0 text-center">
              <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-md overflow-hidden border-4 border-stone-300 dark:border-stone-700 shadow-xl">
                <img
                  src={currentReview.avatar}
                  alt={currentReview.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Vintage Red Ink Stamp Overlay */}
              <div className="absolute -bottom-3 -right-3 h-14 w-14 rounded-full border-[2.5px] border-dotted border-[#9b2f2a] bg-[#9b2f2a]/15 backdrop-blur-sm flex items-center justify-center transform -rotate-12 pointer-events-none shadow-md z-20">
                <span className="font-mono text-[7px] font-black tracking-tighter uppercase text-[#9b2f2a] dark:text-[#e58a84] text-center leading-tight">
                  {currentReview.stamp.split(" ")[0]}<br />{currentReview.stamp.split(" ")[1]}
                </span>
              </div>
            </div>

            {/* Review Content & Details */}
            <div className="space-y-3 text-left flex-1">
              
              {/* Star Rating & Date */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(currentReview.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
                  {currentReview.date}
                </span>
              </div>

              {/* Testimonial Quote */}
              <p className="font-serif text-base sm:text-lg text-[#2d2a26] dark:text-[#f0eae1] leading-relaxed italic">
                &ldquo;{currentReview.comment}&rdquo;
              </p>

              {/* Book Reference Tag */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8c6d46]/10 text-[#8c6d46] dark:text-[#d4a373] font-mono text-xs font-semibold">
                <BookmarkCheck className="h-3.5 w-3.5" /> Book Loaned: {currentReview.bookTitle}
              </div>

            </div>

          </div>

          {/* Reviewer Info & Navigation */}
          <div className="pt-6 mt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#2d2a26] dark:text-[#f0eae1]">
                {currentReview.name}
              </h4>
              <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
                {currentReview.role}
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePrev}
                aria-label="Previous review"
                className="h-8 w-8 rounded-xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/65 text-[#2d2a26] dark:text-[#f0eae1] hover:bg-[#3e342a] hover:text-[#e9d9ab] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleNext}
                aria-label="Next review"
                className="h-8 w-8 rounded-xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/65 text-[#2d2a26] dark:text-[#f0eae1] hover:bg-[#3e342a] hover:text-[#e9d9ab] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>

        {/* Right Side: Top 3 Contributors Leaderboard (Span 5) */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-300 dark:border-stone-800 bg-[#fbf9f5] dark:bg-[#161412] p-6 sm:p-8 shadow-xl flex flex-col justify-between h-full">
          
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#8c6d46] dark:text-[#d4a373]" />
              <h3 className="font-serif text-xl font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                Top Contributors
              </h3>
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">
              Leaderboard
            </span>
          </div>

          {loadingContributors ? (
            <div className="py-12 text-center font-mono text-xs text-stone-500 animate-pulse">
              Consulting archive ledgers...
            </div>
          ) : topContributors.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-stone-500">
              No contributors recorded yet. Be the first to add a book!
            </div>
          ) : (
            <div className="space-y-4 my-auto">
              {topContributors.map((contributor, index) => (
                <div
                  key={contributor.email || index}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 transition-all hover:border-[#8c6d46]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank Badge */}
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-bold shrink-0 ${
                      index === 0 ? "bg-amber-500 text-white shadow-md" :
                      index === 1 ? "bg-stone-400 text-white shadow-sm" :
                      "bg-[#a0522d] text-white shadow-sm"
                    }`}>
                      #{index + 1}
                    </div>

                    {/* Avatar / Initials */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-200 dark:bg-stone-800 shrink-0 flex items-center justify-center">
                      {contributor.image ? (
                        <img src={contributor.image} alt={contributor.name || "Contributor"} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif font-bold text-xs text-stone-600 dark:text-stone-300">
                          {(contributor.name || contributor.email || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Name & Email */}
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm text-[#2d2a26] dark:text-[#f0eae1] truncate">
                        {contributor.name || "Anonymous Reader"}
                      </h4>
                      <p className="font-mono text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {contributor.email}
                      </p>
                    </div>
                  </div>

                  {/* Books Count Pill */}
                  <div className="shrink-0 pl-3">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#8c6d46]/10 text-[#8c6d46] dark:text-[#d4a373] font-mono text-xs font-bold">
                      <BookOpen className="h-3 w-3" />
                      <span>{contributor.bookCount} {contributor.bookCount === 1 ? "book" : "books"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 mt-6 border-t border-stone-200 dark:border-stone-800 text-center">
            <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
              Contribute books to the archive to secure your place on the leaderboard.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}