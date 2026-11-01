"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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

  return <MyBooksClient initialBooks={books} userEmail={loggedInUser.email} />;
}