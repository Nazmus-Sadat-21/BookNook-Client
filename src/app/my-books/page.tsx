"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen, ArrowRight, PlusCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import MyBooksClient from "@/components/Shared/MyBooksClient";

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const loggedInUser = session?.user;

  const [books, setBooks] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  useEffect(() => {
    async function fetchUserBooks() {
      if (!loggedInUser?.email) return;

      try {
        const res = await fetch(`http://localhost:8000/my-books/${loggedInUser.email}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (error) {
        console.error("Failed to fetch user books:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    }

    if (loggedInUser) {
      fetchUserBooks();
    }
  }, [loggedInUser]);

  if (isPending || (loggedInUser && isLoadingBooks)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8c6d46]" />
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-serif font-bold text-[#2d2a26] dark:text-[#f0eae1] mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-[#625b52] dark:text-[#a89f91] mb-4">
          Please log in to view your contributed books.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-sm font-medium shadow transition cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  // If user has no books, render an enhanced empty state with action buttons
  if (books.length === 0) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="w-full text-center py-16 px-6 sm:px-12 bg-[#fdfcfa] dark:bg-[#1c1a18] rounded-[2.5rem] border border-[#e8e2d9] dark:border-[#2a2622] shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#8c6d46]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="h-16 w-16 rounded-3xl bg-[#8c6d46]/10 text-[#8c6d46] dark:text-[#d4a373] mx-auto flex items-center justify-center shadow-inner">
            <BookOpen className="h-8 w-8 opacity-80" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d2a26] dark:text-[#f0eae1]">
              No Books Contributed Yet
            </h2>
            <p className="text-xs sm:text-sm text-[#8c8275] dark:text-[#a89f91] leading-relaxed">
              You haven&apos;t added any books to the archive under <span className="font-semibold text-[#2d2a26] dark:text-[#f0eae1]">{loggedInUser.email}</span>. Explore the general library or start contributing!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => router.push("/books")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-sm font-bold shadow-xl hover:scale-105 transition cursor-pointer"
            >
              <span>Explore All Books</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => router.push("/add-book")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-[#e8e2d9] dark:border-[#2d2924] text-[#625b52] dark:text-[#a89f91] text-sm font-semibold hover:bg-[#faf8f5] dark:hover:bg-[#23201d] transition cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-[#8c6d46]" />
              <span>Add Your First Book</span>
            </button>
          </div>

        </div>
      </main>
    );
  }

  return <MyBooksClient initialBooks={books} userEmail={loggedInUser.email} />;
}