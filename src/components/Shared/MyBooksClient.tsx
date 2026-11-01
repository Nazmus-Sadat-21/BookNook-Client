"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Sparkles, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  X, 
  Check, 
  Layers, 
  ArrowLeft,
  Loader2,
  ImagePlus,
  RefreshCw 
} from "lucide-react";

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

export default function MyBooksClient({ 
  initialBooks, 
  userEmail 
}: { 
  initialBooks: Book[]; 
  userEmail: string; 
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [toast, setToast] = useState<string | null>(null);

  // Edit Modal States
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);

  // Delete Confirmation Modal States
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  // Handle selecting a new cover file inside edit mode
  const handleEditCoverChange = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file (JPG, PNG or WEBP).");
      return;
    }
    setSelectedEditFile(file);
    // Create local preview URL temporarily
    const previewUrl = URL.createObjectURL(file);
    if (editingBook) {
      setEditingBook({ ...editingBook, coverImage: previewUrl });
    }
  };

  // --- HANDLE EDIT SUBMISSION ---
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBook) return;

    setIsUpdating(true);
    try {
      let finalCoverUrl = editingBook.coverImage;

      // If a new file was chosen, upload it to ImgBB first
      if (selectedEditFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", selectedEditFile);

        const IMGBB_API_KEY = "5e6efab626b697566595ba9c2775d4b0";

        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: imageFormData,
        });

        const imgData = await imgRes.json();
        if (!imgData.success) {
          throw new Error("Failed to upload new cover image to ImgBB. Check your API key.");
        }
        finalCoverUrl = imgData.data.url;
      }

      const updatedPayload = {
        ...editingBook,
        coverImage: finalCoverUrl,
      };

      const res = await fetch(`http://localhost:8000/books/${editingBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Server failed to update book.");
      }

      // Update local state UI
      setBooks(books.map((b) => (b._id === editingBook._id ? updatedPayload : b)));
      setEditingBook(null);
      setSelectedEditFile(null);
      showToastMsg(`“${editingBook.title}” was successfully updated.`);
    } catch (error: unknown) {
      console.error("Update error details:", error);
      alert(error instanceof Error ? error.message : "Something went wrong while updating the book.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- HANDLE DELETE CONFIRMATION ---
  const confirmDelete = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/books/${bookToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete book.");

      // Remove from UI state
      setBooks(books.filter((b) => b._id !== bookToDelete._id));
      setBookToDelete(null);
      showToastMsg(`“${bookToDelete.title}” has been removed from the archives.`);
    } catch (error) {
      alert("Could not delete book. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-300 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div role="status" className="fixed z-50 inset-x-4 top-4 sm:inset-x-auto sm:right-6 sm:w-[24rem] p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 shadow-xl backdrop-blur-md">
          <Sparkles className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm">
            <p className="font-semibold">Success</p>
            <p className="mt-0.5">{toast}</p>
          </div>
        </div>
      )}

      {/* Header & Total Count */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e2d9] dark:border-[#2d2924] pb-6">
        <div>
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c6d46] dark:text-[#d4a373] mb-3 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all books
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8c6d46]/10 text-[#8c6d46] text-xs font-semibold mb-3 ml-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1]">
            My Contributed Books
          </h1>
          <p className="text-sm text-[#8c8275] dark:text-[#a89f91] mt-1">
            Manage, update, or remove the books you have added for <span className="font-semibold text-[#2d2a26] dark:text-[#f0eae1]">{userEmail}</span>.
          </p>
        </div>

        {/* Total Books Count Badge */}
        <div className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-[#3e342a] dark:bg-[#1c1a18] text-[#faf8f5] dark:text-[#f0eae1] border border-[#e8e2d9]/20 shadow-md flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#d4a373]" />
          <span className="text-xs font-semibold">
            Total Books Added: <span className="text-[#d4a373]">{books.length}</span>
          </span>
        </div>
      </div>

      {/* Table Section or Empty State */}
      {books.length === 0 ? (
        <div className="text-center py-20 bg-[#fdfcfa] dark:bg-[#1c1a18] rounded-3xl border border-[#e8e2d9] dark:border-[#2a2622] shadow-sm">
          <BookOpen className="h-12 w-12 mx-auto text-[#8c8275] mb-3 opacity-40" />
          <h3 className="font-serif text-xl font-semibold text-[#2d2a26] dark:text-[#f0eae1]">No books found</h3>
          <p className="text-xs text-[#8c8275] dark:text-[#a89f91] mt-1 max-w-sm mx-auto">
            You haven't contributed any books to the archive under this account yet.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa] dark:bg-[#1c1a18] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e8e2d9] dark:border-[#2d2924] bg-[#3e342a]/5 dark:bg-white/[0.02] text-[#625b52] dark:text-[#a89f91] text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Book Image</th>
                  <th className="py-4 px-6">Name & Author</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Copies</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e2d9]/60 dark:divide-[#2a2622] text-sm text-[#2d2a26] dark:text-[#f0eae1]">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-[#3e342a]/[0.02] dark:hover:bg-white/[0.01] transition">
                    
                    {/* Image Thumbnail */}
                    <td className="py-4 px-6">
                      <div className="h-14 w-11 rounded-xl overflow-hidden bg-[#3e342a]/10 border border-[#e8e2d9] dark:border-[#2d2924] shrink-0 shadow">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[#8c8275]">
                            <BookOpen className="h-5 w-5 opacity-40" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name & Author */}
                    <td className="py-4 px-6">
                      <p className="font-serif font-bold text-base leading-snug line-clamp-1">{book.title}</p>
                      <p className="text-xs text-[#8c6d46] dark:text-[#d4a373] mt-0.5">By {book.author}</p>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-flex px-3 py-1 rounded-full bg-[#8c6d46]/10 text-[#8c6d46] dark:text-[#d4a373] text-xs font-semibold">
                        {book.category}
                      </span>
                    </td>

                    {/* Copies */}
                    <td className="py-4 px-6">
                      <span className="font-semibold">{book.copies ?? 1}</span>
                    </td>

                    {/* Create Date */}
                    <td className="py-4 px-6 text-xs text-[#8c8275] dark:text-[#a89f91]">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                    </td>

                    {/* Actions (Edit & Delete Buttons) */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingBook(book);
                          setSelectedEditFile(null);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3e342a]/10 dark:bg-white/10 text-[#2d2a26] dark:text-[#f0eae1] text-xs font-semibold hover:bg-[#8c6d46] hover:text-white transition cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => setBookToDelete(book)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-600 hover:text-white transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL FORM --- */}
      {editingBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-[#fdfcfa] dark:bg-[#1c1a18] border border-[#e8e2d9] dark:border-[#2a2622] shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => {
                setEditingBook(null);
                setSelectedEditFile(null);
              }}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-[#3e342a]/10 flex items-center justify-center text-[#625b52] hover:bg-[#3e342a]/20 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#2d2a26] dark:text-[#f0eae1] mb-1">
              Edit Book Entry
            </h2>
            <p className="text-xs text-[#8c8275] dark:text-[#a89f91] mb-6">
              Modify the book details below and save changes.
            </p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#625b52] dark:text-[#a89f91] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#625b52] dark:text-[#a89f91] mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#625b52] dark:text-[#a89f91] mb-1">Category</label>
                <select
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#625b52] dark:text-[#a89f91] mb-1">Copies</label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  required
                  value={editingBook.copies}
                  onChange={(e) => setEditingBook({ ...editingBook, copies: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50"
                />
              </div>

              {/* Cover Image File Input Section */}
              <div>
                <label className="block text-xs font-bold text-[#625b52] dark:text-[#a89f91] mb-1">Cover Image File</label>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEditCoverChange(e.target.files?.[0])}
                  className="hidden"
                />

                <div className="flex items-center gap-4 p-3 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#141211]">
                  <div className="h-16 w-12 rounded-lg overflow-hidden bg-[#3e342a]/10 shrink-0 border border-[#e8e2d9] dark:border-[#2d2924]">
                    {editingBook.coverImage ? (
                      <img src={editingBook.coverImage} alt="Cover preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#8c8275]">
                        <ImagePlus className="h-5 w-5 opacity-40" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#2d2a26] dark:text-[#f0eae1] truncate">
                      {editingBook.coverImage ? "Cover image loaded" : "No image selected"}
                    </p>
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-xs font-semibold cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" /> Change Image
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8e2d9] dark:border-[#2a2622]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBook(null);
                    setSelectedEditFile(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] text-[#625b52] dark:text-[#a89f91] text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-sm font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-[#fdfcfa] dark:bg-[#1c1a18] border border-[#e8e2d9] dark:border-[#2a2622] shadow-2xl p-6 sm:p-8 text-center space-y-4">
            
            <div className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#2d2a26] dark:text-[#f0eae1]">
              Delete Book?
            </h3>
            
            <p className="text-xs sm:text-sm text-[#8c8275] dark:text-[#a89f91]">
              Are you sure you want to permanently delete <strong className="text-[#2d2a26] dark:text-[#f0eae1]">“{bookToDelete.title}”</strong> from the archive? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setBookToDelete(null)}
                className="flex-1 px-5 py-3 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] text-[#625b52] dark:text-[#a89f91] text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white text-sm font-bold shadow-lg hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span>Yes, Delete</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}