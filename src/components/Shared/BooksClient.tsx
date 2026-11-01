"use client";

import React, { useState } from "react";
import { BookOpen, Search, Filter, Sparkles } from "lucide-react";
import BookCard from '@/components/Shared/BookCard';

const CATEGORIES = ["All", "Fiction", "Science", "History", "Kids", "Others"];

export default function BooksClient({ initialBooks }: { initialBooks: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Automatically sort books by creation date (Newest first)
  const sortedBooks = [...initialBooks].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA; // Descending order: newest books appear first
  });

  // 2. Filter the sorted books based on search query and category
  const filteredBooks = sortedBooks.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-300">
      
      {/* Eye-Catching Heading Section */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e2d9] dark:border-[#2d2924] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8c6d46]/10 text-[#8c6d46] text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Library Archives</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1]">
            Explore the Collection
          </h1>
          <p className="text-sm text-[#8c8275] dark:text-[#a89f91] mt-1">
            Discover community-shared stories, history, science, and more.
          </p>
        </div>

        {/* Total Books Count Badge */}
        <div className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-[#3e342a] dark:bg-[#1c1a18] text-[#faf8f5] dark:text-[#f0eae1] border border-[#e8e2d9]/20 shadow-md flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#d4a373]" />
          <span className="text-xs font-semibold">
            Total Books: <span className="text-[#d4a373]">{filteredBooks.length}</span> / {initialBooks.length}
          </span>
        </div>
      </div>

      {/* Controls: Search Bar & Category Filters */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c8275]">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by book title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-sm text-[#2d2a26] dark:text-[#f0eae1] placeholder:text-[#8c8275]/70 focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50 transition"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="w-full md:w-auto flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#625b52] dark:text-[#a89f91] flex items-center gap-1 mr-1 shrink-0">
            <Filter className="h-3.5 w-3.5" /> Shelf:
          </span>
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 cursor-pointer ${
                  active
                    ? "bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] shadow"
                    : "border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-[#625b52] dark:text-[#a89f91] hover:border-[#8c6d46]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Layout: 3 cards per row on desktop */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-[#fdfcfa] dark:bg-[#1c1a18] rounded-3xl border border-[#e8e2d9] dark:border-[#2a2622]">
          <BookOpen className="h-10 w-10 mx-auto text-[#8c8275] mb-3 opacity-50" />
          <h3 className="font-serif text-lg font-semibold text-[#2d2a26] dark:text-[#f0eae1]">No books found</h3>
          <p className="text-xs text-[#8c8275] dark:text-[#a89f91] mt-1">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => (
            <BookCard key={book._id || index} data={book} />
          ))}
        </div>
      )}
    </main>
  );
}