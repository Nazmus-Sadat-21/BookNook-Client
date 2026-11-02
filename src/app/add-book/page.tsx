"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ImagePlus,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];
const MAX_DESC = 600;

// Binding colours, taken from your site's browns
const CLOTH = ["#3e342a", "#52402d", "#5e4630", "#6b4f33", "#4a3a2c", "#7a5c3a"];
const FOIL = "#e9d9ab";
const TICK_HEIGHTS = [26, 21, 26, 23, 25];

function clothFor(category: string) {
  let h = 0;
  for (const ch of category) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CLOTH[h % CLOTH.length];
}

/* ───────── signed-in gates ───────── */

const LOADER_SPINES = [
  { h: 52, c: "#6b4f33" },
  { h: 40, c: "#8c6d46" },
  { h: 56, c: "#52402d" },
  { h: 46, c: "#a07a4f" },
  { h: 54, c: "#7a5c3a" },
  { h: 42, c: "#8c6d46" },
];

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
        Opening the catalog
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
          Sign in to add a book
        </h2>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          Books are catalogued under your name, so you need to be signed in
          before you can add one to the archive.
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

/* ───────── shared field styles ───────── */

const fieldLabel = "block text-sm text-stone-500 dark:text-stone-400";
const ruledInput =
  "mt-1 w-full border-0 border-b border-stone-300 bg-transparent px-0 py-2 text-[#2d2a26] outline-none transition-colors placeholder:text-stone-400 focus:border-[#8c6d46] focus:ring-0 dark:border-stone-600 dark:text-[#f0eae1] dark:placeholder:text-stone-500 dark:focus:border-[#d4a373]";

/* ───────── page ───────── */

