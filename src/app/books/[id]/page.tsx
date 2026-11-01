import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  Layers,
  Mail,
  BookmarkCheck,
  Sparkles,
  ShieldCheck,
  Compass,
  Quote,
  ArrowUpRight,
} from "lucide-react";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  let book = null;

  try {
    const res = await fetch(`http://localhost:8000/books/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) notFound();
    book = await res.json();
  } catch {
    notFound();
  }

  const copies = book.copies ?? 1;
  const archivedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not recorded";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ef] px-4 py-5 text-[#2d2a26] transition-colors duration-300 dark:bg-[#141210] dark:text-[#f0eae1] sm:px-6 sm:py-8 lg:px-10">
      {/* Ambient editorial background */}
      <div className="pointer-events-none absolute -left-40 top-24 h-80 w-80 rounded-full bg-[#d4a373]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 top-[35rem] h-96 w-96 rounded-full bg-[#8c6d46]/10 blur-[110px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#3e342a_0.7px,transparent_0.7px)] [background-size:18px_18px] dark:opacity-[0.07]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Top navigation */}
        <header className="mb-7 flex items-center justify-between gap-3 sm:mb-10">
          <Link
            href="/books"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-[#e5ddd2] bg-[#fffdfa]/80 px-4 text-xs font-bold tracking-wide text-[#625b52] shadow-sm backdrop-blur transition-all hover:-translate-x-0.5 hover:border-[#8c6d46] hover:text-[#3e342a] dark:border-[#332d27] dark:bg-[#211e1a]/80 dark:text-[#c2b7a8] dark:hover:text-[#f0eae1] sm:px-5"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Archives</span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-[#8c6d46]/20 bg-[#8c6d46]/[0.07] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8c6d46] dark:border-[#d4a373]/20 dark:bg-[#d4a373]/[0.08] dark:text-[#d4a373] sm:flex">
            <Compass className="h-3.5 w-3.5" />
            Record / {id.slice(-6).toUpperCase()}
          </div>
        </header>

        {/* Main composition */}
        <section className="grid items-start gap-6 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.5fr)] lg:gap-8 xl:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.55fr)]">
          {/* Left rail */}
          <aside className="grid gap-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(220px,1.1fr)] lg:sticky lg:top-8 lg:grid-cols-1">
            {/* Book cover */}
            <div className="group relative mx-auto w-full max-w-[360px] sm:max-w-none">
              <div className="absolute -inset-3 rounded-[2.4rem] bg-gradient-to-br from-[#d4a373]/30 via-[#8c6d46]/10 to-transparent blur-2xl transition duration-700 group-hover:opacity-90" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#e8dfd3] p-2 shadow-[0_28px_80px_-30px_rgba(62,52,42,0.5)] dark:border-[#3b332b] dark:bg-[#29231d] sm:rounded-[2.25rem] sm:p-3">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.45rem] bg-[#d8cbbb] dark:bg-[#332b23]">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_35%,rgba(212,163,115,0.28),transparent_48%),linear-gradient(145deg,#e8dfd3,#cfc2b1)] px-6 text-center dark:bg-[radial-gradient(circle_at_50%_35%,rgba(212,163,115,0.14),transparent_48%),linear-gradient(145deg,#332b23,#211d19)]">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-[#8c6d46]/20 bg-white/40 text-[#8c6d46] shadow-inner backdrop-blur dark:bg-black/10 dark:text-[#d4a373]">
                        <BookOpen className="h-9 w-9" strokeWidth={1.4} />
                      </div>
                      <div>
                        <p className="font-serif text-2xl font-bold text-[#3e342a] dark:text-[#f0eae1]">
                          Untitled
                        </p>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c6d46] dark:text-[#d4a373]">
                          Cover not available
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#211d19]/75 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-[#e6bd91]" />
                    Library edition
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                        Collection
                      </p>
                      <p className="mt-1 truncate text-lg font-bold text-white">
                        {book.category || "General"}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-4 -right-2 -z-10 h-24 w-24 rounded-full border border-[#8c6d46]/20" />
            </div>

            {/* Contributor panel */}
            <div className="relative overflow-hidden rounded-[1.7rem] border border-[#e5ddd2] bg-[#fffdfa]/85 p-5 shadow-[0_14px_45px_-30px_rgba(62,52,42,0.35)] backdrop-blur-xl dark:border-[#332d27] dark:bg-[#211e1a]/85 sm:p-6">
              <div className="absolute -right-5 -top-6 text-[#8c6d46]/[0.07] dark:text-[#d4a373]/[0.07]">
                <ShieldCheck className="h-28 w-28" strokeWidth={1} />
              </div>
              <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#8c6d46] dark:text-[#d4a373]">
                      Provenance
                    </p>
                    <h2 className="mt-1 font-serif text-xl font-bold">The contributor</h2>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8c6d46]/10 text-[#8c6d46] dark:bg-[#d4a373]/10 dark:text-[#d4a373]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#3e342a] text-[#f8f3ec] shadow-md dark:bg-[#d4a373] dark:text-[#211d19]">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9b9082]">
                      Submitted by
                    </p>
                    <p className="truncate text-sm font-bold">
                      {book.contributorName || "Community Member"}
                    </p>
                  </div>
                </div>

                {book.contributorEmail && (
                  <div className="mt-4 flex items-center gap-3 border-t border-[#e5ddd2] pt-4 dark:border-[#393129]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8c6d46]/10 text-[#8c6d46] dark:bg-[#d4a373]/10 dark:text-[#d4a373]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9b9082]">
                        Contact
                      </p>
                      <p className="truncate text-xs font-semibold text-[#625b52] dark:text-[#c2b7a8]">
                        {book.contributorEmail}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right content card */}
          <article className="relative overflow-hidden rounded-[2rem] border border-[#e5ddd2] bg-[#fffdfa]/90 shadow-[0_25px_80px_-35px_rgba(62,52,42,0.28)] backdrop-blur-xl dark:border-[#332d27] dark:bg-[#211e1a]/90 sm:rounded-[2.4rem]">
            <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full border border-[#8c6d46]/10 dark:border-[#d4a373]/10" />
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-[#8c6d46]/10 dark:border-[#d4a373]/10" />

            <div className="relative p-5 sm:p-8 lg:p-10 xl:p-12">
              {/* Editorial heading */}
              <div className="mb-8">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#8c6d46]/10 px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#8c6d46] dark:bg-[#d4a373]/10 dark:text-[#d4a373]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured archive
                  </span>
                  <span className="rounded-full border border-[#e5ddd2] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8b8175] dark:border-[#393129] dark:text-[#b2a696]">
                    Ref. {id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#9b9082]">
                  A story waiting to be explored
                </p>
                <h1 className="max-w-4xl break-words font-serif text-[2.15rem] font-bold leading-[1.08] tracking-[-0.045em] text-[#2d2a26] dark:text-[#f0eae1] sm:text-5xl lg:text-[3.6rem]">
                  {book.title}
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="h-px w-8 bg-[#8c6d46] dark:bg-[#d4a373]" />
                  <p className="text-sm font-semibold text-[#8c6d46] dark:text-[#d4a373] sm:text-base">
                    Written by {book.author || "Unknown author"}
                  </p>
                </div>
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-1 gap-3 border-y border-[#e5ddd2] py-5 dark:border-[#393129] sm:grid-cols-3 sm:gap-2">
                <div className="flex items-center gap-3 rounded-2xl bg-[#f4efe8] p-3.5 dark:bg-[#2a251f] sm:bg-transparent sm:p-2 sm:dark:bg-transparent">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8c6d46]/10 text-[#8c6d46] dark:bg-[#d4a373]/10 dark:text-[#d4a373]">
                    <Layers className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9b9082]">
                      In stock
                    </p>
                    <p className="text-xs font-bold sm:text-sm">
                      {copies} {copies === 1 ? "copy" : "copies"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-[#f4efe8] p-3.5 dark:bg-[#2a251f] sm:bg-transparent sm:p-2 sm:dark:bg-transparent">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8c6d46]/10 text-[#8c6d46] dark:bg-[#d4a373]/10 dark:text-[#d4a373]">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9b9082]">
                      Added to archive
                    </p>
                    <p className="truncate text-xs font-bold sm:text-sm">
                      {archivedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-[#f4efe8] p-3.5 dark:bg-[#2a251f] sm:bg-transparent sm:p-2 sm:dark:bg-transparent">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8c6d46]/10 text-[#8c6d46] dark:bg-[#d4a373]/10 dark:text-[#d4a373]">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9b9082]">
                      Genre
                    </p>
                    <p className="truncate text-xs font-bold sm:text-sm">
                      {book.category || "Uncategorized"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <section className="py-8 sm:py-10">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8c6d46]/10 text-[#8c6d46] dark:bg-[#d4a373]/10 dark:text-[#d4a373]">
                    <Quote className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#9b9082]">
                      Between the covers
                    </p>
                    <h2 className="font-serif text-xl font-bold sm:text-2xl">
                      Synopsis
                    </h2>
                  </div>
                </div>
                <p className="max-w-3xl whitespace-pre-line text-sm leading-8 text-[#625b52] dark:text-[#c2b7a8] sm:text-[15px] sm:leading-[2.05]">
                  {book.description ||
                    "No synopsis has been provided for this literary entry yet."}
                </p>
              </section>

              {/* Checkout footer */}
              <footer className="flex flex-col gap-5 border-t border-[#e5ddd2] pt-6 dark:border-[#393129] sm:flex-row sm:items-center sm:justify-between sm:pt-7">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                      Available for borrowing
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#9b9082]">
                      {copies > 0 ? "This title is ready to be checked out." : "No copies currently listed."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={copies <= 0}
                  className="cursor-pointer group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#3e342a] px-7 py-4 text-sm font-extrabold text-[#faf8f5] shadow-[0_12px_28px_-12px_rgba(62,52,42,0.65)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#594936] hover:shadow-[0_18px_35px_-12px_rgba(62,52,42,0.55)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#d4a373] dark:text-[#211d19] dark:hover:bg-[#e1b98f] sm:w-auto"
                >
                  <BookmarkCheck className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Borrow this book
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </footer>
            </div>
          </article>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#e5ddd2]/80 py-5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#a09689] dark:border-[#393129] sm:flex-row">
          <span>Curated with care · Digital Library</span>
          <span>Archive entry / {id.slice(-6).toUpperCase()}</span>
        </footer>
      </div>
    </main>
  );
}
