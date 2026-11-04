"use client";

import React, { useState, useEffect } from "react";
import { 
  BookmarkCheck, 
  X, 
  Loader2, 
  Calendar, 
  User, 
  Mail, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface BorrowModalProps {
  book: {
    _id: string;
    title: string;
    coverImage?: string;
    copies: number;
  };
  cloth: string;
  foil: string;
}

export default function BorrowModal({ book, cloth, foil }: BorrowModalProps) {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadyBorrowed, setIsAlreadyBorrowed] = useState(false);
  const [isCheckingBorrow, setIsCheckingBorrow] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const today = new Date();
  const returnDateObj = new Date();
  returnDateObj.setDate(today.getDate() + 7);

  const formattedBorrowDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedReturnDate = returnDateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    async function checkExistingBorrow() {
      if (!currentUser?.email || !book._id) {
        setIsCheckingBorrow(false);
        return;
      }

      try {
        const {data:tokenData} = await authClient.token()
      const token = tokenData?.token
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/my-borrows/${currentUser.email}`, {
          cache: "no-store",
          headers : {
            authorization : `Bearer ${token}`
          }
        });
        if (res.ok) {
          const borrowedBooks = await res.json();
          const exists = borrowedBooks.some(
            (b: { bookId: string }) => b.bookId === book._id
          );
          setIsAlreadyBorrowed(exists);
        }
      } catch (error) {
        console.error("Failed to check borrow status:", error);
      } finally {
        setIsCheckingBorrow(false);
      }
    }

    checkExistingBorrow();
  }, [currentUser?.email, book._id]);

  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) {
      setErrorMessage("You must be logged in to borrow books.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const borrowPayload = {
      bookId: book._id,
      bookTitle: book.title,
      bookCover: book.coverImage || "",
      userEmail: currentUser.email,
      userName: currentUser.name || "Anonymous Reader",
      borrowDate: today.toISOString(),
      returnDate: returnDateObj.toISOString(),
    };

    try {
      const {data:tokenData} = await authClient.token()
      const token = tokenData?.token
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/add-borrows`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          authorization : `Bearer ${token}`
       },
        body: JSON.stringify(borrowPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to complete borrow request.");
      }

      setSuccessMessage("Book borrowed successfully! Enjoy your reading.");
      setIsAlreadyBorrowed(true);

      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage("");
        router.refresh();
      }, 2000);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled =
    book.copies <= 0 || isAlreadyBorrowed || isCheckingBorrow || !currentUser;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={isButtonDisabled}
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-[6px] px-6 text-sm font-semibold shadow-md outline-none transition-[filter,transform] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-stone-950 sm:w-auto"
        style={{ backgroundColor: cloth, color: foil }}
      >
        {isCheckingBorrow ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isAlreadyBorrowed ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Already Borrowed
          </>
        ) : book.copies <= 0 ? (
          <>
            <X className="h-4 w-4 text-red-400" />
            Not Available
          </>
        ) : (
          <>
            <BookmarkCheck className="h-4 w-4" />
            Borrow this book
          </>
        )}
      </button>

      {/* Borrow Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-stone-200 bg-[#faf8f5] p-6 shadow-2xl dark:border-stone-800 dark:bg-[#1c1a18] sm:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-stone-200/60 text-stone-600 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Title Header */}
            <div className="mb-6 flex items-center gap-3 border-b border-stone-200 pb-4 dark:border-stone-800">
              <div 
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow"
                style={{ backgroundColor: cloth, color: foil }}
              >
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                  Confirm Borrow Request
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Review circulation details before completing.
                </p>
              </div>
            </div>

            {/* Error / Success Feedback */}
            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleConfirmBorrow} className="space-y-4">
              
              {/* Book Overview Card */}
              <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-100/70 p-3 dark:border-stone-800 dark:bg-stone-900/60">
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md border border-stone-300 bg-stone-200 shadow-sm dark:border-stone-700">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-base font-bold text-[#2d2a26] line-clamp-1 dark:text-[#f0eae1]">
                    {book.title}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-amber-800 dark:text-amber-400">
                    7-Day Circulation Period
                  </p>
                </div>
              </div>

              {/* User Name (Read-Only) */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Borrower Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    readOnly
                    value={currentUser?.name || "Reader"}
                    className="w-full rounded-xl border border-stone-200 bg-stone-100 py-2.5 pl-10 pr-4 text-sm font-medium text-stone-700 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
                  />
                </div>
              </div>

              {/* User Email (Read-Only) */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Borrower Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="email"
                    readOnly
                    value={currentUser?.email || ""}
                    className="w-full rounded-xl border border-stone-200 bg-stone-100 py-2.5 pl-10 pr-4 text-sm font-medium text-stone-700 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
                  />
                </div>
              </div>

              {/* Extra UX Info: Dates Card */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-50/80 p-3 dark:border-stone-700 dark:bg-stone-900/40">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-stone-500" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-stone-400">Borrow Date</p>
                    <p className="text-xs font-medium text-stone-700 dark:text-stone-300">{formattedBorrowDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 border-l border-stone-200 pl-3 dark:border-stone-800">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-stone-400">Return Due</p>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400">{formattedReturnDate}</p>
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer rounded-xl border border-stone-300 px-5 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md transition hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundColor: cloth, color: foil }}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BookmarkCheck className="h-4 w-4" />
                  )}
                  <span>{isSubmitting ? "Processing..." : "Confirm Borrow"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}