"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  Layers, 
  User, 
  Loader2 
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  coverImage?: string;
  createdAt?: string;
}

export default function HomeBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchFeaturedBooks() {
      try {
        const res = await fetch("http://localhost:8000/featured-books", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (error) {
        console.error("Failed to fetch featured books:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedBooks();
  }, []);

  // Filter books based on search query and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header & Subtitle */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8c6d46]/10 text-[#8c6d46] text-xs font-semibold tracking-wide">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated Archive</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1]">
          New Literary Arrivals
        </h2>
        <p className="text-sm text-[#625b52] dark:text-[#a89f91]">
          Explore the latest additions contributed by our passionate community of book lovers, sorted by recency.
        </p>
      </div>

      {/* Searching & Sorting Toolbar */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa]/90 dark:bg-[#1c1a18]/90 backdrop-blur-md shadow-lg">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8275]" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-xs sm:text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50 transition"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#625b52] dark:text-[#a89f91]">
            <SlidersHorizontal className="h-4 w-4 text-[#8c6d46]" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-2xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-xs sm:text-sm font-medium text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50 transition cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Kids">Kids</option>
            <option value="Others">Others</option>
          </select>
        </div>

      </div>

      {/* Loading or Grid Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#8c6d46]" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-[#fdfcfa] dark:bg-[#1c1a18] rounded-3xl border border-[#e8e2d9] dark:border-[#2a2622]">
          <BookOpen className="h-10 w-10 mx-auto text-[#8c8275] mb-3 opacity-40" />
          <p className="font-serif text-lg font-semibold text-[#2d2a26] dark:text-[#f0eae1]">No books found matching your criteria</p>
          <p className="text-xs text-[#8c8275] dark:text-[#a89f91] mt-1">Try clearing your search query or selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBooks.map((book) => (
            <div 
              key={book._id}
              className="group rounded-[2rem] border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa] dark:bg-[#1c1a18] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Top: Cover & Badge */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#3e342a]/10">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#8c8275]">
                    <BookOpen className="h-10 w-10 opacity-30" />
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-[#3e342a]/85 backdrop-blur-md text-[11px] font-bold text-[#faf8f5] shadow">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Card Body: Title, Author & Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#2d2a26] dark:text-[#f0eae1] line-clamp-1 group-hover:text-[#8c6d46] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs font-medium text-[#8c6d46] dark:text-[#d4a373] flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>By {book.author}</span>
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#e8e2d9]/60 dark:border-[#2a2622] flex items-center justify-between">
                  <span className="text-[11px] text-[#8c8275] flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-[#8c6d46]" />
                    <span>{book.copies ?? 1} copies</span>
                  </span>

                  <Link
                    href={`/books/${book._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3e342a]/10 dark:bg-white/10 text-[#2d2a26] dark:text-[#f0eae1] text-xs font-semibold hover:bg-[#8c6d46] hover:text-white transition-all cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* See All Books CTA Button */}
      <div className="mt-12 text-center">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>See All Books in Archive</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </section>
  );
}