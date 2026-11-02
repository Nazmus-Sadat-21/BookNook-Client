import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookmarkCheck } from "lucide-react";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

// Same category → binding colour mapping as BookCard
const CLOTH = [
  "#3e342a", // espresso (your main brand brown)
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

  const copies: number = book.copies ?? 1;
  const category: string = book.category || "General";
  const cloth = clothFor(category);
  const foil = "#e9d9ab";
  const ticks = Math.min(Math.max(copies, 0), TICK_HEIGHTS.length);
  const refNo = id.slice(-6);
  const callNumber = `${category.slice(0, 3)} ${refNo}`;

  const archivedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not recorded";

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Author", value: book.author || "Unknown author" },
    { label: "Genre", value: category },
    { label: "Copies", value: `${copies} ${copies === 1 ? "copy" : "copies"}` },
    { label: "Added", value: archivedDate },
    { label: "Contributed by", value: book.contributorName || "Community member" },
  ];
  if (book.contributorEmail) {
    facts.push({
      label: "Contact",
      value: (
        <a
          href={`mailto:${book.contributorEmail}`}
          className="underline decoration-stone-400 underline-offset-4 hover:decoration-current"
        >
          {book.contributorEmail}
        </a>
      ),
    });
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="grid min-h-screen lg:grid-cols-[minmax(340px,5fr)_7fr]">
        {/* ───────── Left: the book on its shelf, in its binding colour ───────── */}
        <aside
          className="relative flex flex-col items-center justify-center px-6 pb-16 pt-24 lg:sticky lg:top-0 lg:h-screen lg:py-10"
          style={{ backgroundColor: cloth }}
        >
          {/* soft light from above */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,.16), transparent 60%)",
            }}
          />

          <Link
            href="/books"
            className="absolute left-5 top-5 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/70 sm:left-8 sm:top-8"
            style={{ color: foil }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to archive
          </Link>

          {/* the book */}
          <div className="relative w-[min(68%,300px)] [perspective:1000px] lg:w-[min(62%,320px)]">
            {/* page block */}
            <div
              aria-hidden
              className="absolute inset-y-[6px] -right-[9px] left-3 rounded-r-[5px] bg-stone-200"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,.09) 2px 3px)",
              }}
            />

            {/* cover */}
            <div
              className="group relative aspect-[3/4] overflow-hidden rounded-l-[4px] rounded-r-[8px] shadow-[0_30px_40px_-18px_rgba(0,0,0,.65)] transition-transform duration-500 ease-out hover:[transform:rotateY(-12deg)] motion-reduce:transition-none motion-reduce:hover:transform-none"
              style={{
                backgroundColor: "rgba(0,0,0,.28)",
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
                  className="flex h-full w-full flex-col items-center justify-center px-9 pl-12 text-center"
                  style={{ backgroundColor: cloth, filter: "brightness(.82)" }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-4 left-7 rounded-[3px] border"
                    style={{ borderColor: "rgba(233,217,171,.55)" }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-[24px] left-[36px] rounded-[2px] border"
                    style={{ borderColor: "rgba(233,217,171,.25)" }}
                  />
                  <p
                    className="relative font-serif text-2xl font-semibold leading-snug line-clamp-5"
                    style={{ color: foil }}
                  >
                    {book.title}
                  </p>
                  <p
                    className="relative mt-4 text-sm line-clamp-2"
                    style={{ color: "rgba(233,217,171,.75)" }}
                  >
                    {book.author}
                  </p>
                </div>
              )}

              {/* spine + hinge groove */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-5"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,.45) 0%, rgba(255,255,255,.2) 45%, rgba(0,0,0,.18) 80%, transparent 100%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[23px] w-px bg-black/30"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20"
              />

              {/* library sticker */}
              <span className="absolute bottom-4 right-4 max-w-[70%] truncate rounded-[3px] bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-800 shadow-sm">
                {category}
              </span>
            </div>
          </div>

          {/* the shelf */}
          <div aria-hidden className="mt-0 w-[88%] max-w-[420px]">
            <div className="h-3 rounded-t-[2px] bg-black/35" />
            <div className="h-1.5 bg-black/55" />
          </div>
        </aside>

        {/* ───────── Right: the record ───────── */}
        <article className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-10 lg:py-20">
          <h1 className="break-words font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {book.title}
          </h1>
          <p className="mt-4 font-serif text-lg italic text-stone-600 dark:text-stone-400 sm:text-xl">
            by {book.author || "Unknown author"}
          </p>

          {/* Catalog card */}
          <section
            aria-label="Catalog details"
            className="relative mt-10 rounded-[4px] border border-stone-300 bg-white px-6 pb-14 pt-4 shadow-[0_2px_0_rgba(0,0,0,.04),0_18px_30px_-22px_rgba(0,0,0,.35)] dark:border-stone-700 dark:bg-stone-900 sm:px-8"
          >
            {/* header line with call number, like a real index card */}
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#b4473f]/70 pb-2">
              <p className="font-serif text-lg font-semibold">{callNumber}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Call number
              </p>
            </div>

            <dl className="mt-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline gap-2 py-2.5">
                  <dt className="shrink-0 text-sm text-stone-500 dark:text-stone-400">
                    {f.label}
                  </dt>
                  <span
                    aria-hidden
                    className="min-w-4 flex-1 -translate-y-[3px] border-b border-dotted border-stone-300 dark:border-stone-600"
                  />
                  <dd className="min-w-0 break-words text-right text-sm font-medium">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* punch hole */}
            <span
              aria-hidden
              className="absolute bottom-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-stone-300 bg-stone-50 shadow-inner dark:border-stone-700 dark:bg-stone-950"
            />
          </section>

          {/* Synopsis */}
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold">About this book</h2>
            <p className="mt-4 max-w-[62ch] whitespace-pre-line font-serif text-[17px] leading-[1.85] text-stone-700 first-letter:float-left first-letter:pr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] dark:text-stone-300">
              {book.description ||
                "No synopsis has been added for this book yet."}
            </p>
          </section>

          {/* Borrow slip */}
          <section
            aria-label="Borrow this book"
            className="mt-12 flex flex-col gap-5 rounded-[4px] border-2 border-dashed border-stone-300 p-5 dark:border-stone-700 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-end gap-[4px]" aria-hidden>
                {ticks > 0 ? (
                  TICK_HEIGHTS.slice(0, ticks).map((h, i) => (
                    <span
                      key={i}
                      className="w-[7px] rounded-[1px]"
                      style={{
                        height: h,
                        backgroundColor: cloth,
                        opacity: 0.55 + (i % 3) * 0.2,
                      }}
                    />
                  ))
                ) : (
                  <span className="h-[26px] w-[7px] rounded-[1px] bg-stone-300 dark:bg-stone-600" />
                )}
              </div>
              <div>
                <p className="font-serif text-lg font-semibold">
                  {copies > 0 ? "On the shelf" : "All copies are out"}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {copies > 0
                    ? `${copies} ${copies === 1 ? "copy is" : "copies are"} ready to borrow`
                    : "Check back soon"}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={copies <= 0}
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-[6px] px-6 text-sm font-semibold shadow-md outline-none transition-[filter,transform] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 dark:focus-visible:ring-offset-stone-950 sm:w-auto"
              style={{ backgroundColor: cloth, color: foil }}
            >
              <BookmarkCheck className="h-4 w-4" />
              Borrow this book
            </button>
          </section>
        </article>
      </div>
    </main>
  );
}