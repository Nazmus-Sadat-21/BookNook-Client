import BooksClient from "@/components/Shared/BooksClient";
import React from "react";
import { BookOpen } from "lucide-react";

export default async function BooksPage() {
  let books = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/books`,{
      cache:"no-store"
    });
    if (res.ok) {
      books = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch books on server:", error);
  }

  // If no books are found in the database, return a clean fallback UI
  if (!books || books.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md p-8 rounded-3xl border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa] dark:bg-[#1c1a18] shadow-lg">
          <BookOpen className="h-12 w-12 mx-auto text-[#8c8275] mb-4 opacity-50" />
          <h2 className="font-serif text-2xl font-bold text-[#2d2a26] dark:text-[#f0eae1] mb-2">
            No books available
          </h2>
          <p className="text-sm text-[#8c8275] dark:text-[#a89f91]">
            The library archive is currently empty. Be the first to add a book to the collection!
          </p>
        </div>
      </main>
    );
  }

  return <BooksClient initialBooks={books} />;
}