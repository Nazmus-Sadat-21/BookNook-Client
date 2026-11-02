"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, ShieldCheck, BookOpen, BookmarkCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const FOIL = "#e9d9ab";

const ruledInput =
  "h-11 rounded-[6px] border border-stone-300 bg-stone-50/50 px-3.5 text-[15px] text-[#2d2a26] shadow-inner placeholder:text-stone-400 focus-visible:border-[#8c6d46] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#8c6d46] dark:border-stone-700 dark:bg-stone-950/50 dark:text-[#f0eae1] dark:placeholder:text-stone-500 dark:focus-visible:border-[#d4a373]";

const fieldLabel = "text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400";

/* ───────── gates ───────── */

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
        Finding your card
      </p>
    </div>
  );
}

function MembersOnly({ onHome }: { onHome: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section
        aria-labelledby="members-only-title"
        className="relative w-full max-w-md rounded-[6px] border border-stone-300 bg-white px-7 pb-9 pt-5 shadow-[0_2px_0_rgba(0,0,0,.04),0_22px_36px_-24px_rgba(0,0,0,.4)] dark:border-stone-700 dark:bg-stone-900 sm:px-9"
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
          {["Name", "Account"].map((label) => (
            <div key={label} className="flex items-baseline gap-2 py-2">
              <span className="text-sm text-stone-500 dark:text-stone-400">{label}</span>
              <span className="min-w-4 flex-1 -translate-y-[3px] border-b border-dotted border-stone-300 dark:border-stone-600" />
            </div>
          ))}
        </div>

        <h2 className="mt-8 font-serif text-2xl font-semibold leading-snug text-[#2d2a26] dark:text-[#f0eae1]">
          Sign in to see your card
        </h2>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          Your library card holds your name, photo and activity. Sign in to
          view and edit it.
        </p>

        <Button
          type="button"
          onClick={onHome}
          className="mt-7 h-11 cursor-pointer rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md hover:bg-[#3e342a]/90 dark:bg-[#d4a373] dark:text-[#181614] dark:hover:bg-[#d4a373]/90"
        >
          Return home
        </Button>

        <span
          aria-hidden
          className="absolute bottom-3 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-stone-300 bg-stone-50 shadow-inner dark:border-stone-700 dark:bg-stone-950"
        />
      </section>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-2 py-3 border-b border-stone-100 dark:border-stone-800/60 last:border-0">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{label}</dt>
      <span
        aria-hidden
        className="min-w-4 flex-1 -translate-y-[3px] border-b border-dotted border-stone-300 dark:border-stone-700"
      />
      <dd className="min-w-0 break-words text-right text-sm font-medium text-[#2d2a26] dark:text-[#f0eae1]">
        {children}
      </dd>
    </div>
  );
}

