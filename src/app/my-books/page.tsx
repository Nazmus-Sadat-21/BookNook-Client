"use client";

import { useEffect, useState, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import MyBooksClient from "@/components/Shared/MyBooksClient";

const LOADER_SPINES = [
  { h: 52, c: "#6b4f33" },
  { h: 40, c: "#8c6d46" },
  { h: 56, c: "#52402d" },
  { h: 46, c: "#a07a4f" },
  { h: 54, c: "#7a5c3a" },
  { h: 42, c: "#8c6d46" },
];

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
        Pulling your books off the shelf
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
          Sign in to see your books
        </h2>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          The books you add to the archive are kept on your shelf. Sign in and
          they will appear here.
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

/* ───────── page ───────── */

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const loggedInUser = session?.user;
  const [books, setBooks] = useState<ComponentProps<typeof MyBooksClient>["initialBooks"]>([]);
  const [loadedBooksForEmail, setLoadedBooksForEmail] = useState<string | null>(null);
  const isLoadingBooks = Boolean(
    loggedInUser?.email && loadedBooksForEmail !== loggedInUser.email
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchUserBooks() {
      if (!loggedInUser?.email) {
        return;
      }

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        const { data: tokenData } = await authClient.token();
        const token = tokenData?.token;
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API}/my-books/${encodeURIComponent(loggedInUser.email)}`,
          {
            method: "GET",
            headers,
            cache: "no-store",
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setBooks(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch user books:", error);
      } finally {
        if (!cancelled) setLoadedBooksForEmail(loggedInUser.email);
      }
    }

    fetchUserBooks();

    return () => {
      cancelled = true;
    };
  }, [loggedInUser]);

  if (isPending || (loggedInUser && isLoadingBooks)) return <ShelfLoader />;
  if (!loggedInUser) return <MembersOnly onHome={() => router.push("/")} />;

  // No books yet: same empty state as My loans
  if (books.length === 0) {
    return (
      <main className="relative mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <Link
            href="/books"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#8c6d46] hover:underline dark:text-[#d4a373]"
          >
            <ArrowLeft className="h-4 w-4" />
            All books
          </Link>

          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#2d2a26] dark:text-[#f0eae1] sm:text-5xl">
            My shelf
          </h1>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
            You haven&rsquo;t added any books yet.
          </p>
        </header>

        <div className="mt-12 text-center">
          <p className="font-serif text-xl text-[#2d2a26] dark:text-[#f0eae1]">
            Your shelf is empty
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Books you add to the archive with{" "}
            <span className="break-all font-medium text-[#2d2a26] dark:text-[#f0eae1]">
              {loggedInUser.email}
            </span>{" "}
            will be listed here.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link
              href="/add-book"
              className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md outline-none transition-[filter,transform] hover:brightness-125 focus-visible:ring-2 focus-visible:ring-[#8c6d46] focus-visible:ring-offset-2 active:translate-y-px dark:bg-[#d4a373] dark:text-[#181614] dark:focus-visible:ring-offset-stone-950 sm:w-auto"
            >
              Add your first book
            </Link>
            <Link
              href="/books"
              className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[6px] px-6 text-sm font-medium text-stone-600 outline-none transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#8c6d46] dark:text-stone-400 dark:hover:bg-white/10 sm:w-auto"
            >
              Browse books
            </Link>
          </div>

          <div aria-hidden className="mx-auto mt-10 w-64">
            <div className="h-3 rounded-t-[2px] bg-[#3e342a]/20 dark:bg-white/10" />
            <div className="h-1.5 bg-[#3e342a]/40 dark:bg-white/20" />
          </div>
        </div>
      </main>
    );
  }

  return <MyBooksClient initialBooks={books} userEmail={loggedInUser.email} />;
}