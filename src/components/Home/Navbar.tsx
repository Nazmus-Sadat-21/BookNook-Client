"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  PlusCircle,
  Library,
  BookmarkCheck,
  Home,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

import AuthDialog from '../../app/(auth)/sign-in-up/page';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  // Controlled state for AuthDialog
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // State for success toast message
  const [toast, setToast] = useState<string | null>(null);

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const user = session?.user;

  // Dynamic document title update based on current route pathname
  useEffect(() => {
    switch (pathname) {
      case "/":
        document.title = "BookNook | Home";
        break;
      case "/books":
        document.title = "BookNook | All Books";
        break;
      case "/add-book":
        document.title = "BookNook | Add Book";
        break;
      case "/my-books":
        document.title = "BookNook | My Books";
        break;
      case "/my-borrows":
        document.title = "BookNook | My Borrows";
        break;
      case "/profile":
        document.title = "BookNook | My Profile";
        break;
      default:
        if (pathname.startsWith("/books/")) {
          document.title = "BookNook | Book Details";
        } else {
          document.title = "BookNook";
        }
        break;
    }
  }, [pathname]);

  const getInitial = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsProfileDropdownOpen(false);
          setIsMobileMenuOpen(false);
          
          // Show elegant logout success toast message
          setToast("Successfully logged out. Safe travels through your books!");
          setTimeout(() => setToast(null), 4500);

          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const isActive = (path: string) => pathname === path;

  const getLinkClasses = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-[#e8e2d9] dark:bg-[#2d2924] text-[#2d2a26] dark:text-[#f0eae1] font-semibold shadow-sm border border-stone-300/50 dark:border-stone-700/50"
        : "text-[#625b52] dark:text-[#a89f91] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] hover:bg-[#f2ede4] dark:hover:bg-[#23201d]"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5]/85 dark:bg-[#181614]/85 backdrop-blur-md transition-colors duration-300 shadow-sm">
      
      {/* Beautiful Toast Notification Banner */}
      {toast && (
        <div
          role="status"
          className="fixed inset-x-4 top-5 z-[100] mx-auto flex max-w-md items-center gap-3 rounded-xl bg-[#3e342a] px-5 py-4 text-sm text-[#faf8f5] shadow-2xl border border-[#8c6d46]/40 dark:bg-[#d4a373] dark:text-[#181614] transition-all animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#d4a373] dark:text-[#3e342a]" />
          <p className="font-medium">{toast}</p>
        </div>
      )}

      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ───────── Logo & Beautified Heading ───────── */}
        <Link
          href="/"
          aria-label="BookNook, home"
          className="group flex items-center gap-3.5 rounded-xl py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#8c6d46]"
        >
          {/* Logo badge with gold-foil book and red bookmark ribbon */}
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#5a4636] via-[#3e342a] to-[#2a221b] text-[#e9d9ab] shadow-[0_8px_16px_-6px_rgba(62,52,42,0.7)] ring-1 ring-[#d4a373]/40 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none dark:from-[#e8bd92] dark:via-[#d4a373] dark:to-[#b9855a] dark:text-[#2a221b] dark:ring-[#181614]/20">
            <span
              aria-hidden
              className="absolute inset-[3px] rounded-[11px] border border-[#e9d9ab]/30 dark:border-[#2a221b]/25"
            />
            <BookOpen className="relative h-[22px] w-[22px]" strokeWidth={1.6} />
            <span
              aria-hidden
              className="absolute -top-[3px] right-2.5 h-4 w-2.5 bg-[#b4473f] shadow-sm [clip-path:polygon(0_0,100%_0,100%_100%,50%_72%,0_100%)]"
            />
          </span>

          {/* Heading Wordmark */}
          <span className="flex flex-col justify-center">
            <span className="font-serif text-[28px] leading-none tracking-[-0.025em] text-[#2d2a26] dark:text-[#f0eae1]">
              <span className="font-bold">Book</span>
              <span className="relative ml-[2px] inline-block bg-gradient-to-r from-[#8c6d46] via-[#a0693a] to-[#b4473f] bg-clip-text pr-1 font-medium italic text-transparent dark:from-[#d4a373] dark:via-[#e8bd92] dark:to-[#f3d2a8]">
                Nook
                {/* Hand-drawn swash underline accent */}
                <svg
                  aria-hidden
                  viewBox="0 0 60 6"
                  preserveAspectRatio="none"
                  className="absolute -bottom-[7px] left-0 h-[6px] w-full text-[#b4473f] dark:text-[#d4a373]"
                >
                  <path
                    d="M1 4.6C13 1.2 31 1 59 3.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link href="/" className={getLinkClasses("/")}>
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link href="/books" className={getLinkClasses("/books")}>
            <Library className="h-4 w-4" /> All Books
          </Link>

          {isLoggedIn && (
            <>
              <Link href="/add-book" className={getLinkClasses("/add-book")}>
                <PlusCircle className="h-4 w-4" /> Add Book
              </Link>
              <Link href="/my-books" className={getLinkClasses("/my-books")}>
                <BookOpen className="h-4 w-4" /> My Books
              </Link>
              <Link href="/my-borrows" className={getLinkClasses("/my-borrows")}>
                <BookmarkCheck className="h-4 w-4" /> My Borrows
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#f2ede4] dark:bg-[#23201d] text-[#625b52] dark:text-[#a89f91] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition cursor-pointer shadow-sm"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-[#d4a373]" />
            ) : (
              <Moon className="h-4 w-4 text-[#8c6d46]" />
            )}
          </button>

          {isPending ? (
            <div className="h-10 w-24 animate-pulse bg-[#e8e2d9] dark:bg-[#2d2924] rounded-xl" />
          ) : isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center focus:outline-none rounded-full ring-2 ring-[#8c6d46]/40 dark:ring-[#d4a373]/40 cursor-pointer overflow-hidden transition hover:ring-opacity-80"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    height={40}
                    width={40}
                    className="h-10 w-10 rounded-full object-cover border border-[#e8e2d9] dark:border-[#2d2924]"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#8c6d46] text-[#faf8f5] dark:bg-[#d4a373] dark:text-[#181614] flex items-center justify-center font-serif font-bold text-sm">
                    {getInitial(user.name)}
                  </div>
                )}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#1d1a17] p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2.5 border-b border-[#e8e2d9] dark:border-[#2d2924] mb-1.5">
                    <p className="text-sm font-semibold text-[#2d2a26] dark:text-[#f0eae1] truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#8c8275] dark:text-[#a89f91] truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#625b52] dark:text-[#a89f91] hover:bg-[#f2ede4] dark:hover:bg-[#272320] transition"
                  >
                    <User className="h-4 w-4 text-[#8c6d46] dark:text-[#d4a373]" /> My Profile Card
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition mt-1 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setAuthMode("login");
                  setIsAuthOpen(true);
                }}
                className="px-4 py-2 text-sm font-medium text-[#625b52] dark:text-[#a89f91] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition flex items-center gap-1.5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
              >
                <LogIn className="h-4 w-4" /> Login
              </button>
              <button
                onClick={() => {
                  setAuthMode("register");
                  setIsAuthOpen(true);
                }}
                className="px-4.5 py-2 text-sm font-medium rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] hover:opacity-95 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" /> Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#f2ede4] dark:bg-[#23201d] text-[#625b52] dark:text-[#a89f91] cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-[#d4a373]" />
            ) : (
              <Moon className="h-4 w-4 text-[#8c6d46]" />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] text-[#2d2a26] dark:text-[#f0eae1] cursor-pointer bg-[#f2ede4] dark:bg-[#23201d]"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#181614] px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2">
          {isLoggedIn && user && (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#f2ede4] dark:bg-[#23201d] border border-[#e8e2d9] dark:border-[#2d2924]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Avatar"}
                  height={44}
                  width={44}
                  className="h-11 w-11 rounded-full object-cover border border-[#e8e2d9] dark:border-[#2d2924]"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-[#8c6d46] text-[#faf8f5] dark:bg-[#d4a373] dark:text-[#181614] flex items-center justify-center font-serif font-bold text-base">
                  {getInitial(user.name)}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-[#2d2a26] dark:text-[#f0eae1] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[#8c8275] dark:text-[#a89f91] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1.5 text-sm">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getLinkClasses("/")}
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              href="/books"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getLinkClasses("/books")}
            >
              <Library className="h-4 w-4" /> All Books
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/add-book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getLinkClasses("/add-book")}
                >
                  <PlusCircle className="h-4 w-4" /> Add Book
                </Link>
                <Link
                  href="/my-books"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getLinkClasses("/my-books")}
                >
                  <BookOpen className="h-4 w-4" /> My Books
                </Link>
                <Link
                  href="/my-borrows"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getLinkClasses("/my-borrows")}
                >
                  <BookmarkCheck className="h-4 w-4" /> My Borrows
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getLinkClasses("/profile")}
                >
                  <User className="h-4 w-4" /> My Profile Card
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-[#e8e2d9] dark:border-[#2d2924] flex flex-col gap-2.5">
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-3 text-center text-sm pt-1">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 border border-[#e8e2d9] dark:border-[#2d2924] rounded-xl text-[#2d2a26] dark:text-[#f0eae1] font-medium text-sm flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] rounded-xl font-medium text-sm flex items-center justify-center cursor-pointer shadow-sm transition"
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-medium transition cursor-pointer border border-red-200 dark:border-red-900/40"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
}