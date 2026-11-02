"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, Undo2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface BorrowedBook {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookCover?: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
}

// Binding colours, taken from your site's browns
const CLOTH = ["#3e342a", "#52402d", "#5e4630", "#6b4f33", "#4a3a2c", "#7a5c3a"];
const FOIL = "#e9d9ab";

function clothFor(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CLOTH[h % CLOTH.length];
}

const LOADER_SPINES = [
  { h: 52, c: "#6b4f33" },
  { h: 40, c: "#8c6d46" },
  { h: 56, c: "#52402d" },
  { h: 46, c: "#a07a4f" },
  { h: 54, c: "#7a5c3a" },
  { h: 42, c: "#8c6d46" },
];

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

function formatDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "Not recorded"
    : d.toLocaleDateString("en-US", DATE_FORMAT);
}

function dueStatus(returnDate: string): { label: string; className: string } {
  const due = new Date(returnDate).getTime();
  if (Number.isNaN(due)) {
    return { label: "No due date", className: "text-stone-500 dark:text-stone-400" };
  }
  const days = Math.ceil((due - Date.now()) / 86_400_000);
  if (days < 0) {
    const n = Math.abs(days);
    return {
      label: `Overdue by ${n} ${n === 1 ? "day" : "days"}`,
      className: "text-[#9b2f2a] dark:text-[#e58a84]",
    };
  }
  if (days === 0) {
    return { label: "Due today", className: "text-[#9a6b1f] dark:text-[#d4a373]" };
  }
  return {
    label: `${days} ${days === 1 ? "day" : "days"} left`,
    className: "text-stone-600 dark:text-stone-400",
  };
}

/* ───────── gates ───────── */

function ShelfLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] flex-col items-center justify-center px-4"
    >
      <div className="flex items-end gap-1.5" aria-hidden>
        {LOADER_SPINES.map((s, i) => (
          <span
            key={i}
            className="w-3.5 animate-pulse rounded-t-[2px] motion-reduce:animate-none"
            style={{ height: s.h, backgroundColor: s.c, animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>
      <div aria-hidden className="h-1.5 w-56 rounded-[1px] bg-[#3e342a] dark:bg-[#d4a373]/70" />
      <p className="mt-5 font-serif text-lg text-[#3e342a] dark:text-[#f0eae1]">
        Checking your loans
      </p>
    </div>
  );
}

function MembersOnly({ onHome }: { onHome: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section
        aria-labelledby="members-only-title"
        className="relative w-full max-w-md rounded-[4px] border border-stone-300 bg-white px-7 pb-9 pt-5 shadow-[0_2px_0_rgba(0,0,0,.04),0_22px_36px_-24px_rgba(0,0,0,.4)] dark:border-stone-700 dark:bg-stone-900 sm:px-9"
      >
        <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#b4473f]/70 pb-2">
          <p
            id="members-only-title"
            className="font-serif text-lg font-semibold text-[#2d2a26] dark:text-[#f0eae1]"
          >
            Members only
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-400">Library card</p>
        </div>

        <div className="mt-3 space-y-1" aria-hidden>
          {["Name", "Member no."].map((label) => (
            <div key={label} className="flex items-baseline gap-2 py-2">
              <span className="text-sm text-stone-500 dark:text-stone-400">{label}</span>
              <span className="min-w-4 flex-1 -translate-y-[3px] border-b border-dotted border-stone-300 dark:border-stone-600" />
            </div>
          ))}
        </div>

        <h2 className="mt-8 font-serif text-2xl font-semibold leading-snug text-[#2d2a26] dark:text-[#f0eae1]">
          Sign in to see your loans
        </h2>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          The books you have borrowed, and when they are due back, are listed
          here once you sign in.
        </p>

        <button
          type="button"
          onClick={onHome}
          className="mt-7 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md outline-none transition-[filter,transform] hover:brightness-125 focus-visible:ring-2 focus-visible:ring-[#8c6d46] focus-visible:ring-offset-2 active:translate-y-px dark:bg-[#d4a373] dark:text-[#181614] dark:focus-visible:ring-offset-stone-950"
        >
          Return home
        </button>

        <span
          aria-hidden
          className="absolute bottom-3 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-stone-300 bg-stone-50 shadow-inner dark:border-stone-700 dark:bg-stone-950"
        />
      </section>
    </div>
  );
}

/* ───────── small pieces ───────── */

function MiniBook({
  title,
  coverImage,
}: {
  title: string;
  coverImage?: string;
}) {
  return (
    <div
      className="relative h-[60px] w-11 shrink-0 overflow-hidden rounded-l-[2px] rounded-r-[4px] shadow-[0_8px_12px_-6px_rgba(0,0,0,.55)]"
      style={{ backgroundColor: clothFor(title) }}
    >
      {coverImage ? (
        <img src={coverImage} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center pl-1">
          <span
            aria-hidden
            className="absolute inset-[3px] left-[6px] rounded-[2px] border"
            style={{ borderColor: "rgba(233,217,171,.5)" }}
          />
          <span className="relative font-serif text-lg font-semibold" style={{ color: FOIL }}>
            {title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,.45), rgba(255,255,255,.2) 50%, transparent)",
        }}
      />
    </div>
  );
}

/* ───────── page ───────── */

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const loggedInUser = session?.user;

  const [borrows, setBorrows] = useState<BorrowedBook[]>([]);
  const [isLoadingBorrows, setIsLoadingBorrows] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserBorrows() {
      if (!loggedInUser?.email) return;

      try {
         const { data: tokenData } = await authClient.token();
        const token = tokenData?.token;
                
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API}/my-borrows/${encodeURIComponent(loggedInUser.email)}`,
          { cache: "no-store",
            headers : {
              authorization: `Bearer ${token}`
            }
           }
        );
        if (res.ok) {
          const data = await res.json();
          setBorrows(data);
        }
      } catch (err) {
        console.error("Failed to fetch borrowed books:", err);
      } finally {
        setIsLoadingBorrows(false);
      }
    }

    if (loggedInUser) {
      fetchUserBorrows();
    }
  }, [loggedInUser]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const handleReturnBook = async (borrow: BorrowedBook) => {
    try {
      setError(null);
      setReturningId(borrow._id);
      const {data:tokenData} = await authClient.token()
      const token = tokenData?.token
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/borrows/${borrow._id}`, {
        method: "DELETE",
        headers:{
          authorization : `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("The book could not be returned. Please try again.");
      }

      // Remove from local state instantly
      setBorrows((current) => current.filter((b) => b._id !== borrow._id));
      showToastMsg(`“${borrow.bookTitle}” was returned.`);
      router.refresh();
    } catch (err) {
      console.error("Return error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while returning the book."
      );
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || (loggedInUser && isLoadingBorrows)) return <ShelfLoader />;
  if (!loggedInUser) return <MembersOnly onHome={() => router.push("/")} />;

  const total = borrows.length;

  return (
    <main className="relative mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-6 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-[4px] bg-[#3e342a] px-5 py-3.5 text-sm text-[#faf8f5] shadow-2xl dark:bg-[#d4a373] dark:text-[#181614]"
        >
          <Check className="h-4 w-4 shrink-0" />
          <p>{toast}</p>
        </div>
      )}

      {/* Header */}
      <header>
        <Link
          href="/books"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#8c6d46] hover:underline dark:text-[#d4a373]"
        >
          <ArrowLeft className="h-4 w-4" />
          All books
        </Link>

        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#2d2a26] dark:text-[#f0eae1] sm:text-5xl">
          My loans
        </h1>

        {total === 0 ? (
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
            You haven&rsquo;t borrowed any books right now.
          </p>
        ) : (
          <>
            {/* Total count */}
            <div className="mt-6 flex items-baseline gap-3">
              <p
                aria-hidden
                className="font-serif text-5xl font-semibold leading-none text-[#2d2a26] dark:text-[#f0eae1]"
              >
                {total}
              </p>
              <p className="text-base text-stone-600 dark:text-stone-400">
                <span className="sr-only">{total} </span>
                {total === 1 ? "book on loan" : "books on loan"}
              </p>
            </div>

            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
              Return a book when you&rsquo;re done so someone else can borrow it.
            </p>
          </>
        )}
      </header>

      {error && (
        <p
          role="alert"
          className="mt-6 text-sm font-medium text-[#9b2f2a] dark:text-[#e58a84]"
        >
          {error}
        </p>
      )}

      {/* Table */}
      {total === 0 ? (
        <div className="mt-12 text-center">
          <p className="font-serif text-xl text-[#2d2a26] dark:text-[#f0eae1]">
            Nothing checked out
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500 dark:text-stone-400">
            Books you borrow from the archive will be listed here with their
            return dates.
          </p>
          <button
            type="button"
            onClick={() => router.push("/books")}
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md outline-none transition-[filter,transform] hover:brightness-125 focus-visible:ring-2 focus-visible:ring-[#8c6d46] focus-visible:ring-offset-2 active:translate-y-px dark:bg-[#d4a373] dark:text-[#181614] dark:focus-visible:ring-offset-stone-950"
          >
            Browse books
          </button>
          <div aria-hidden className="mx-auto mt-10 w-64">
            <div className="h-3 rounded-t-[2px] bg-[#3e342a]/20 dark:bg-white/10" />
            <div className="h-1.5 bg-[#3e342a]/40 dark:bg-white/20" />
          </div>
        </div>
      ) : (
        <section
          aria-label="Your borrowed books"
          className="mt-8 overflow-hidden rounded-[4px] border border-stone-300 bg-white shadow-[0_2px_0_rgba(0,0,0,.04),0_22px_36px_-26px_rgba(0,0,0,.4)] dark:border-stone-700 dark:bg-stone-900"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Books you have borrowed</caption>
              <thead>
                <tr className="border-b-2 border-[#b4473f]/70 text-sm text-stone-500 dark:text-stone-400">
                  <th scope="col" className="w-0 py-3.5 pl-5 pr-3 font-normal sm:pl-7">
                    <span className="sr-only">Cover</span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-normal">Book</th>
                  <th scope="col" className="hidden px-3 py-3.5 font-normal md:table-cell">
                    Borrowed
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-normal">Due back</th>
                  <th scope="col" className="py-3.5 pl-3 pr-5 text-right font-normal sm:pr-7">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-dotted divide-stone-300 dark:divide-stone-700">
                {borrows.map((borrow) => {
                  const status = dueStatus(borrow.returnDate);
                  const isReturning = returningId === borrow._id;
                  return (
                    <tr
                      key={borrow._id}
                      className="transition-colors hover:bg-stone-50 dark:hover:bg-white/[0.03]"
                    >
                      {/* Cover */}
                      <td className="w-0 py-4 pl-5 pr-3 align-middle sm:pl-7">
                        <MiniBook title={borrow.bookTitle} coverImage={borrow.bookCover} />
                      </td>

                      {/* Title */}
                      <td className="min-w-[10rem] max-w-[22rem] px-3 py-4 align-middle">
                        <Link
                          href={`/books/${borrow.bookId}`}
                          className="block truncate font-serif text-lg font-semibold leading-snug text-[#2d2a26] hover:underline dark:text-[#f0eae1]"
                        >
                          {borrow.bookTitle}
                        </Link>
                        {/* shown here only when the Borrowed column is hidden */}
                        <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400 md:hidden">
                          Borrowed {formatDate(borrow.borrowDate)}
                        </p>
                      </td>

                      {/* Borrowed */}
                      <td className="hidden whitespace-nowrap px-3 py-4 align-middle text-sm text-stone-500 dark:text-stone-400 md:table-cell">
                        {formatDate(borrow.borrowDate)}
                      </td>

                      {/* Due back */}
                      <td className="px-3 py-4 align-middle">
                        <p className="whitespace-nowrap text-sm font-medium text-[#2d2a26] dark:text-[#f0eae1]">
                          {formatDate(borrow.returnDate)}
                        </p>
                        <p className={`whitespace-nowrap text-sm ${status.className}`}>
                          {status.label}
                        </p>
                      </td>

                      {/* Action: reddish rounded box */}
                      <td className="py-4 pl-3 pr-5 text-right align-middle sm:pr-7">
                        <button
                          type="button"
                          aria-label={`Return ${borrow.bookTitle}`}
                          onClick={() => handleReturnBook(borrow)}
                          disabled={isReturning}
                          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-[#9b2f2a]/30 bg-[#9b2f2a]/10 px-4 text-sm font-semibold text-[#9b2f2a] outline-none transition-colors hover:border-[#9b2f2a] hover:bg-[#9b2f2a] hover:text-white focus-visible:ring-2 focus-visible:ring-[#9b2f2a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#e58a84]/30 dark:bg-[#e58a84]/10 dark:text-[#e58a84] dark:hover:border-[#e58a84] dark:hover:bg-[#e58a84] dark:hover:text-[#2a1210] dark:focus-visible:ring-[#e58a84] dark:focus-visible:ring-offset-stone-900"
                        >
                          {isReturning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Undo2 className="h-3.5 w-3.5" />
                          )}
                          <span className="hidden sm:inline">
                            {isReturning ? "Returning" : "Return"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}