export default function AddBookPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const loggedInUser = session?.user;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [copies, setCopies] = useState(1);
  const [description, setDescription] = useState("");

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverName, setCoverName] = useState("");
  const [coverError, setCoverError] = useState("");
  const [dragging, setDragging] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const acceptCover = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCoverError("Please choose an image file (JPG, PNG or WEBP).");
      return;
    }
    setCoverError("");
    setCoverName(file.name);
    setCoverPreview(URL.createObjectURL(file));

    if (fileInputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInputRef.current.files = transfer.files;
    }
  };

  const removeCover = () => {
    setCoverPreview(null);
    setCoverName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clampCopies = (value: number) =>
    setCopies(Math.min(99, Math.max(1, Number.isNaN(value) ? 1 : value)));

  const missing = [
    { label: "title", done: title.trim().length > 0 },
    { label: "author", done: author.trim().length > 0 },
    { label: "cover", done: !!coverPreview },
    { label: "synopsis", done: description.trim().length > 0 },
  ]
    .filter((r) => !r.done)
    .map((r) => r.label);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setCoverError("Add a cover image before publishing.");
      fileInputRef.current?.focus();
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      // 1. Upload the cover to ImgBB to get a permanent URL
      const imageFormData = new FormData();
      imageFormData.append("image", file);

      // Put your key in .env.local as NEXT_PUBLIC_IMGBB_KEY
      const IMGBB_API_KEY = "5e6efab626b697566595ba9c2775d4b0";

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: imageFormData }
      );
      const imgData = await imgRes.json();
      if (!imgData.success) {
        throw new Error("The cover could not be uploaded. Check your ImgBB key.");
      }
      const permanentImageUrl = imgData.data.url;

      // 2. Save the book with the permanent image URL
      const res = await fetch(`http://localhost:8000/add-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          category,
          copies,
          description,
          coverImage: permanentImageUrl,
          contributorName: loggedInUser?.name,
          contributorEmail: loggedInUser?.email,
          createdAt: new Date().toISOString(),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "The server could not save this book.");
      }

      setToast(`\u201c${title.trim()}\u201d is now on the shelf.`);
      setTitle("");
      setAuthor("");
      setCategory("Fiction");
      setCopies(1);
      setDescription("");
      removeCover();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setToast(null), 4500);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) return <ShelfLoader />;
  if (!loggedInUser) return <MembersOnly onHome={() => router.push("/")} />;

  const cloth = clothFor(category);
  const tickCount = Math.min(copies, TICK_HEIGHTS.length);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
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

      <form
        onSubmit={handleSubmit}
        className="grid min-h-screen lg:grid-cols-[minmax(340px,5fr)_7fr]"
      >
        {/* ───────── Left: the book you're making ───────── */}
        <aside
          aria-label="Live preview of the book"
          className="relative flex flex-col items-center justify-center px-6 pb-14 pt-24 transition-colors duration-500 lg:sticky lg:top-0 lg:h-screen lg:py-10"
          style={{ backgroundColor: cloth }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,.16), transparent 60%)",
            }}
          />

          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-5 top-5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/70 sm:left-8 sm:top-8"
            style={{ color: FOIL }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <input
            ref={fileInputRef}
            id="cover-image"
            name="cover"
            type="file"
            accept="image/*"
            onChange={(e) => acceptCover(e.target.files?.[0])}
            className="sr-only"
          />

          {/* the book (also the drop zone) */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              acceptCover(e.dataTransfer.files?.[0]);
            }}
            className={`relative w-[min(60%,260px)] transition-transform lg:w-[min(58%,300px)] ${
              dragging ? "scale-[1.03]" : ""
            }`}
          >
            <div
              aria-hidden
              className="absolute inset-y-[6px] -right-[9px] left-3 rounded-r-[5px] bg-stone-200"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,.09) 2px 3px)",
              }}
            />

            <div
              className={`relative aspect-[3/4] overflow-hidden rounded-l-[4px] rounded-r-[8px] shadow-[0_30px_40px_-18px_rgba(0,0,0,.65)] ${
                dragging ? "ring-2 ring-[#e9d9ab]" : ""
              }`}
              style={{ backgroundColor: "rgba(0,0,0,.28)" }}
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Selected book cover preview"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center px-8 pl-11 text-center"
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
                    className="relative break-words font-serif text-xl font-semibold leading-snug line-clamp-5"
                    style={{ color: title ? FOIL : "rgba(233,217,171,.45)" }}
                  >
                    {title || "Untitled book"}
                  </p>
                  <p
                    className="relative mt-4 break-words text-sm line-clamp-2"
                    style={{ color: author ? "rgba(233,217,171,.8)" : "rgba(233,217,171,.4)" }}
                  >
                    {author || "Author"}
                  </p>
                </div>
              )}

              {/* spine, hinge, gloss */}
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

              <span className="absolute bottom-4 right-4 max-w-[70%] truncate rounded-[3px] bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-800 shadow-sm">
                {category}
              </span>
            </div>
          </div>

          {/* shelf */}
          <div aria-hidden className="w-[88%] max-w-[420px]">
            <div className="h-3 rounded-t-[2px] bg-black/35" />
            <div className="h-1.5 bg-black/55" />
          </div>

          {/* cover controls */}
          <div className="mt-6 flex min-h-11 flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/70"
                style={{ color: FOIL }}
              >
                <ImagePlus className="h-4 w-4" />
                {coverPreview ? "Change cover" : "Add a cover"}
              </button>
              {coverPreview && (
                <button
                  type="button"
                  onClick={removeCover}
                  className="min-h-11 cursor-pointer px-2 text-sm underline underline-offset-4 outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/70"
                  style={{ color: "rgba(233,217,171,.8)" }}
                >
                  Remove
                </button>
              )}
            </div>
            <p
              className="max-w-[16rem] truncate text-xs"
              style={{ color: coverError ? FOIL : "rgba(233,217,171,.6)" }}
              role={coverError ? "alert" : undefined}
            >
              {coverError || coverName || "Drop an image on the book, or choose one. JPG, PNG or WEBP."}
            </p>
          </div>

          <p
            className="absolute bottom-4 left-0 right-0 truncate px-6 text-center text-xs"
            style={{ color: "rgba(233,217,171,.6)" }}
          >
            Catalogued by {loggedInUser.name}
          </p>
        </aside>

        {/* ───────── Right: the catalog form ───────── */}
        <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-10 lg:py-16">
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Add a book
          </h1>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
            Fill in the card below. The book on the left is built as you type.
          </p>

          <section
            aria-label="Catalog entry"
            className="relative mt-8 rounded-[4px] border border-stone-300 bg-white px-6 pb-14 pt-4 shadow-[0_2px_0_rgba(0,0,0,.04),0_18px_30px_-22px_rgba(0,0,0,.35)] dark:border-stone-700 dark:bg-stone-900 sm:px-8"
          >
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#b4473f]/70 pb-2">
              <p className="font-serif text-lg font-semibold">New entry</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                All fields are required
              </p>
            </div>

            <div className="mt-6 space-y-7">
              <div>
                <label htmlFor="book-title" className={fieldLabel}>
                  Title
                </label>
                <input
                  id="book-title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The Shadow of the Wind"
                  className={`${ruledInput} font-serif text-2xl`}
                />
              </div>

              <div>
                <label htmlFor="author-name" className={fieldLabel}>
                  Author
                </label>
                <input
                  id="author-name"
                  name="author"
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Carlos Ruiz Zafón"
                  className={`${ruledInput} font-serif text-xl italic`}
                />
              </div>

              {/* Category */}
              <div>
                <p id="category-label" className={fieldLabel}>
                  Shelf
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby="category-label"
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {CATEGORIES.map((item) => {
                    const selected = category === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setCategory(item)}
                        className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-[4px] border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#8c6d46] ${
                          selected
                            ? "border-[#3e342a] bg-[#3e342a] text-[#faf8f5] dark:border-[#d4a373] dark:bg-[#d4a373] dark:text-[#181614]"
                            : "border-stone-300 text-stone-700 hover:border-stone-500 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-400"
                        }`}
                      >
                        {selected && <Check className="h-3.5 w-3.5" />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Copies */}
              <div>
                <label htmlFor="total-copies" className={fieldLabel}>
                  Copies
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-5">
                  <div className="inline-flex items-stretch overflow-hidden rounded-[4px] border border-stone-300 dark:border-stone-600">
                    <button
                      type="button"
                      onClick={() => clampCopies(copies - 1)}
                      disabled={copies <= 1}
                      aria-label="One fewer copy"
                      className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#8c6d46] outline-none hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8c6d46] disabled:cursor-not-allowed disabled:opacity-35 dark:text-[#d4a373] dark:hover:bg-white/10"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      id="total-copies"
                      name="copies"
                      type="number"
                      min={1}
                      max={99}
                      required
                      value={copies}
                      onChange={(e) => clampCopies(parseInt(e.target.value, 10))}
                      className="w-14 border-x border-stone-300 bg-transparent text-center text-base font-semibold text-[#2d2a26] outline-none focus:ring-0 dark:border-stone-600 dark:text-[#f0eae1]"
                    />
                    <button
                      type="button"
                      onClick={() => clampCopies(copies + 1)}
                      disabled={copies >= 99}
                      aria-label="One more copy"
                      className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#8c6d46] outline-none hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8c6d46] disabled:cursor-not-allowed disabled:opacity-35 dark:text-[#d4a373] dark:hover:bg-white/10"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-end gap-[4px]" aria-hidden>
                    {TICK_HEIGHTS.slice(0, tickCount).map((h, i) => (
                      <span
                        key={i}
                        className="w-[7px] rounded-[1px] transition-colors duration-500"
                        style={{
                          height: h,
                          backgroundColor: cloth,
                          opacity: 0.55 + (i % 3) * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Synopsis on lined paper */}
              <div>
                <label htmlFor="description" className={fieldLabel}>
                  Synopsis
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  maxLength={MAX_DESC}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A few lines about what the book is about…"
                  className="mt-1 block w-full resize-y border-0 bg-transparent px-0 pb-1 pt-0 font-serif text-[17px] leading-8 text-stone-800 outline-none placeholder:text-stone-400 focus:ring-0 dark:text-stone-200 dark:placeholder:text-stone-500"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(180deg, transparent 0 31px, rgba(140,109,70,.35) 31px 32px)",
                    backgroundAttachment: "local",
                  }}
                />
                <p className="mt-1 text-right text-xs text-stone-500 dark:text-stone-400">
                  {description.length} of {MAX_DESC} characters
                </p>
              </div>
            </div>

            <span
              aria-hidden
              className="absolute bottom-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-stone-300 bg-stone-50 shadow-inner dark:border-stone-700 dark:bg-stone-950"
            />
          </section>

          {/* Submit slip */}
          <section
            aria-label="Publish"
            className="mt-8 rounded-[4px] border-2 border-dashed border-stone-300 p-5 dark:border-stone-700 sm:p-6"
          >
            {submitError && (
              <p
                role="alert"
                className="mb-4 text-sm font-medium text-[#9b2f2a] dark:text-[#e58a84]"
              >
                {submitError}
              </p>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-600 dark:text-stone-400" aria-live="polite">
                {missing.length === 0
                  ? "Everything is filled in. Ready to shelve."
                  : `Still needed: ${missing.join(", ")}.`}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="min-h-11 cursor-pointer rounded-[6px] px-4 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-[6px] px-6 text-sm font-semibold shadow-md outline-none transition-[filter,transform] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-stone-950 sm:flex-none"
                  style={{ backgroundColor: cloth, color: FOIL }}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Shelving" : "Add to the archive"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}