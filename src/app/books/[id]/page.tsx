import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShieldCheck, User, Calendar, Tag, Layers } from "lucide-react";
import BorrowModal from "@/components/Shared/BorrowBooksModal";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

// Same category → binding colour mapping as BookCard & MyBooksClient
const CLOTH = [
  "#3e342a", // espresso (main brand brown)
  "#52402d", // walnut
  "#5e4630", // chestnut
  "#6b4f33", // saddle
  "#4a3a2c", // umber
  "#7a5c3a", // bronze
];

function clothFor(category: string) {
  let h = 0;
  for (const ch of category) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CLOTH[h % CLOTH.length];
}

const TICK_HEIGHTS = [26, 21, 26, 23, 25];

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  const jwtToken = await auth.api.getToken({
    headers : await headers()
  })

  let book = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/books/${id}`, {
      headers:{
        authorization: `Bearer ${jwtToken?.token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) notFound();
    book = await res.json();
  } catch {
    notFound();
  }

  const copies: number = book.copies ?? 1;
  const category: string = book.category || "General";
  const cloth = clothFor(category);
  const foil = "#e9d9ab";
  const ticks = Math.min(Math.max(copies, 0), TICK_HEIGHTS.length);
  const refNo = id.slice(-6);
  const callNumber = `${category.slice(0, 3).toUpperCase()} ${refNo}`;

  const archivedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not recorded";

  const facts: { label: string; icon: React.ReactNode; value: React.ReactNode }[] = [
    { label: "Author", icon: <User className="h-4 w-4 text-stone-400" />, value: book.author || "Unknown author" },
    { label: "Genre", icon: <Tag className="h-4 w-4 text-stone-400" />, value: category },
    { label: "Copies Available", icon: <Layers className="h-4 w-4 text-stone-400" />, value: `${copies} ${copies === 1 ? "copy" : "copies"}` },
    { label: "Archived On", icon: <Calendar className="h-4 w-4 text-stone-400" />, value: archivedDate },
    { label: "Contributed By", icon: <ShieldCheck className="h-4 w-4 text-stone-400" />, value: book.contributorName || "Community member" },
  ];

  if (book.contributorEmail) {
    facts.push({
      label: "Contributor Contact",
      icon: <User className="h-4 w-4 text-stone-400" />,
      value: (
        <a
          href={`mailto:${book.contributorEmail}`}
          className="font-medium text-[#8c6d46] underline decoration-stone-300 underline-offset-4 transition-colors hover:text-[#3e342a] dark:text-[#d4a373] dark:hover:text-[#f0eae1]"
        >
          {book.contributorEmail}
        </a>
      ),
    });
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d2a26] dark:bg-[#121110] dark:text-[#f0eae1]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(380px,5fr)_7fr]">
        
        {/* ───────── Left Panel: Book Binding & Shelf Showcase ───────── */}
        <aside
          className="relative flex flex-col items-center justify-between px-6 pb-16 pt-24 lg:sticky lg:top-0 lg:h-screen lg:py-12 shadow-inner"
          style={{ backgroundColor: cloth }}
        >
          {/* Subtle soft overhead lighting effect */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 15%, rgba(255,255,255,.18), transparent 65%)",
            }}
          />

          {/* Back Navigation Button */}
          <div className="w-full max-w-sm flex justify-start z-10">
            <Link
              href="/books"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold outline-none backdrop-blur-md transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 shadow-sm"
              style={{ color: foil, backgroundColor: "rgba(0,0,0,0.15)" }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to archive</span>
            </Link>
          </div>

          {/* 3D Book Container */}
          <div className="relative w-[min(72%,320px)] [perspective:1200px] my-auto lg:w-[min(65%,340px)]">
            {/* Pages Block Effect behind cover */}
            <div
              aria-hidden
              className="absolute inset-y-[8px] -right-[10px] left-3 rounded-r-[6px] bg-stone-200 shadow-sm"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,.08) 2px 3px)",
              }}
            />

            {/* Front Cover */}
            <div
              className="group relative aspect-[3/4] overflow-hidden rounded-l-[4px] rounded-r-[10px] shadow-[0_35px_50px_-15px_rgba(0,0,0,.7)] transition-transform duration-500 ease-out hover:[transform:rotateY(-12deg)] motion-reduce:transition-none motion-reduce:hover:transform-none"
              style={{
                backgroundColor: "rgba(0,0,0,.3)",
                transformOrigin: "left center",
              }}
            >
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center px-10 pl-14 text-center"
                  style={{ backgroundColor: cloth, filter: "brightness(.82)" }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-4 left-8 rounded-[4px] border border-dashed"
                    style={{ borderColor: "rgba(233,217,171,.45)" }}
                  />
                  <p
                    className="relative font-serif text-2xl font-bold leading-snug line-clamp-4"
                    style={{ color: foil }}
                  >
                    {book.title}
                  </p>
                  <p
                    className="relative mt-4 text-xs font-medium uppercase tracking-wider line-clamp-2"
                    style={{ color: "rgba(233,217,171,.75)" }}
                  >
                    {book.author}
                  </p>
                </div>
              )}

              {/* Spine and Hinge Highlights */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-6"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,.5) 0%, rgba(255,255,255,.22) 40%, rgba(0,0,0,.2) 75%, transparent 100%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[24px] w-px bg-black/40"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30"
              />

              {/* Category Sticker Badge */}
              <span className="absolute bottom-4 right-4 max-w-[75%] truncate rounded-md bg-stone-900/80 px-3 py-1 text-xs font-semibold tracking-wide text-stone-100 shadow backdrop-blur-sm">
                {category}
              </span>
            </div>
          </div>

          {/* Wooden Shelf Base */}
          <div aria-hidden className="w-[90%] max-w-[440px] pt-4">
            <div className="h-3.5 rounded-t-[3px] bg-black/40 shadow-md" />
            <div className="h-2 bg-black/60 shadow-inner" />
          </div>
        </aside>

        {/* ───────── Right Panel: Professional Archive Record & Borrow Slip ───────── */}
        <article className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10 lg:py-20 flex flex-col justify-between">
          <div>
            {/* Title & Author Header */}
            <div className="border-b border-stone-200 dark:border-stone-800 pb-8">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#8c6d46] dark:text-[#d4a373] mb-3">
                Archival Record #{refNo}
              </span>
              <h1 className="break-words font-serif text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl text-[#2d2a26] dark:text-[#f0eae1]">
                {book.title}
              </h1>
              <p className="mt-3 font-serif text-lg italic text-stone-600 dark:text-stone-400">
                by <span className="not-italic font-semibold text-stone-800 dark:text-stone-200">{book.author || "Unknown author"}</span>
              </p>
            </div>

            {/* Catalog Index Card Details */}
            <section
              aria-label="Catalog details"
              className="relative mt-8 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900 sm:p-8"
            >
              <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#8c6d46]/40 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#8c6d46] dark:text-[#d4a373]" />
                  <span className="font-serif text-xl font-bold tracking-wider">{callNumber}</span>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                  Call Number
                </span>
              </div>

              <dl className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {f.icon}
                      <span>{f.label}</span>
                    </dt>
                    <dd className="text-right text-sm font-medium text-stone-800 dark:text-stone-200">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Synopsis Section */}
            <section className="mt-10">
              <h2 className="font-serif text-2xl font-bold text-[#2d2a26] dark:text-[#f0eae1] mb-4">
                About this volume
              </h2>
              <div className="rounded-2xl border border-stone-200 bg-white/60 p-6 dark:border-stone-800 dark:bg-stone-900/40 shadow-sm">
                <p className="max-w-[62ch] whitespace-pre-line font-serif text-base leading-[1.8] text-stone-700 dark:text-stone-300">
                  {book.description || "No synopsis has been added for this book yet."}
                </p>
              </div>
            </section>
          </div>

          {/* Borrow Slip / Action Bar */}
          <section
            aria-label="Borrow this book"
            className="mt-12 flex flex-col gap-6 rounded-2xl border border-stone-300 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-lg sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-end gap-[4px] p-2 rounded-xl bg-stone-100 dark:bg-stone-800" aria-hidden>
                {ticks > 0 ? (
                  TICK_HEIGHTS.slice(0, ticks).map((h, i) => (
                    <span
                      key={i}
                      className="w-[6px] rounded-sm"
                      style={{
                        height: h,
                        backgroundColor: cloth,
                        opacity: 0.6 + (i % 3) * 0.15,
                      }}
                    />
                  ))
                ) : (
                  <span className="h-[26px] w-[6px] rounded-sm bg-red-400" />
                )}
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  {copies > 0 ? "Available for Loan" : "Currently Stock Out"}
                </p>
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  {copies > 0
                    ? `${copies} ${copies === 1 ? "copy is" : "copies are"} ready for 7-day checkout`
                    : "All copies currently checked out"}
                </p>
              </div>
            </div>

            <BorrowModal book={book} cloth={cloth} foil={foil} />
          </section>
        </article>

      </div>
    </main>
  );
}