import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BookCardProps {
  data: {
    _id?: string;
    id?: string;
    title: string;
    author: string;
    category: string;
    coverImage?: string;
    description?: string;
    copies?: number;
    createdAt?: string;
  };
}

// Each category gets a fixed "book-cloth" binding colour
const CLOTH = [
  "#7a2e2e", // oxblood
  "#2f4a3c", // forest
  "#26364f", // navy
  "#9a6b1f", // ochre
  "#55304f", // plum
  "#2d5560", // teal
];

function clothFor(category: string) {
  let h = 0;
  for (const ch of category) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CLOTH[h % CLOTH.length];
}

const TICK_HEIGHTS = [20, 16, 20, 17, 19];

export default function BookCard({ data }: BookCardProps) {
  const bookId = data._id || data.id;
  const cloth = clothFor(data.category);
  const copies = data.copies ?? 1;
  const hasCover = data.coverImage && !data.coverImage.startsWith("blob:");
  const ticks = Math.min(Math.max(copies, 0), TICK_HEIGHTS.length);

  return (
    <Link
      href={`/books/${bookId}`}
      aria-label={`${data.title} by ${data.author}`}
      className="group block rounded-xl p-3 outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-stone-500 dark:focus-visible:ring-offset-stone-950"
    >
      {/* The book */}
      <div className="relative mx-auto w-[88%] [perspective:900px]">
        {/* page block behind the cover */}
        <div
          aria-hidden
          className="absolute inset-y-[5px] -right-[7px] left-3 rounded-r-[4px] bg-stone-200 dark:bg-stone-600"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,.09) 2px 3px)",
          }}
        />

        {/* cover */}
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-l-[3px] rounded-r-[6px] shadow-[0_18px_28px_-14px_rgba(0,0,0,.55)] transition-transform duration-300 ease-out group-hover:[transform:rotateY(-10deg)_translateY(-6px)] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          style={{ backgroundColor: cloth, transformOrigin: "left center" }}
        >
          {hasCover ? (
            <img
              src={data.coverImage}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center px-7 pl-9 text-center">
              <div
                aria-hidden
                className="absolute inset-3 left-5 rounded-[3px] border"
                style={{ borderColor: "rgba(233,217,171,.55)" }}
              />
              <div
                aria-hidden
                className="absolute inset-[18px] left-[26px] rounded-[2px] border"
                style={{ borderColor: "rgba(233,217,171,.25)" }}
              />
              <p
                className="relative font-serif text-lg font-semibold leading-snug line-clamp-4"
                style={{ color: "#e9d9ab" }}
              >
                {data.title}
              </p>
              <p
                className="relative mt-3 text-xs line-clamp-2"
                style={{ color: "rgba(233,217,171,.75)" }}
              >
                {data.author}
              </p>
            </div>
          )}

          {/* spine + hinge groove */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-4"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,.4) 0%, rgba(255,255,255,.2) 45%, rgba(0,0,0,.18) 80%, transparent 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-[18px] w-px bg-black/25"
          />

          {/* gloss */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20"
          />

          {/* library-style category sticker */}
          <span className="absolute bottom-3 right-3 max-w-[70%] truncate rounded-[3px] bg-stone-50 px-2 py-1 text-[11px] font-medium text-stone-800 shadow-sm">
            {data.category}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-5 px-1">
        <h3 className="font-serif text-lg font-semibold leading-snug text-stone-900 line-clamp-2 dark:text-stone-100">
          {data.title}
        </h3>
        <p className="mt-1 text-sm text-stone-600 line-clamp-1 dark:text-stone-400">
          {data.author}
        </p>

        {data.description && (
          <p className="mt-2 text-[13px] leading-relaxed text-stone-500 line-clamp-2 dark:text-stone-400/90">
            {data.description}
          </p>
        )}

        {/* due-slip style footer */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-stone-300 pt-3 dark:border-stone-700">
          <div className="flex items-center gap-2.5">
            <div className="flex items-end gap-[3px]" aria-hidden>
              {ticks > 0 ? (
                TICK_HEIGHTS.slice(0, ticks).map((h, i) => (
                  <span
                    key={i}
                    className="w-[5px] rounded-[1px]"
                    style={{
                      height: h,
                      backgroundColor: cloth,
                      opacity: 0.55 + (i % 3) * 0.2,
                    }}
                  />
                ))
              ) : (
                <span className="h-5 w-[5px] rounded-[1px] bg-stone-300 dark:bg-stone-600" />
              )}
            </div>
            <span className="text-xs text-stone-600 dark:text-stone-400">
              {copies > 0
                ? `${copies} ${copies === 1 ? "copy" : "copies"}`
                : "Unavailable"}
            </span>
          </div>

          <span
            className="inline-flex items-center gap-0.5 text-sm font-medium"
            style={{ color: cloth }}
          >
            <span className="dark:brightness-[1.9]">View details</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      </div>
    </Link>
  );
}