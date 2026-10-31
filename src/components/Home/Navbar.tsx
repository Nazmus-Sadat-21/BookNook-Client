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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import AuthDialog from "./../../app/(auth)/AuthDialog";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const user = session?.user;

  // Helper function to get the first character of the username safely
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
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const isActive = (path: string) => pathname === path;

  const getLinkClasses = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-[#e8e2d9] dark:bg-[#2d2924] text-[#2d2a26] dark:text-[#f0eae1] font-semibold shadow-sm"
        : "text-[#625b52] dark:text-[#a89f91] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] hover:bg-[#f2ede4] dark:hover:bg-[#23201d]"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5]/90 dark:bg-[#181614]/90 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1] font-serif">
            Book<span className="text-[#8c6d46] dark:text-[#d4a373]">Nook</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
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
            className="p-2 rounded-lg border border-[#e8e2d9] dark:border-[#2d2924] bg-[#f2ede4] dark:bg-[#23201d] text-[#625b52] dark:text-[#a89f91] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-[#d4a373]" />
            ) : (
              <Moon className="h-4 w-4 text-[#8c6d46]" />
            )}
          </button>

          {isPending ? (
            <div className="h-9 w-20 animate-pulse bg-[#e8e2d9] dark:bg-[#2d2924] rounded-lg" />
          ) : isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center focus:outline-none rounded-full ring-2 ring-[#8c6d46]/30 dark:ring-[#d4a373]/30 cursor-pointer overflow-hidden"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    height={40}
                    width={40}
                    className="h-9 w-9 rounded-full object-cover border border-[#e8e2d9] dark:border-[#2d2924]"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-[#8c6d46] text-[#faf8f5] dark:bg-[#d4a373] dark:text-[#181614] flex items-center justify-center font-serif font-bold text-sm">
                    {getInitial(user.name)}
                  </div>
                )}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#201d1a] p-2 shadow-lg z-50">
                  <div className="px-3 py-2 border-b border-[#e8e2d9] dark:border-[#2d2924] mb-1">
                    <p className="text-sm font-semibold text-[#2d2a26] dark:text-[#f0eae1]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#8c8275] dark:text-[#8a8175] truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#625b52] dark:text-[#a89f91] hover:bg-[#f2ede4] dark:hover:bg-[#2b2723] transition"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition mt-1 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AuthDialog
                mode="login"
                triggerButton={
                  <>
                    <LogIn className="h-4 w-4" /> Login
                  </>
                }
                triggerClassName="px-3 py-1.5 text-sm font-medium text-[#625b52] dark:text-[#a89f91] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition flex items-center gap-1 rounded-lg cursor-pointer"
              />
              <AuthDialog
                mode="register"
                triggerButton={
                  <>
                    <UserPlus className="h-4 w-4" /> Register
                  </>
                }
                triggerClassName="px-4 py-1.5 text-sm font-medium rounded-lg bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] hover:opacity-90 shadow-sm transition flex items-center gap-1 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Mobile Toggle Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg border border-[#e8e2d9] dark:border-[#2d2924] bg-[#f2ede4] dark:bg-[#23201d] text-[#625b52] dark:text-[#a89f91] cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-[#d4a373]" />
            ) : (
              <Moon className="h-4 w-4 text-[#8c6d46]" />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-[#2d2a26] dark:text-[#f0eae1] cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#181614] px-4 pt-3 pb-6 space-y-3">
          {isLoggedIn && user && (
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-[#f2ede4] dark:bg-[#23201d] border border-[#e8e2d9] dark:border-[#2d2924]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Avatar"}
                  height={40}
                  width={40}
                  className="h-10 w-10 rounded-full object-cover border border-[#e8e2d9] dark:border-[#2d2924]"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#8c6d46] text-[#faf8f5] dark:bg-[#d4a373] dark:text-[#181614] flex items-center justify-center font-serif font-bold text-base">
                  {getInitial(user.name)}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-[#2d2a26] dark:text-[#f0eae1] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[#8c8275] dark:text-[#8a8175] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1 text-sm">
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
                  <User className="h-4 w-4" /> My Profile
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-[#e8e2d9] dark:border-[#2d2924] flex flex-col gap-2">
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2 text-center text-sm pt-1">
                <AuthDialog
                  mode="login"
                  triggerButton="Login"
                  triggerClassName="w-full py-2 border border-[#e8e2d9] dark:border-[#2d2924] rounded-lg text-[#2d2a26] dark:text-[#f0eae1] font-medium text-sm flex items-center justify-center cursor-pointer"
                />
                <AuthDialog
                  mode="register"
                  triggerButton="Register"
                  triggerClassName="w-full py-2 bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] rounded-lg font-medium text-sm flex items-center justify-center cursor-pointer"
                />
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-medium transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}