"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const FOIL = "#e9d9ab";

const LOADER_SPINES = [
  { h: 52, c: "#6b4f33" },
  { h: 40, c: "#8c6d46" },
  { h: 56, c: "#52402d" },
  { h: 46, c: "#a07a4f" },
  { h: 54, c: "#7a5c3a" },
  { h: 42, c: "#8c6d46" },
];

const ruledInput =
  "h-10 rounded-none border-0 border-b border-stone-300 bg-transparent px-0 text-[15px] text-[#2d2a26] shadow-none placeholder:text-stone-400 focus-visible:border-[#8c6d46] focus-visible:shadow-[0_1px_0_0_#8c6d46] focus-visible:ring-0 dark:border-stone-600 dark:bg-transparent dark:text-[#f0eae1] dark:placeholder:text-stone-500 dark:focus-visible:border-[#d4a373] dark:focus-visible:shadow-[0_1px_0_0_#d4a373]";

const fieldLabel = "text-sm font-normal text-stone-500 dark:text-stone-400";

/* ───────── gates ───────── */

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
          className="mt-7 h-11 cursor-pointer rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md hover:bg-[#3e342a] hover:brightness-125 dark:bg-[#d4a373] dark:text-[#181614] dark:hover:bg-[#d4a373]"
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

/* ───────── small pieces ───────── */

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-2 py-2.5">
      <dt className="shrink-0 text-sm text-stone-500 dark:text-stone-400">{label}</dt>
      <span
        aria-hidden
        className="min-w-4 flex-1 -translate-y-[3px] border-b border-dotted border-stone-300 dark:border-stone-600"
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

  // Dynamic state for real database counts
  const [booksAddedCount, setBooksAddedCount] = useState<number | null>(null);
  const [borrowedCount, setBorrowedCount] = useState<number | null>(null);

  const getInitial = (name?: string | null) =>
    name ? name.charAt(0).toUpperCase() : "U";

  // Sync state and fetch real stats when user session is available
  useEffect(() => {
    if (currentUser) {
      setTempName(currentUser.name || "");
      setTempAvatar(currentUser.image || "");

      async function fetchUserStats() {
        if (!currentUser?.email) return;

        try {
          // Fetch books added by user
          const booksRes = await fetch(`http://localhost:8000/my-books/${currentUser.email}`, {
            cache: "no-store",
          });
          if (booksRes.ok) {
            const booksData = await booksRes.json();
            setBooksAddedCount(Array.isArray(booksData) ? booksData.length : 0);
          }

          // Fetch active borrows by user
          const borrowsRes = await fetch(`http://localhost:8000/my-borrows/${currentUser.email}`, {
            cache: "no-store",
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
        setSuccessMessage("Your card was updated.");
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

  // Dynamic stats array with 2 columns
  const stats = [
    { label: "Books added", value: booksAddedCount !== null ? booksAddedCount : "..." },
    { label: "Active borrowings", value: borrowedCount !== null ? borrowedCount : "..." },
  ];

  const previewName = isEditing ? tempName : currentUser.name;
  const previewImage = isEditing ? tempAvatar : currentUser.image;

  return (
    <main className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#f4efe6] dark:bg-[#151312] border border-[#e8e2d9] dark:border-[#2d2924] rounded-2xl transition-colors duration-300">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Your library card
        </h1>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
          This is how you appear to other members when you add and lend books.
        </p>

        {/* the card, sitting on top of the rest of the catalog drawer */}
        <div className="relative mt-10">
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3 translate-y-3 rounded-[4px] border border-stone-300 bg-stone-100 dark:border-stone-700 dark:bg-stone-800"
          />
          <div
            aria-hidden
            className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[4px] border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800/80"
          />

          <section
            aria-label="Library card"
            className="relative rounded-[4px] border border-stone-300 bg-white px-6 pb-16 pt-4 shadow-[0_2px_0_rgba(0,0,0,.04),0_22px_36px_-24px_rgba(0,0,0,.4)] dark:border-stone-700 dark:bg-stone-900 sm:px-8"
          >
            {/* header rule */}
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#b4473f]/70 pb-2">
              <p className="font-serif text-lg font-semibold">BookNook Library</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Joined {memberSince}
              </p>
            </div>

            <form onSubmit={handleSave}>
              <div className="mt-6 grid gap-6 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-8">
                {/* photo, like the photo box on a real card */}
                <div className="mx-auto w-36 sm:mx-0 sm:w-full">
                  <Avatar className="aspect-[3/4] h-auto w-full rounded-[3px] border border-stone-300 shadow-[0_10px_16px_-10px_rgba(0,0,0,.45)] dark:border-stone-600">
                    <AvatarImage
                      src={previewImage || undefined}
                      alt={`Photo of ${previewName || "member"}`}
                      className="rounded-[3px] object-cover"
                    />
                    <AvatarFallback
                      className="rounded-[3px] bg-[#3e342a] font-serif text-5xl font-semibold"
                      style={{ color: FOIL }}
                    >
                      {getInitial(previewName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mt-2 text-center text-xs text-stone-500 dark:text-stone-400">
                    Member photo
                  </p>
                </div>

                {/* details */}
                <div className="min-w-0">
                  {isEditing ? (
                    <div className="space-y-5">
                      <div className="space-y-1">
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

                      <div className="space-y-1">
                        <Label htmlFor="profile-avatar" className={fieldLabel}>
                          Photo URL
                        </Label>
                        <Input
                          id="profile-avatar"
                          type="url"
                          value={tempAvatar}
                          onChange={(e) => setTempAvatar(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className={ruledInput}
                        />
                      </div>

                      <dl>
                        <DetailRow label="Email">{currentUser.email}</DetailRow>
                      </dl>
                    </div>
                  ) : (
                    <>
                      <h2 className="break-words font-serif text-3xl font-semibold leading-tight">
                        {currentUser.name}
                      </h2>
                      <dl className="mt-3">
                        <DetailRow label="Email">{currentUser.email}</DetailRow>
                        <DetailRow label="Account status">Active reader</DetailRow>
                        <DetailRow label="Member since">{memberSince}</DetailRow>
                      </dl>
                    </>
                  )}
                </div>
              </div>

              {/* due-slip activity with 2 dynamic columns */}
              <div className="mt-8 grid grid-cols-2 divide-x divide-dashed divide-stone-300 rounded-[4px] border-2 border-dashed border-stone-300 dark:divide-stone-700 dark:border-stone-700">
                {stats.map((s) => (
                  <div key={s.label} className="px-3 py-4 text-center sm:px-5">
                    <p className="font-serif text-2xl font-semibold leading-none sm:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 sm:text-sm">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* messages + actions */}
              <div aria-live="polite" className="empty:hidden">
                {errorMessage && (
                  <p
                    role="alert"
                    className="mt-5 text-sm font-medium text-[#9b2f2a] dark:text-[#e58a84]"
                  >
                    {errorMessage}
                  </p>
                )}
                {successMessage && (
                  <p className="mt-5 flex items-center gap-2 text-sm font-medium text-[#2f4a3c] dark:text-[#8fbf9f]">
                    <Check className="h-4 w-4 shrink-0" />
                    {successMessage}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="h-11 cursor-pointer rounded-[6px] px-4 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 cursor-pointer gap-2 rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md hover:bg-[#3e342a] hover:brightness-125 disabled:opacity-50 dark:bg-[#d4a373] dark:text-[#181614] dark:hover:bg-[#d4a373]"
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Saving" : "Save changes"}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      setSuccessMessage("");
                      setIsEditing(true);
                    }}
                    className="h-11 cursor-pointer gap-2 rounded-[6px] bg-[#3e342a] px-6 text-sm font-semibold text-[#faf8f5] shadow-md hover:bg-[#3e342a] hover:brightness-125 dark:bg-[#d4a373] dark:text-[#181614] dark:hover:bg-[#d4a373]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit card
                  </Button>
                )}
              </div>
            </form>

            {/* punch hole */}
            <span
              aria-hidden
              className="absolute bottom-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-stone-300 bg-stone-50 shadow-inner dark:border-stone-700 dark:bg-stone-950"
            />
          </section>
        </div>
      </div>
    </main>
  );
}