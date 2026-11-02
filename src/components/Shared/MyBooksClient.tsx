"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Pencil, Trash2 } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  description?: string;
  coverImage?: string;
  createdAt?: string;
}

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

// Binding colours, taken from your site's browns
const CLOTH = ["#3e342a", "#52402d", "#5e4630", "#6b4f33", "#4a3a2c", "#7a5c3a"];
const FOIL = "#e9d9ab";
const TICK_HEIGHTS = [20, 16, 20, 17, 19];

function clothFor(category: string) {
  let h = 0;
  for (const ch of category) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CLOTH[h % CLOTH.length];
}

/* ───────── small pieces ───────── */

function MiniBook({
  book,
  className = "h-[60px] w-11",
}: {
  book: Pick<Book, "title" | "category" | "coverImage">;
  className?: string;
}) {
  const cloth = clothFor(book.category);
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-l-[2px] rounded-r-[4px] shadow-[0_8px_12px_-6px_rgba(0,0,0,.55)] ${className}`}
      style={{ backgroundColor: cloth }}
    >
      {book.coverImage ? (
        <img src={book.coverImage} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center pl-1">
          <span
            aria-hidden
            className="absolute inset-[3px] left-[6px] rounded-[2px] border"
            style={{ borderColor: "rgba(233,217,171,.5)" }}
          />
          <span className="relative font-serif text-lg font-semibold" style={{ color: FOIL }}>
            {book.title.charAt(0).toUpperCase()}
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

function CopyTicks({ copies, color }: { copies: number; color: string }) {
  const n = Math.min(Math.max(copies, 0), TICK_HEIGHTS.length);
  return (
    <div className="flex items-end gap-[3px]" aria-hidden>
      {n > 0 ? (
        TICK_HEIGHTS.slice(0, n).map((h, i) => (
          <span
            key={i}
            className="w-[5px] rounded-[1px]"
            style={{ height: h, backgroundColor: color, opacity: 0.55 + (i % 3) * 0.2 }}
          />
        ))
      ) : (
        <span className="h-5 w-[5px] rounded-[1px] bg-stone-300 dark:bg-stone-600" />
      )}
    </div>
  );
}

function Modal({
  labelledBy,
  onClose,
  children,
  maxW = "max-w-lg",
}: {
  labelledBy: string;
  onClose: () => void;
  children: React.ReactNode;
  maxW?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-[4px] border border-stone-300 bg-white px-6 pb-7 pt-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] dark:border-stone-700 dark:bg-stone-900 sm:px-8 ${maxW}`}
      >
        {children}
      </div>
    </div>
  );
}

const fieldLabel = "block text-sm text-stone-500 dark:text-stone-400";
const fieldInput =
  "mt-1 w-full border-0 border-b border-stone-300 bg-transparent px-0 py-2 text-[15px] text-[#2d2a26] outline-none transition-colors focus:border-[#8c6d46] focus:ring-0 dark:border-stone-600 dark:text-[#f0eae1] dark:focus:border-[#d4a373]";

/* ───────── main component ───────── */

