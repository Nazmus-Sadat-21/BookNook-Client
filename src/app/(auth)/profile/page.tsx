"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, BookOpen, BookmarkCheck, History, User, ShieldCheck, ScrollText } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ruledInput =
  "h-12 rounded-none border-0 border-b-2 border-[#8c6d46]/60 bg-transparent px-3 text-base text-[#2d2a26] font-mono shadow-none placeholder:text-stone-400 focus-visible:border-[#b4473f] focus-visible:ring-0 dark:border-[#d4a373]/60 dark:text-[#f0eae1] dark:focus-visible:border-[#e8bd92]";

const fieldLabel = "text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400";

function DeskLoader() {
  return (
    <div role="status" className="flex min-h-[70vh] flex-col items-center justify-center px-4 bg-[#f4f1ea] dark:bg-[#12100e]">
      <div className="flex items-end gap-1.5 mb-3">
        {[48, 36, 54, 42, 50, 38].map((h, i) => (
          <span
            key={i}
            className="w-3 rounded-t bg-[#5a4636] animate-pulse"
            style={{ height: h, animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <div className="h-2 w-48 rounded bg-[#3e342a] dark:bg-[#d4a373]" />
      <p className="mt-4 font-serif text-sm tracking-widest text-[#3e342a] dark:text-[#f0eae1] uppercase italic">
        Unlocking archive ledger...
      </p>
    </div>
  );
}

function MembersOnly({ onHome }: { onHome: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md rounded-2xl border-4 border-double border-[#8c6d46] bg-[#faf8f5] dark:bg-[#1a1715] p-6 sm:p-8 shadow-2xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8c6d46]/10 text-[#8c6d46] dark:text-[#d4a373]">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2d2a26] dark:text-[#f0eae1]">
          Restricted Stack Access
        </h2>
        <p className="mt-2 text-xs font-mono text-stone-600 dark:text-stone-400 leading-relaxed">
          The physical borrower registration card is locked to authorized members. Please sign in to unlock your ledger.
        </p>
        <Button
          type="button"
          onClick={onHome}
          className="mt-6 h-11 w-full rounded-xl bg-[#3e342a] text-xs font-mono uppercase tracking-widest text-[#faf8f5] hover:bg-[#3e342a]/90 dark:bg-[#d4a373] dark:text-[#181614] shadow-md cursor-pointer"
        >
          Return to Library Lobby
        </Button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const currentUser = session?.user;

  const [activeTab, setActiveTab] = useState<"card" | "ledger">("card");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempAvatar, setTempAvatar] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [booksAddedCount, setBooksAddedCount] = useState<number | null>(null);
  const [borrowedCount, setBorrowedCount] = useState<number | null>(null);

  const getInitial = (name?: string | null) => (name ? name.charAt(0).toUpperCase() : "U");

  useEffect(() => {
    if (currentUser?.email) {
      async function fetchStats() {
        try {
          const { data: tokenData } = await authClient.token();
          const token = tokenData?.token;

          const [booksRes, borrowsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/my-books/${currentUser?.email}`, {
              headers: { authorization: `Bearer ${token}` }
            }),
            fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/my-borrows/${currentUser?.email}`, {
              headers: { authorization: `Bearer ${token}` }
            })
          ]);

          if (booksRes.ok) {
            const data = await booksRes.json();
            setBooksAddedCount(Array.isArray(data) ? data.length : 0);
          }
          if (borrowsRes.ok) {
            const data = await borrowsRes.json();
            setBorrowedCount(Array.isArray(data) ? data.length : 0);
          }
        } catch (err) {
          console.error("Failed to load user stats", err);
        }
      }
      fetchStats();
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
        setErrorMessage(error.message || "Failed to update ledger records.");
        setIsSubmitting(false);
        return;
      }

      if (data) {
        await refetch();
        setSuccessMessage("Changes stamped into ledger successfully.");
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) return <DeskLoader />;
  if (!currentUser) return <MembersOnly onHome={() => router.push("/")} />;

  const createdAt = (currentUser as { createdAt?: Date | string }).createdAt;
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Recently cataloged";

  const previewName = isEditing ? tempName : currentUser.name;
  const previewImage = isEditing ? tempAvatar : currentUser.image;

  return (
    <main className="w-full py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-x-hidden">
      
      {/* Antique Ledger Header Banner */}
      <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#3e342a] via-[#2f2720] to-[#1c1916] px-5 sm:px-8 py-6 sm:py-8 pr-12 sm:pr-16 text-[#faf8f5] shadow-xl border-l-8 border-[#b4473f]">
        <div className="absolute top-0 right-6 sm:right-10 h-10 sm:h-12 w-4 sm:w-5 bg-[#b4473f] shadow-lg [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#d4a373] font-semibold flex items-center gap-1.5">
              <ScrollText className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" /> BookNook Master Archives
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight mt-1 text-[#f0eae1]">
              Borrower Ledger & Credentials
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 font-mono text-[11px] text-[#e9d9ab] w-fit">
            <span>Registry ID: #{currentUser?.id ? `${currentUser.id.slice(0, 5).toUpperCase()}...` : "BN-8821"}</span>
          </div>
        </div>
      </div>

      {/* Main Ledger Book Container */}
      <div className="relative rounded-2xl sm:rounded-3xl border-2 border-[#8c6d46]/40 dark:border-[#d4a373]/30 bg-[#fbf9f5] dark:bg-[#161412] p-4 sm:p-10 shadow-xl sm:shadow-2xl">
        
        {/* Book Page Switcher Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 border-b-2 border-[#3e342a]/20 dark:border-stone-800 pb-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab("card")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer ${
              activeTab === "card"
                ? "bg-[#3e342a] text-[#faf8f5] dark:bg-[#d4a373] dark:text-[#181614] font-bold shadow-md"
                : "bg-stone-200/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-300/80"
            }`}
          >
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Borrower Identity
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer ${
              activeTab === "ledger"
                ? "bg-[#3e342a] text-[#faf8f5] dark:bg-[#d4a373] dark:text-[#181614] font-bold shadow-md"
                : "bg-stone-200/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-300/80"
            }`}
          >
            <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Circulation Ledger
          </button>
        </div>

        {/* Tab 1: Borrower Identity Form/Card */}
        {activeTab === "card" && (
          <form onSubmit={handleSave} className="mt-6 sm:mt-8 space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-[13rem_minmax(0,1fr)] items-start">
              
              {/* Avatar Box with Dotted Red Ink Stamp Overlay */}
              <div className="relative mx-auto w-36 sm:w-44">
                <Avatar className="aspect-[3/4] h-auto w-full rounded-md border-4 border-stone-300 dark:border-stone-700 shadow-xl object-cover">
                  <AvatarImage src={previewImage || undefined} alt="Member avatar" className="object-cover rounded-sm" />
                  <AvatarFallback className="rounded-sm bg-[#3e342a] font-serif text-4xl sm:text-5xl font-bold text-[#e9d9ab]">
                    {getInitial(previewName)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Official Dotted Red Ink Stamp */}
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 h-16 w-16 sm:h-20 sm:w-20 rounded-full border-[3px] border-dotted border-[#80231e] bg-[#9b2f2a]/15 backdrop-blur-md flex items-center justify-center transform -rotate-12 pointer-events-none shadow-lg z-10">
                  <span className="font-mono text-[8px] sm:text-[10px] font-black tracking-tighter uppercase text-[#9b2f2a] dark:text-[#e58a84] text-center leading-tight drop-shadow-sm">
                    APPROVED<br />ARCHIVE
                  </span>
                </div>
              </div>

              {/* Details & Edit Fields */}
              <div className="space-y-4 sm:space-y-6 w-full min-w-0">
                {isEditing ? (
                  <div className="space-y-4 p-4 sm:p-6 rounded-2xl bg-[#f2ede4] dark:bg-[#1a1715] border border-stone-300 dark:border-stone-800">
                    <div>
                      <Label className={fieldLabel}>Borrower Full Name</Label>
                      <Input
                        type="text"
                        required
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className={ruledInput}
                      />
                    </div>
                    <div>
                      <Label className={fieldLabel}>Photo URL Reference</Label>
                      <Input
                        type="url"
                        value={tempAvatar}
                        onChange={(e) => setTempAvatar(e.target.value)}
                        placeholder="https://..."
                        className={ruledInput}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 font-mono text-sm">
                    <div className="border-b border-stone-200 dark:border-stone-800 pb-3 truncate">
                      <span className={fieldLabel}>Full Legal Name</span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-[#2d2a26] dark:text-[#f0eae1] mt-1 truncate">
                        {currentUser.name}
                      </p>
                    </div>
                    <div className="border-b border-stone-200 dark:border-stone-800 pb-3 truncate">
                      <span className={fieldLabel}>Registered Email</span>
                      <p className="text-stone-700 dark:text-stone-300 mt-1 truncate">{currentUser.email}</p>
                    </div>
                    <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                      <span className={fieldLabel}>Member Since Date</span>
                      <p className="text-stone-700 dark:text-stone-300 mt-1">{memberSince}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            {errorMessage && (
              <p className="rounded-xl bg-red-50 p-3 font-mono text-xs text-red-600 border border-red-200">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="rounded-xl bg-emerald-50 p-3 font-mono text-xs text-emerald-700 border border-emerald-200 flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0" /> {successMessage}
              </p>
            )}

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-stone-200 dark:border-stone-800">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="font-mono text-xs uppercase cursor-pointer h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#3e342a] text-[#faf8f5] font-mono text-xs uppercase tracking-wider rounded-xl dark:bg-[#d4a373] dark:text-[#181614] h-11 px-6 shadow cursor-pointer"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Stamp
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setTempName(currentUser.name || "");
                    setTempAvatar(currentUser.image || "");
                    setIsEditing(true);
                  }}
                  className="bg-[#3e342a] text-[#faf8f5] font-mono text-xs uppercase tracking-wider rounded-xl dark:bg-[#d4a373] dark:text-[#181614] h-11 px-6 shadow cursor-pointer w-full sm:w-auto"
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit Identity Card
                </Button>
              )}
            </div>
          </form>
        )}

        {/* Tab 2: Circulation Ledger */}
        {activeTab === "ledger" && (
          <div className="mt-6 sm:mt-8 space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-2">
              <p className="font-mono text-xs text-stone-500 uppercase tracking-widest">
                Official Circulation Summary & Activity Log
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-[#8c6d46]/40 bg-[#f2ede4]/50 dark:bg-[#12100e] flex items-center gap-4 shadow-sm">
                <div className="p-3 sm:p-4 rounded-xl bg-[#8c6d46]/10 text-[#8c6d46] dark:text-[#d4a373] shrink-0">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                    {booksAddedCount !== null ? booksAddedCount : "..."}
                  </span>
                  <span className="block font-mono text-xs uppercase tracking-wider text-stone-500 mt-0.5">
                    Books Contributed
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-[#8c6d46]/40 bg-[#f2ede4]/50 dark:bg-[#12100e] flex items-center gap-4 shadow-sm">
                <div className="p-3 sm:p-4 rounded-xl bg-[#8c6d46]/10 text-[#8c6d46] dark:text-[#d4a373] shrink-0">
                  <BookmarkCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                    {borrowedCount !== null ? borrowedCount : "..."}
                  </span>
                  <span className="block font-mono text-xs uppercase tracking-wider text-stone-500 mt-0.5">
                    Active Borrows
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}