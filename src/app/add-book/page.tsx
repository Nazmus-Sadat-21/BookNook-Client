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
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];
const MAX_DESC = 600;

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

    try {
      const res = await fetch(`http://localhost:8000/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          category,
          copies,
          description,
          coverImage: coverPreview, // or uploaded image URL
          contributorName: loggedInUser?.name,
          contributorEmail: loggedInUser?.email,
          createdAt: new Date().toISOString(), // Current date & time stamp
        }),
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        throw new Error("The server could not save this book.");
      }

      setToast(`\u201c${title.trim()}\u201d is now part of the collection.`);
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

  if (isPending) {
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
          Please log in to add books to the archive.
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

  return (
    <main className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
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
        <div className="mb-5 sm:mb-7 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="h-10 w-10 shrink-0 rounded-full border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa] dark:bg-[#1c1a18] text-[#625b52] dark:text-[#a89f91] flex items-center justify-center hover:bg-[#f2ede4] dark:hover:bg-[#23201d] transition cursor-pointer"
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
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-[17rem_1fr] lg:grid-cols-[22rem_1fr] gap-5 lg:gap-8 items-start"
        >
          {/* LIVE CATALOG CARD */}
          <aside
            aria-label="Live preview of the catalog entry"
            className="md:sticky md:top-6 rounded-[2rem] overflow-hidden border border-[#e8e2d9] dark:border-[#2a2622] bg-[#3e342a] dark:bg-[#141211] text-[#faf8f5] dark:text-[#f0eae1] shadow-2xl"
          >
            <div className="p-5 sm:p-6 flex flex-row md:flex-col gap-5 md:gap-6">
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
                      className="group h-full w-full border-2 border-dashed border-[#d4a373]/40 bg-[#8c6d46]/15 hover:bg-[#8c6d46]/25 hover:border-[#d4a373] flex flex-col items-center justify-center gap-2 p-3 text-center transition cursor-pointer"
                    >
                      <span className="h-11 w-11 rounded-2xl bg-[#d4a373]/15 text-[#d4a373] flex items-center justify-center group-hover:scale-105 transition">
                        <ImagePlus className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold">Add cover</span>
                    </button>
                  )}

                  {coverPreview && (
                    <div className="absolute bottom-2 inset-x-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#3e342a] px-2 py-1.5 text-[11px] font-semibold text-[#faf8f5] cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeCover}
                        aria-label="Remove cover"
                        className="rounded-lg bg-[#3e342a] px-2.5 py-1.5 text-[#faf8f5] cursor-pointer"
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
                >
                  {coverError || coverName || "JPG, PNG or WEBP"}
                </p>
              </div>

              <div className="min-w-0 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[#d4a373] text-xs font-semibold">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Catalog card</span>
                </div>

                <div className="mt-3 space-y-0 [&>div]:border-b [&>div]:border-[#e8e2d9]/15 [&>div]:py-3">
                  <div>
                    <p className="text-[11px] text-[#faf8f5]/50">Title</p>
                    <p className={`font-serif text-lg leading-snug break-words line-clamp-3 ${title ? "" : "text-[#faf8f5]/35"}`}>
                      {title || "Untitled book"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#faf8f5]/50">Author</p>
                    <p className={`text-sm break-words line-clamp-2 ${author ? "" : "text-[#faf8f5]/35"}`}>
                      {author || "Author not set"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#faf8f5]/50">Shelf</p>
                      <p className="text-sm font-semibold text-[#d4a373]">{category}</p>
                    </div>
                    <div className="text-right">
                      <p className="mt-1 text-[11px] text-[#faf8f5]/60">
                        {copies} {copies === 1 ? "copy" : "copies"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-[#e8e2d9]/15 flex items-center gap-3">
              <span className="h-9 w-9 shrink-0 rounded-xl bg-[#8c6d46]/25 text-[#d4a373] flex items-center justify-center">
                <UserRound className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-[#faf8f5]/50">Catalogued by</p>
                <p className="text-sm font-semibold truncate">{loggedInUser.name}</p>
                <p className="text-xs text-[#faf8f5]/60 truncate">{loggedInUser.email}</p>
              </div>
            </div>
          </aside>

          {/* FORM */}
          <section className="rounded-[2rem] border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa] dark:bg-[#1c1a18] shadow-2xl">
            <div className="p-6 sm:p-9 space-y-10">
              <fieldset className="space-y-7">
                <legend className="mb-1">
                  <span className="block font-serif text-lg font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                    About the book
                  </span>
                  <span className="block text-xs text-[#8c8275] dark:text-[#a89f91] mt-0.5">
                    Fields marked <span className="text-[#8c6d46]">*</span> are required.
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

              <fieldset className="space-y-6">
                <div>
                  <p className={`${labelBase} mb-2`}>
                    Category <span className="text-[#8c6d46]">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((item) => {
                      const selected = category === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setCategory(item)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold border transition cursor-pointer ${
                            selected
                              ? "bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] border-transparent shadow-md"
                              : "border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-[#625b52] dark:text-[#a89f91]"
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

                  <div className="inline-flex items-stretch rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => clampCopies(copies - 1)}
                      disabled={copies <= 1}
                      className="h-12 w-12 flex items-center justify-center text-[#8c6d46] cursor-pointer disabled:opacity-35"
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
                      className="w-16 text-center bg-transparent text-base font-semibold text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => clampCopies(copies + 1)}
                      disabled={copies >= 99}
                      className="h-12 w-12 flex items-center justify-center text-[#8c6d46] cursor-pointer disabled:opacity-35"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </fieldset>

              <fieldset>
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
                  placeholder="Write a brief overview..."
                  className={`${inputBase} min-h-[11rem] resize-y`}
                />
                <p className="mt-2 text-right text-[11px] text-[#8c8275]">
                  {description.length} / {MAX_DESC}
                </p>
              </fieldset>

              {submitError && (
                <p role="alert" className="rounded-xl border border-[#d4a373]/50 bg-[#8c6d46]/10 px-4 py-3 text-sm text-[#d4a373]">
                  {submitError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-[#e8e2d9] dark:border-[#2a2622]">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="py-3.5 px-5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] text-[#625b52] dark:text-[#a89f91] font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none sm:min-w-[13rem] py-3.5 px-6 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] font-semibold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
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
          </section>
        </form>
      </div>
    </main>
  );
}