export default function MyBooksClient({
  initialBooks,
  userEmail,
}: {
  initialBooks: Book[];
  userEmail: string;
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);

  // Delete state
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const closeEdit = () => {
    setEditingBook(null);
    setSelectedEditFile(null);
    setError(null);
  };
  const closeDelete = () => {
    setBookToDelete(null);
    setError(null);
  };

  const handleEditCoverChange = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file (JPG, PNG or WEBP).");
      return;
    }
    setError(null);
    setSelectedEditFile(file);
    const previewUrl = URL.createObjectURL(file);
    if (editingBook) setEditingBook({ ...editingBook, coverImage: previewUrl });
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBook) return;

    setIsUpdating(true);
    setError(null);
    try {
      let finalCoverUrl = editingBook.coverImage;

      if (selectedEditFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", selectedEditFile);

        // Put your key in .env.local as NEXT_PUBLIC_IMGBB_KEY
        const IMGBB_API_KEY = "5e6efab626b697566595ba9c2775d4b0";

        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          { method: "POST", body: imageFormData }
        );
        const imgData = await imgRes.json();
        if (!imgData.success) {
          throw new Error("The new cover could not be uploaded. Check your ImgBB key.");
        }
        finalCoverUrl = imgData.data.url;
      }

      const updatedPayload = { ...editingBook, coverImage: finalCoverUrl };

      const res = await fetch(`http://localhost:8000/books/${editingBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "The server could not update this book.");

      setBooks(books.map((b) => (b._id === editingBook._id ? updatedPayload : b)));
      closeEdit();
      showToastMsg(`“${editingBook.title}” was updated.`);
    } catch (err: unknown) {
      console.error("Update error details:", err);
      setError(err instanceof Error ? err.message : "Something went wrong while saving.");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/books/${bookToDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("The book could not be deleted. Please try again.");

      setBooks(books.filter((b) => b._id !== bookToDelete._id));
      const title = bookToDelete.title;
      closeDelete();
      showToastMsg(`“${title}” was deleted from the archive.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "The book could not be deleted.");
    } finally {
      setIsDeleting(false);
    }
  };

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
          My shelf
        </h1>
        <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
          {books.length === 0
            ? "You haven't added any books yet."
            : `You've added ${books.length} ${books.length === 1 ? "book" : "books"} as `}
          {books.length > 0 && (
            <span className="font-medium text-[#2d2a26] dark:text-[#f0eae1]">{userEmail}</span>
          )}
          {books.length > 0 && ". Edit a title or take it off the shelf."}
        </p>
      </header>

      {/* Table */}
      {books.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="font-serif text-xl text-[#2d2a26] dark:text-[#f0eae1]">
            Your shelf is empty
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500 dark:text-stone-400">
            Books you add to the archive with this account will be listed here.
          </p>
          <div aria-hidden className="mx-auto mt-8 w-64">
            <div className="h-3 rounded-t-[2px] bg-[#3e342a]/20 dark:bg-white/10" />
            <div className="h-1.5 bg-[#3e342a]/40 dark:bg-white/20" />
          </div>
        </div>
      ) : (
        <section
          aria-label="Your books"
          className="mt-10 overflow-hidden rounded-[4px] border border-stone-300 bg-white shadow-[0_2px_0_rgba(0,0,0,.04),0_22px_36px_-26px_rgba(0,0,0,.4)] dark:border-stone-700 dark:bg-stone-900"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Books you have added to the archive</caption>
              <thead>
                <tr className="border-b-2 border-[#b4473f]/70 text-sm text-stone-500 dark:text-stone-400">
                  <th scope="col" className="w-0 py-3.5 pl-5 pr-3 font-normal sm:pl-7">
                    <span className="sr-only">Cover</span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 font-normal">Book</th>
                  <th scope="col" className="hidden px-3 py-3.5 font-normal sm:table-cell">
                    Category
                  </th>
                  <th scope="col" className="hidden px-3 py-3.5 font-normal md:table-cell">
                    Copies
                  </th>
                  <th scope="col" className="hidden px-3 py-3.5 font-normal lg:table-cell">
                    Added
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-5 text-right font-normal sm:pr-7">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-dotted divide-stone-300 dark:divide-stone-700">
                {books.map((book) => {
                  const cloth = clothFor(book.category);
                  const copies = book.copies ?? 1;
                  return (
                    <tr
                      key={book._id}
                      className="transition-colors hover:bg-stone-50 dark:hover:bg-white/[0.03]"
                    >
                      {/* Cover */}
                      <td className="w-0 py-4 pl-5 pr-3 align-middle sm:pl-7">
                        <MiniBook book={book} />
                      </td>

                      {/* Title & author */}
                      <td className="min-w-[11rem] max-w-[22rem] px-3 py-4 align-middle">
                        <Link
                          href={`/books/${book._id}`}
                          className="block truncate font-serif text-lg font-semibold leading-snug text-[#2d2a26] hover:underline dark:text-[#f0eae1]"
                        >
                          {book.title}
                        </Link>
                        <p className="truncate text-sm italic text-stone-600 dark:text-stone-400">
                          {book.author}
                        </p>
                        {/* shown here only when the Category column is hidden */}
                        <span className="mt-1.5 inline-block rounded-[3px] border border-stone-300 px-2 py-0.5 text-xs text-stone-700 dark:border-stone-600 dark:text-stone-300 sm:hidden">
                          {book.category}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="hidden px-3 py-4 align-middle sm:table-cell">
                        <span className="inline-block whitespace-nowrap rounded-[3px] border border-stone-300 px-2 py-0.5 text-xs text-stone-700 dark:border-stone-600 dark:text-stone-300">
                          {book.category}
                        </span>
                      </td>

                      {/* Copies */}
                      <td className="hidden px-3 py-4 align-middle md:table-cell">
                        <div className="flex items-center gap-2.5">
                          <CopyTicks copies={copies} color={cloth} />
                          <span className="whitespace-nowrap text-sm text-stone-700 dark:text-stone-300">
                            {copies} {copies === 1 ? "copy" : "copies"}
                          </span>
                        </div>
                      </td>

                      {/* Added */}
                      <td className="hidden whitespace-nowrap px-3 py-4 align-middle text-sm text-stone-500 dark:text-stone-400 lg:table-cell">
                        {book.createdAt
                          ? new Date(book.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Not recorded"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-5 text-right align-middle sm:pr-7">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Edit ${book.title}`}
                            onClick={() => {
                              setError(null);
                              setSelectedEditFile(null);
                              setEditingBook(book);
                            }}
                            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-[6px] px-3 text-sm font-medium text-[#3e342a] outline-none transition-colors hover:bg-[#3e342a]/10 focus-visible:ring-2 focus-visible:ring-[#8c6d46] dark:text-[#f0eae1] dark:hover:bg-white/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${book.title}`}
                            onClick={() => {
                              setError(null);
                              setBookToDelete(book);
                            }}
                            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-[6px] px-3 text-sm font-medium text-[#9b2f2a] outline-none transition-colors hover:bg-[#9b2f2a]/10 focus-visible:ring-2 focus-visible:ring-[#9b2f2a] dark:text-[#e58a84] dark:hover:bg-[#e58a84]/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ───────── Edit modal: a catalog card ───────── */}
      {editingBook && (
        <Modal labelledBy="edit-title" onClose={closeEdit}>
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#b4473f]/70 pb-2">
            <h2
              id="edit-title"
              className="font-serif text-xl font-semibold text-[#2d2a26] dark:text-[#f0eae1]"
            >
              Edit book
            </h2>
            <button
              type="button"
              onClick={closeEdit}
              className="min-h-11 cursor-pointer px-1 text-sm text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleUpdateSubmit} className="mt-5 space-y-5">
            <div>
              <label htmlFor="edit-book-title" className={fieldLabel}>Title</label>
              <input
                id="edit-book-title"
                type="text"
                required
                autoFocus
                value={editingBook.title}
                onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                className={fieldInput}
              />
            </div>

            <div>
              <label htmlFor="edit-book-author" className={fieldLabel}>Author</label>
              <input
                id="edit-book-author"
                type="text"
                required
                value={editingBook.author}
                onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                className={fieldInput}
              />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-5">
              <div>
                <label htmlFor="edit-book-category" className={fieldLabel}>Category</label>
                <select
                  id="edit-book-category"
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                  className={`${fieldInput} cursor-pointer`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-book-copies" className={fieldLabel}>Copies</label>
                <input
                  id="edit-book-copies"
                  type="number"
                  min={1}
                  max={99}
                  required
                  value={editingBook.copies}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, copies: Number(e.target.value) })
                  }
                  className={fieldInput}
                />
              </div>
            </div>

            {/* Cover */}
            <div>
              <span className={fieldLabel}>Cover</span>
              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleEditCoverChange(e.target.files?.[0])}
                className="hidden"
              />
              <div className="mt-2 flex items-center gap-4">
                <MiniBook book={editingBook} className="h-[84px] w-16" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-stone-700 dark:text-stone-300">
                    {selectedEditFile
                      ? selectedEditFile.name
                      : editingBook.coverImage
                      ? "Current cover"
                      : "No cover yet"}
                  </p>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="mt-1 min-h-11 cursor-pointer text-sm font-medium text-[#8c6d46] underline underline-offset-4 dark:text-[#d4a373]"
                  >
                    {editingBook.coverImage ? "Choose a different image" : "Choose an image"}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-[#9b2f2a] dark:text-[#e58a84]">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-dashed border-stone-300 pt-5 dark:border-stone-700">
              <button
                type="button"
                onClick={closeEdit}
                className="min-h-11 cursor-pointer rounded-[6px] px-4 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md outline-none transition-[filter] hover:brightness-125 focus-visible:ring-2 focus-visible:ring-[#8c6d46] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#d4a373] dark:text-[#181614] dark:focus-visible:ring-offset-stone-900"
              >
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isUpdating ? "Saving" : "Save changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ───────── Delete modal ───────── */}
      {bookToDelete && (
        <Modal labelledBy="delete-title" onClose={closeDelete} maxW="max-w-md">
          <div className="border-b-2 border-[#9b2f2a]/70 pb-2">
            <h2
              id="delete-title"
              className="font-serif text-xl font-semibold text-[#2d2a26] dark:text-[#f0eae1]"
            >
              Delete this book?
            </h2>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <MiniBook book={bookToDelete} className="h-[84px] w-16" />
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold leading-snug text-[#2d2a26] line-clamp-2 dark:text-[#f0eae1]">
                {bookToDelete.title}
              </p>
              <p className="text-sm italic text-stone-600 dark:text-stone-400">
                {bookToDelete.author}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            It will be removed from the archive for everyone. This can’t be undone.
          </p>

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-[#9b2f2a] dark:text-[#e58a84]">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-dashed border-stone-300 pt-5 dark:border-stone-700">
            <button
              type="button"
              onClick={closeDelete}
              autoFocus
              className="min-h-11 cursor-pointer rounded-[6px] px-4 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10"
            >
              Keep book
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[6px] bg-[#9b2f2a] px-6 text-sm font-semibold text-white shadow-md outline-none transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#9b2f2a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-stone-900"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? "Deleting" : "Delete book"}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}