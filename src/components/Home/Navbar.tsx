"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
// import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname(); // Get current route path
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Sync theme with HTML document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const mockUser = {
    name: "Alex Johnson",
    email: "alex@booknook.lib",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
  };

  // Helper function to check if link is active
  const isActive = (path: string) => pathname === path;

  // Reusable style classes for links (Active vs Inactive)
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

          {/* Private Routes (Logged In Only) */}
          {isLoggedIn && (
            <>
              <Link href="/add-book" className={getLinkClasses("/add-book")}>
                <PlusCircle className="h-4 w-4" /> Add Book
              </Link>
              <Link href="/my-books" className={getLinkClasses("/my-books")}>
                <BookOpen className="h-4 w-4" /> My Books
              </Link>
              <Link
                href="/my-borrows"
                className={getLinkClasses("/my-borrows")}
              >
                <BookmarkCheck className="h-4 w-4" /> My Borrows
              </Link>
            </>
          )}
        </nav>

        {/* Actions (Theme Toggle & Auth) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg border border-[#e8e2d9] dark:border-[#2d2924] bg-[#f2ede4] dark:bg-[#23201d] text-[#625b52] dark:text-[#a89f91] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-[#d4a373]" />
            ) : (
              <Moon className="h-4 w-4 text-[#8c6d46]" />
            )}
          </button>

          {/* Simulation Auth Switcher */}
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="text-xs bg-[#e8e2d9] dark:bg-[#2d2924] text-[#625b52] dark:text-[#a89f91] px-2 py-1 rounded hover:opacity-80 transition"
          >
            {isLoggedIn ? "State: Logged In" : "State: Logged Out"}
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center focus:outline-none rounded-full ring-2 ring-[#8c6d46]/30 dark:ring-[#d4a373]/30"
              >
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="h-9 w-9 rounded-full object-cover border border-[#e8e2d9] dark:border-[#2d2924]"
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#201d1a] p-2 shadow-lg">
                  <div className="px-3 py-2 border-b border-[#e8e2d9] dark:border-[#2d2924] mb-1">
                    <p className="text-sm font-semibold text-[#2d2a26] dark:text-[#f0eae1]">
                      {mockUser.name}
                    </p>
                    <p className="text-xs text-[#8c8275] dark:text-[#8a8175] truncate">
                      {mockUser.email}
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
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition mt-1"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm font-medium text-[#625b52] dark:text-[#a89f91] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition"
              >
                <LogIn className="h-4 w-4 inline mr-1" /> Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-medium rounded-lg bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] hover:opacity-90 shadow-sm transition"
              >
                <UserPlus className="h-4 w-4 inline mr-1" /> Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg border border-[#e8e2d9] dark:border-[#2d2924] bg-[#f2ede4] dark:bg-[#23201d] text-[#625b52] dark:text-[#a89f91]"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-[#d4a373]" />
            ) : (
              <Moon className="h-4 w-4 text-[#8c6d46]" />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-[#2d2a26] dark:text-[#f0eae1]"
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
              </>
            )}
          </div>

          <div className="pt-3 border-t border-[#e8e2d9] dark:border-[#2d2924] flex flex-col gap-2">
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="text-xs bg-[#e8e2d9] dark:bg-[#2d2924] text-[#625b52] dark:text-[#a89f91] px-2 py-1.5 rounded"
            >
              {isLoggedIn
                ? "Simulate: Switch to Logged Out"
                : "Simulate: Switch to Logged In"}
            </button>

            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2 text-center text-sm pt-1">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 border border-[#e8e2d9] dark:border-[#2d2924] rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] rounded-lg font-medium"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-left px-3 py-2 text-sm text-red-600 dark:text-red-400"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
