"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ImagePlus,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];
const MAX_DESC = 600;

const loggedInUser = {
  name: "Alex Johnson",
  email: "alex@booknook.lib",
};

export default function AddBookPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Free the temporary image URL when it changes or the page unmounts.
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

    // Keep the real <input type="file"> in sync (needed for drag & drop).
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

  // Real progress: only fields the person still has to fill in.
  const required = [
    { label: "Title", done: title.trim().length > 0 },
    { label: "Author", done: author.trim().length > 0 },
    { label: "Cover", done: !!coverPreview },
    { label: "Synopsis", done: description.trim().length > 0 },
  ];
  const doneCount = required.filter((r) => r.done).length;
  const progress = (doneCount / required.length) * 100;
  const missing = required.filter((r) => !r.done).map((r) => r.label);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!coverPreview) {
      setCoverError("Add a cover image before publishing.");
      fileInputRef.current?.focus();
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    // Every named field in the form (title, author, category, copies,
    // description, cover file, contributor) is collected automatically.
    const formData = new FormData(event.currentTarget);
    const publishedTitle = title.trim();

    try {
      // Point this at your own route handler / server action.
      const response = await fetch("/api/books", {
        method: "POST",
        body: formData, // multipart/form-data, don't set Content-Type manually
      });

      if (!response.ok) {
        throw new Error("The server could not save this book.");
      }

      setToast(`\u201c${publishedTitle}\u201d is now part of the collection.`);
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
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-sm text-[#2d2a26] dark:text-[#f0eae1] placeholder:text-[#8c8275]/70 focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50 transition";

  const bigInput =
    "w-full bg-transparent border-0 border-b-2 border-[#e8e2d9] dark:border-[#2d2924] px-0 py-2 font-serif text-xl sm:text-2xl text-[#2d2a26] dark:text-[#f0eae1] placeholder:text-[#8c8275]/50 focus:outline-none focus:border-[#8c6d46] transition-colors";

  const labelBase =
    "block text-xs font-bold text-[#625b52] dark:text-[#a89f91] mb-1";

  return (
    <main className="min-h-screen  py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Success notification */}
      {toast && (
        <div
          role="status"
          className="fixed z-50 inset-x-4 top-4 sm:inset-x-auto sm:right-6 sm:w-[24rem] p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 shadow-xl"
        >
          <Sparkles className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm">
            <p className="font-semibold">Published</p>
            <p className="mt-0.5">{toast}</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="mb-5 sm:mb-7 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="h-10 w-10 shrink-0 rounded-full border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa] dark:bg-[#1c1a18] text-[#625b52] dark:text-[#a89f91] flex items-center justify-center hover:bg-[#f2ede4] dark:hover:bg-[#23201d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c6d46]/60 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1]">
              Add a book to the archive
            </h1>
            <p className="text-xs sm:text-sm text-[#8c8275] dark:text-[#a89f91] mt-0.5">
              Fill in the form and watch the catalog card build itself.
            </p>
          </div>
        </div>

        <form
          id="add-book-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 md:grid-cols-[17rem_1fr] lg:grid-cols-[22rem_1fr] gap-5 lg:gap-8 items-start"
        >
          {/* LIVE CATALOG CARD */}
          <aside
            aria-label="Live preview of the catalog entry"
            className="md:sticky md:top-6 rounded-[2rem] overflow-hidden border border-[#e8e2d9] dark:border-[#2a2622] bg-[#3e342a] dark:bg-[#141211] text-[#faf8f5] dark:text-[#f0eae1] shadow-2xl"
          >
            <div className="p-5 sm:p-6 flex flex-row md:flex-col gap-5 md:gap-6">
              {/* Cover = upload target */}
              <div className="w-28 sm:w-36 md:w-full md:max-w-[15rem] md:mx-auto shrink-0">
                <input
                  ref={fileInputRef}
                  id="cover-image"
                  name="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => acceptCover(e.target.files?.[0])}
                  className="sr-only"
                />

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
                  className={`relative aspect-[3/4] w-full rounded-r-2xl rounded-l-md overflow-hidden shadow-2xl transition ${
                    dragging ? "ring-2 ring-[#d4a373] scale-[1.02]" : ""
                  }`}
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Selected book cover preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="group h-full w-full border-2 border-dashed border-[#d4a373]/40 bg-[#8c6d46]/15 hover:bg-[#8c6d46]/25 hover:border-[#d4a373] flex flex-col items-center justify-center gap-2 p-3 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a373] transition cursor-pointer"
                    >
                      <span className="h-11 w-11 rounded-2xl bg-[#d4a373]/15 text-[#d4a373] flex items-center justify-center group-hover:scale-105 transition">
                        <ImagePlus className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold">Add cover</span>
                      <span className="hidden sm:block text-[11px] text-[#faf8f5]/60">
                        Drop an image or tap to browse
                      </span>
                    </button>
                  )}

                  {/* Book spine highlight */}
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />

                  {coverPreview && (
                    <div className="absolute bottom-2 inset-x-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#3e342a]/85 backdrop-blur px-2 py-1.5 text-[11px] font-semibold text-[#faf8f5] hover:bg-[#3e342a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a373] cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeCover}
                        aria-label="Remove cover"
                        className="rounded-lg bg-[#3e342a]/85 backdrop-blur px-2.5 py-1.5 text-[#faf8f5] hover:bg-[#3e342a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a373] cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <p
                  className={`mt-2 text-[11px] truncate ${
                    coverError ? "text-[#d4a373] font-semibold" : "text-[#faf8f5]/55"
                  }`}
                  title={coverName}
                  role={coverError ? "alert" : undefined}
                >
                  {coverError || coverName || "JPG, PNG or WEBP"}
                </p>
              </div>

              {/* Typed-in details, like a catalog card */}
              <div className="min-w-0 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[#d4a373] text-xs font-semibold">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Catalog card</span>
                </div>

                <div className="mt-3 space-y-0 [&>div]:border-b [&>div]:border-[#e8e2d9]/15 [&>div]:py-3">
                  <div>
                    <p className="text-[11px] text-[#faf8f5]/50">Title</p>
                    <p
                      className={`font-serif text-lg sm:text-xl leading-snug break-words line-clamp-3 ${
                        title ? "" : "text-[#faf8f5]/35"
                      }`}
                    >
                      {title || "Untitled book"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#faf8f5]/50">Author</p>
                    <p
                      className={`text-sm break-words line-clamp-2 ${
                        author ? "" : "text-[#faf8f5]/35"
                      }`}
                    >
                      {author || "Author not set"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#faf8f5]/50">Shelf</p>
                      <p className="text-sm font-semibold text-[#d4a373]">
                        {category}
                      </p>
                    </div>

                    {/* One spine per copy (up to 8) */}
                    <div className="text-right">
                      <div
                        className="flex items-end justify-end gap-[3px] h-6"
                        aria-hidden="true"
                      >
                        {Array.from({ length: Math.min(copies, 8) }).map(
                          (_, i) => (
                            <span
                              key={i}
                              className="w-[5px] rounded-sm bg-[#d4a373]"
                              style={{ height: `${55 + ((i * 37) % 45)}%` }}
                            />
                          )
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-[#faf8f5]/60">
                        {copies} {copies === 1 ? "copy" : "copies"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contributor */}
            <div className="px-5 sm:px-6 py-4 border-t border-[#e8e2d9]/15 flex items-center gap-3">
              <span className="h-9 w-9 shrink-0 rounded-xl bg-[#8c6d46]/25 text-[#d4a373] flex items-center justify-center">
                <UserRound className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-[#faf8f5]/50">Catalogued by</p>
                <p className="text-sm font-semibold truncate">
                  {loggedInUser.name}
                </p>
                <p className="text-xs text-[#faf8f5]/60 truncate">
                  {loggedInUser.email}
                </p>
              </div>
            </div>
          </aside>

          {/* FORM */}
          <section className="rounded-[2rem] border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa] dark:bg-[#1c1a18] shadow-2xl">
            <div className="p-6 sm:p-9 pb-0 sm:pb-0 space-y-10">
              {/* Values that are not typed into a visible input */}
              <input type="hidden" name="category" value={category} />
              <input type="hidden" name="contributorName" value={loggedInUser.name} />
              <input type="hidden" name="contributorEmail" value={loggedInUser.email} />

              {/* About the book */}
              <fieldset className="space-y-7">
                <legend className="mb-1">
                  <span className="block font-serif text-lg font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                    About the book
                  </span>
                  <span className="block text-xs text-[#8c8275] dark:text-[#a89f91] mt-0.5">
                    Fields marked <span className="text-[#8c6d46]">*</span> are
                    required.
                  </span>
                </legend>

                <div>
                  <label htmlFor="book-title" className={labelBase}>
                    Book title <span className="text-[#8c6d46]">*</span>
                  </label>
                  <input
                    id="book-title"
                    name="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="The Shadow of the Wind"
                    className={bigInput}
                  />
                </div>

                <div>
                  <label htmlFor="author-name" className={labelBase}>
                    Author name <span className="text-[#8c6d46]">*</span>
                  </label>
                  <input
                    id="author-name"
                    name="author"
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Carlos Ruiz Zafón"
                    className={bigInput}
                  />
                </div>
              </fieldset>

              {/* Shelving */}
              <fieldset className="space-y-6">
                <legend className="mb-1">
                  <span className="block font-serif text-lg font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                    Where it belongs
                  </span>
                  <span className="block text-xs text-[#8c8275] dark:text-[#a89f91] mt-0.5">
                    Pick a shelf and say how many copies the library holds.
                  </span>
                </legend>

                <div>
                  <p id="category-label" className={`${labelBase} mb-2`}>
                    Category <span className="text-[#8c6d46]">*</span>
                  </p>

                  <div
                    role="radiogroup"
                    aria-labelledby="category-label"
                    className="flex flex-wrap gap-2"
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
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c6d46]/60 cursor-pointer ${
                            selected
                              ? "bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] border-transparent shadow-md"
                              : "border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-[#625b52] dark:text-[#a89f91] hover:border-[#8c6d46]"
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="total-copies" className={`${labelBase} mb-2`}>
                    Total copies <span className="text-[#8c6d46]">*</span>
                  </label>

                  <div className="inline-flex items-stretch rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] overflow-hidden focus-within:ring-2 focus-within:ring-[#8c6d46]/50 transition">
                    <button
                      type="button"
                      aria-label="Remove one copy"
                      onClick={() => clampCopies(copies - 1)}
                      disabled={copies <= 1}
                      className="h-12 w-12 flex items-center justify-center text-[#8c6d46] hover:bg-[#f2ede4] dark:hover:bg-[#23201d] disabled:opacity-35 disabled:hover:bg-transparent transition cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <input
                      id="total-copies"
                      name="copies"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={99}
                      required
                      value={copies}
                      onChange={(e) => clampCopies(parseInt(e.target.value, 10))}
                      className="w-16 text-center bg-transparent text-base font-semibold text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <button
                      type="button"
                      aria-label="Add one copy"
                      onClick={() => clampCopies(copies + 1)}
                      disabled={copies >= 99}
                      className="h-12 w-12 flex items-center justify-center text-[#8c6d46] hover:bg-[#f2ede4] dark:hover:bg-[#23201d] disabled:opacity-35 disabled:hover:bg-transparent transition cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </fieldset>

              {/* Synopsis */}
              <fieldset>
                <legend className="mb-4">
                  <span className="block font-serif text-lg font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                    The story
                  </span>
                  <span className="block text-xs text-[#8c8275] dark:text-[#a89f91] mt-0.5">
                    A clear, engaging summary helps readers choose their next
                    book.
                  </span>
                </legend>

                <label htmlFor="description" className={`${labelBase} mb-2`}>
                  Synopsis <span className="text-[#8c6d46]">*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  required
                  rows={7}
                  maxLength={MAX_DESC}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a brief overview to captivate potential readers..."
                  className={`${inputBase} min-h-[11rem] resize-y leading-6`}
                />

                <p
                  className={`mt-2 text-right text-[11px] ${
                    description.length > MAX_DESC - 50
                      ? "text-[#8c6d46] font-semibold"
                      : "text-[#8c8275] dark:text-[#8a8175]"
                  }`}
                >
                  {description.length} / {MAX_DESC}
                </p>
              </fieldset>

              {submitError && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#d4a373]/50 bg-[#8c6d46]/10 px-4 py-3 text-sm text-[#625b52] dark:text-[#d4a373]"
                >
                  {submitError}
                </p>
              )}

              {/* Sticky action bar: always reachable on phone, tablet and desktop */}
              <div className="sticky bottom-0 -mx-6 sm:-mx-9 px-6 sm:px-9 py-4 rounded-b-[2rem] border-t border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa]/95 dark:bg-[#1c1a18]/95 backdrop-blur flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:block min-w-0 flex-1 max-w-[14rem]">
                  <div
                    className="h-1.5 rounded-full bg-[#e8e2d9] dark:bg-[#2d2924] overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={required.length}
                    aria-valuenow={doneCount}
                    aria-label="Required fields completed"
                  >
                    <div
                      className="h-full rounded-full bg-[#8c6d46] transition-[width] duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#8c8275] dark:text-[#a89f91] truncate">
                    {missing.length === 0
                      ? "Ready to publish"
                      : `Still needed: ${missing.join(", ")}`}
                  </p>
                </div>

                <span
                  className="sm:hidden text-xs font-semibold text-[#8c6d46] shrink-0"
                  aria-hidden="true"
                >
                  {doneCount}/{required.length}
                </span>

                <div className="flex flex-1 sm:flex-none items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="py-3.5 px-5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] text-[#625b52] dark:text-[#a89f91] font-semibold text-sm hover:bg-[#f2ede4] dark:hover:bg-[#23201d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c6d46]/50 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none sm:min-w-[13rem] py-3.5 px-6 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] font-semibold text-sm tracking-wide hover:opacity-95 shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c6d46] focus-visible:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Publish book
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}