/* ───────── page ───────── */

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending, refetch } = authClient.useSession();
  const currentUser = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempAvatar, setTempAvatar] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [booksAddedCount, setBooksAddedCount] = useState<number | null>(null);
  const [borrowedCount, setBorrowedCount] = useState<number | null>(null);

  const getInitial = (name?: string | null) =>
    name ? name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    if (currentUser) {
      async function fetchUserStats() {
        if (!currentUser?.email) return;

        try {
          const { data: tokenData } = await authClient.token();
          const token = tokenData?.token;

          const booksRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/my-books/${currentUser.email}`, {
            cache: "no-store",
            headers: {
              authorization: `Bearer ${token}`
            }
          });
          if (booksRes.ok) {
            const booksData = await booksRes.json();
            setBooksAddedCount(Array.isArray(booksData) ? booksData.length : 0);
          }

          const borrowsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/my-borrows/${currentUser.email}`, {
            cache: "no-store",
            headers: {
              authorization: `Bearer ${token}`
            }
          });
          if (borrowsRes.ok) {
            const borrowsData = await borrowsRes.json();
            setBorrowedCount(Array.isArray(borrowsData) ? borrowsData.length : 0);
          }
        } catch (error) {
          console.error("Failed to fetch profile stats:", error);
        }
      }

      fetchUserStats();
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.updateUser({
        name: tempName,
        image: tempAvatar,
      });

      if (error) {
        setErrorMessage(error.message || "Failed to update profile.");
        setIsSubmitting(false);
        return;
      }

      if (data) {
        await refetch();
        setSuccessMessage("Your library card has been successfully updated.");
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setTempName(currentUser.name || "");
      setTempAvatar(currentUser.image || "");
    }
    setIsEditing(false);
    setErrorMessage("");
  };

  if (isPending) return <ShelfLoader />;
  if (!currentUser) return <MembersOnly onHome={() => router.push("/")} />;

  const createdAt = (currentUser as { createdAt?: Date | string }).createdAt;
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "Recently joined";

  const stats = [
    { label: "Books added", value: booksAddedCount !== null ? booksAddedCount : "...", icon: <BookOpen className="h-4 w-4 text-[#8c6d46] dark:text-[#d4a373]" /> },
    { label: "Active borrowings", value: borrowedCount !== null ? borrowedCount : "...", icon: <BookmarkCheck className="h-4 w-4 text-[#8c6d46] dark:text-[#d4a373]" /> },
  ];

  const previewName = isEditing ? tempName : currentUser.name;
  const previewImage = isEditing ? tempAvatar : currentUser.image;

  return (
    <main className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Page Title Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8c6d46]/10 dark:bg-[#d4a373]/10 px-3.5 py-1 text-xs font-semibold text-[#8c6d46] dark:text-[#d4a373] mb-3">
          <ShieldCheck className="h-3.5 w-3.5" /> Reader Membership Record
        </span>
        <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl text-[#2d2a26] dark:text-[#f0eae1]">
          Your library card
        </h1>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
          Manage your credentials, view borrowing statistics, and update how you appear across the BookNook archives.
        </p>
      </div>

      {/* Stacked Vintage Card Effect */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[6px] border border-stone-300 bg-stone-200/60 dark:border-stone-700 dark:bg-stone-800/40"
        />
        <div
          aria-hidden
          className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[6px] border border-stone-300 bg-stone-100 dark:border-stone-700 dark:bg-stone-800/80"
        />

        <section
          aria-label="Library card"
          className="relative rounded-[6px] border border-stone-300 bg-white px-6 pb-16 pt-6 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_22px_36px_-24px_rgba(0,0,0,.3)] dark:border-stone-700 dark:bg-stone-900 sm:px-10 sm:pt-8"
        >
          {/* Card Header Rule */}
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#b4473f]/70 pb-3">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2d2a26] dark:text-[#f0eae1]">
              <span>BookNook Archive System</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Joined {memberSince}
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div className="mt-8 grid gap-8 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-10 items-start">
              
              {/* Photo Column */}
              <div className="mx-auto w-40 sm:mx-0 sm:w-full">
                <Avatar className="aspect-[3/4] h-auto w-full rounded-[4px] border-2 border-stone-300 shadow-[0_12px_20px_-10px_rgba(0,0,0,.3)] dark:border-stone-600">
                  <AvatarImage
                    src={previewImage || undefined}
                    alt={`Photo of ${previewName || "member"}`}
                    className="rounded-[3px] object-cover"
                  />
                  <AvatarFallback
                    className="rounded-[3px] bg-[#3e342a] font-serif text-6xl font-semibold"
                    style={{ color: FOIL }}
                  >
                    {getInitial(previewName)}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-2 text-center text-xs text-stone-500 dark:text-stone-400 italic">
                  Official member ID photo
                </p>
              </div>

              {/* Details Column */}
              <div className="min-w-0 space-y-6">
                {isEditing ? (
                  <div className="space-y-4 bg-stone-50 dark:bg-stone-950/40 p-5 rounded-xl border border-stone-200 dark:border-stone-800">
                    <div className="space-y-1.5">
                      <Label htmlFor="profile-name" className={fieldLabel}>
                        Full name
                      </Label>
                      <Input
                        id="profile-name"
                        type="text"
                        required
                        autoFocus
                        autoComplete="name"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className={`${ruledInput} font-serif text-xl`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="profile-avatar" className={fieldLabel}>
                        Photo URL (Image link)
                      </Label>
                      <Input
                        id="profile-avatar"
                        type="url"
                        value={tempAvatar}
                        onChange={(e) => setTempAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className={ruledInput}
                      />
                    </div>

                    <div className="pt-2">
                      <dl>
                        <DetailRow label="Email Address">{currentUser.email}</DetailRow>
                      </dl>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="break-words font-serif text-3xl font-bold leading-tight text-[#2d2a26] dark:text-[#f0eae1]">
                      {currentUser.name}
                    </h2>
                    <dl className="mt-4 divide-y divide-stone-100 dark:divide-stone-800">
                      <DetailRow label="Email Address">{currentUser.email}</DetailRow>
                      <DetailRow label="Account Status">Active member reader</DetailRow>
                      <DetailRow label="Authorization">Standard Reader Card</DetailRow>
                    </dl>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Stats Grid */}
            <div className="mt-10 grid grid-cols-2 divide-x divide-dashed divide-stone-300 rounded-[6px] border-2 border-dashed border-stone-300 bg-stone-50/50 dark:divide-stone-700 dark:border-stone-700 dark:bg-stone-950/30">
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-5 text-center sm:px-6 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {s.icon}
                    <p className="font-serif text-3xl font-bold leading-none text-[#2d2a26] dark:text-[#f0eae1]">
                      {s.value}
                    </p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Feedback Banners */}
            <div aria-live="polite" className="empty:hidden">
              {errorMessage && (
                <p
                  role="alert"
                  className="mt-6 rounded-lg bg-red-50 p-3 text-sm font-medium text-[#9b2f2a] border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 dark:text-[#e58a84]"
                >
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-[#2f4a3c] border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-[#8fbf9f]">
                  <Check className="h-4 w-4 shrink-0" />
                  <p>{successMessage}</p>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="h-11 cursor-pointer rounded-[6px] px-5 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 cursor-pointer gap-2 rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md hover:bg-[#3e342a]/90 disabled:opacity-50 dark:bg-[#d4a373] dark:text-[#181614] dark:hover:bg-[#d4a373]/90"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Saving changes..." : "Save changes"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setTempName(currentUser.name || "");
                    setTempAvatar(currentUser.image || "");
                    setSuccessMessage("");
                    setIsEditing(true);
                  }}
                  className="h-11 cursor-pointer gap-2 rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md hover:bg-[#3e342a]/90 dark:bg-[#d4a373] dark:text-[#181614] dark:hover:bg-[#d4a373]/90"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit card
                </Button>
              )}
            </div>
          </form>

          {/* Library Card Punch Hole */}
          <span
            aria-hidden
            className="absolute bottom-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-stone-300 bg-stone-50 shadow-inner dark:border-stone-700 dark:bg-stone-950"
          />
        </section>
      </div>
    </main>
  );
}