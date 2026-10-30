import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e8e2d9] dark:border-[#2d2924] bg-[#f4efe6] dark:bg-[#131110] text-[#625b52] dark:text-[#a89f91] text-sm transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Slogan */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614]">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1] font-serif">
                Book<span className="text-[#8c6d46] dark:text-[#d4a373]">Nook</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-[#736a5e] dark:text-[#8a8175]">
              A warm sanctuary for book lovers. Explore community collections, borrow books for cozy evenings, and keep literature accessible to everyone.
            </p>
            {/* Social Icons using Inline SVGs for guaranteed reliability */}
            <div className="flex items-center gap-2 pt-1">
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="h-8 w-8 rounded-lg border border-[#e8e2d9] dark:border-[#2d2924] flex items-center justify-center hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="h-8 w-8 rounded-lg border border-[#e8e2d9] dark:border-[#2d2924] flex items-center justify-center hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="h-8 w-8 rounded-lg border border-[#e8e2d9] dark:border-[#2d2924] flex items-center justify-center hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2d2a26] dark:text-[#f0eae1]">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition">Home</Link></li>
              <li><Link href="/books" className="hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition">All Books</Link></li>
              <li><Link href="/add-book" className="hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition">Add Book</Link></li>
              <li><Link href="/my-borrows" className="hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition">My Borrows</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2d2a26] dark:text-[#f0eae1]">Genres</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-[#2d2a26] dark:hover:text-[#f0eae1] cursor-pointer transition">Classics & Fiction</span></li>
              <li><span className="hover:text-[#2d2a26] dark:hover:text-[#f0eae1] cursor-pointer transition">History & Philosophy</span></li>
              <li><span className="hover:text-[#2d2a26] dark:hover:text-[#f0eae1] cursor-pointer transition">Science & Tech</span></li>
              <li><span className="hover:text-[#2d2a26] dark:hover:text-[#f0eae1] cursor-pointer transition">Biographies</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2d2a26] dark:text-[#f0eae1]">Library Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#8c6d46] dark:text-[#d4a373]" /> 123 Reading Ave, Library Nook</li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[#8c6d46] dark:text-[#d4a373]" /> +1 (800) 555-BOOK</li>
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-[#8c6d46] dark:text-[#d4a373]" /> hello@booknook.lib</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[#e8e2d9] dark:border-[#2d2924] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c8275] dark:text-[#736c61]">
          <p>© {new Date().getFullYear()} BookNook Library. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with care for readers <Heart className="h-3 w-3 text-[#8c6d46] dark:text-[#d4a373] fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}