"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, User, Mail, Image as ImageIcon, Lock, UserPlus, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Live password validation checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name || !email || !password || !repassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!hasUppercase || !hasLowercase || !hasMinLength) {
      setErrorMessage("Please fix password validation requirements below.");
      return;
    }

    if (password !== repassword) {
      setErrorMessage("Passwords do not match. Please check again.");
      return;
    }

    setSuccessMessage("Registration successful! Redirecting to Login...");
    setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  const handleGoogleRegister = () => {
    setSuccessMessage("Authenticating with Google... Redirecting to Home...");
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#faf8f5] dark:bg-[#181614] border border-[#e8e2d9] dark:border-[#2d2924] shadow-sm transition-colors duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] shadow-sm mb-1">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1] font-serif">
            Join Book<span className="text-[#8c6d46] dark:text-[#d4a373]">Nook</span>
          </h1>
          <p className="text-xs text-[#625b52] dark:text-[#a89f91]">
            Create an account to add, borrow, and share books.
          </p>
        </div>

        {/* Error / Success Messages */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center">
            {successMessage}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2d2a26] dark:text-[#f0eae1] uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-[#8c8275]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#fdfcfa] dark:bg-[#131110] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/40 dark:focus:ring-[#d4a373]/40 transition"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2d2a26] dark:text-[#f0eae1] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#8c8275]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@booknook.lib"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#fdfcfa] dark:bg-[#131110] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/40 dark:focus:ring-[#d4a373]/40 transition"
              />
            </div>
          </div>

          {/* Photo URL Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2d2a26] dark:text-[#f0eae1] uppercase tracking-wider">
              Photo URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#8c8275]" />
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#fdfcfa] dark:bg-[#131110] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/40 dark:focus:ring-[#d4a373]/40 transition"
              />
            </div>
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2d2a26] dark:text-[#f0eae1] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#8c8275]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#fdfcfa] dark:bg-[#131110] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/40 dark:focus:ring-[#d4a373]/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#8c8275] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (repassword) with Eye Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2d2a26] dark:text-[#f0eae1] uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#8c8275]" />
              <input
                type={showRepassword ? "text" : "password"}
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#fdfcfa] dark:bg-[#131110] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/40 dark:focus:ring-[#d4a373]/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowRepassword(!showRepassword)}
                className="absolute right-3.5 top-3 text-[#8c8275] hover:text-[#2d2a26] dark:hover:text-[#f0eae1] transition"
                aria-label="Toggle confirm password visibility"
              >
                {showRepassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Live Password Validation Feedback */}
          <div className="p-3 rounded-xl bg-[#f2ede4] dark:bg-[#201d1a] border border-[#e8e2d9] dark:border-[#2d2924] space-y-1.5 text-xs">
            <p className="font-semibold text-[#2d2a26] dark:text-[#f0eae1] mb-1">Password Requirements:</p>
            <div className={`flex items-center gap-2 ${hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-[#8c8275]"}`}>
              <CheckCircle2 className={`h-3.5 w-3.5 ${hasUppercase ? "opacity-100" : "opacity-40"}`} />
              <span>Must have an Uppercase letter</span>
            </div>
            <div className={`flex items-center gap-2 ${hasLowercase ? "text-emerald-600 dark:text-emerald-400" : "text-[#8c8275]"}`}>
              <CheckCircle2 className={`h-3.5 w-3.5 ${hasLowercase ? "opacity-100" : "opacity-40"}`} />
              <span>Must have a Lowercase letter</span>
            </div>
            <div className={`flex items-center gap-2 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-[#8c8275]"}`}>
              <CheckCircle2 className={`h-3.5 w-3.5 ${hasMinLength ? "opacity-100" : "opacity-40"}`} />
              <span>Length must be at least 6 characters</span>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] font-medium text-sm hover:opacity-95 shadow transition"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Library Account</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e8e2d9] dark:border-[#2d2924]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#faf8f5] dark:bg-[#181614] px-2 text-[#8c8275]">Or continue with</span>
          </div>
        </div>

        {/* Google Social Register Button */}
        <button
          onClick={handleGoogleRegister}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#fdfcfa] dark:bg-[#1c1917] text-sm font-medium text-[#2d2a26] dark:text-[#f0eae1] hover:bg-[#f2ede4] dark:hover:bg-[#23201d] transition shadow-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Login Link */}
        <p className="text-center text-xs text-[#625b52] dark:text-[#a89f91] mt-6">
          Already have a library account?{" "}
          <Link href="/login" className="font-semibold text-[#8c6d46] dark:text-[#d4a373] hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}