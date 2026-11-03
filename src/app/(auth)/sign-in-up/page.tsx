"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";

interface AuthDialogProps {
  mode?: "login" | "register";
  triggerButton?: React.ReactNode;
  triggerClassName?: string;
  // Props for external control (e.g., from Navbar/Middleware)
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: "login" | "register";
}

const FOIL = "#e9d9ab";
const RULE_TICKS = [26, 21, 26];

// Ruled-line input: shadcn <Input> restyled as a line on a library card
const ruledInput =
  "h-10 rounded-none border-0 border-b border-stone-300 bg-transparent px-0 text-[15px] text-[#2d2a26] shadow-none placeholder:text-stone-400 focus-visible:border-[#8c6d46] focus-visible:shadow-[0_1px_0_0_#8c6d46] focus-visible:ring-0 dark:border-stone-600 dark:bg-transparent dark:text-[#f0eae1] dark:placeholder:text-stone-500 dark:focus-visible:border-[#d4a373] dark:focus-visible:shadow-[0_1px_0_0_#d4a373]";

const fieldLabel = "text-sm font-normal text-stone-500 dark:text-stone-400";

/* ───────── small pieces (defined outside so inputs keep focus) ───────── */

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className={fieldLabel}>
        {label}
      </Label>
      {children}
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
}) {
  return (
    <Field id={id} label={label}>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className={`${ruledInput} pr-11`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-0 top-0 flex h-10 w-10 cursor-pointer items-center justify-center text-stone-500 outline-none hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-[#8c6d46] dark:text-stone-400 dark:hover:text-stone-100"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );
}

/* Left panel: a book standing on a shelf, with the BookNook name on the cover */
function BrandPanel({ isLogin }: { isLogin: boolean }) {
  return (
    <div
      aria-hidden
      className="relative hidden flex-col items-center justify-between overflow-hidden bg-[#3e342a] px-8 pb-9 pt-10 text-center md:flex"
    >
      {/* soft light from above */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, rgba(255,255,255,.16), transparent 60%)",
        }}
      />

      {/* the book */}
      <div className="relative mt-2 w-40">
        {/* page block */}
        <div
          className="absolute inset-y-[6px] -right-[8px] left-3 rounded-r-[5px] bg-stone-200"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,.09) 2px 3px)",
          }}
        />

        {/* cover */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-l-[3px] rounded-r-[7px] bg-[#52402d] shadow-[0_28px_36px_-16px_rgba(0,0,0,.65)]">
          {/* gold-foil borders */}
          <div
            className="absolute inset-3 left-6 rounded-[3px] border"
            style={{ borderColor: "rgba(233,217,171,.5)" }}
          />
          <div
            className="absolute inset-[18px] left-[30px] rounded-[2px] border"
            style={{ borderColor: "rgba(233,217,171,.22)" }}
          />

          {/* title on the cover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pl-5">
            <span
              className="font-serif text-[28px] leading-none tracking-[-0.02em]"
              style={{ color: FOIL }}
            >
              <span className="font-bold">Book</span>
            </span>
            <span
              className="mt-1 font-serif text-[28px] font-medium italic leading-none tracking-[-0.02em]"
              style={{ color: FOIL }}
            >
              Nook
            </span>
            <span
              className="mt-3 h-px w-10"
              style={{ backgroundColor: "rgba(233,217,171,.5)" }}
            />
          </div>

          {/* spine + hinge + gloss */}
          <div
            className="absolute inset-y-0 left-0 w-4"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,.45) 0%, rgba(255,255,255,.2) 45%, rgba(0,0,0,.18) 80%, transparent 100%)",
            }}
          />
          <div className="absolute inset-y-0 left-[19px] w-px bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/25" />

          {/* bookmark ribbon */}
          <div className="absolute right-5 top-0 h-9 w-3.5 bg-[#b4473f] shadow-sm [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]" />
        </div>
      </div>

      {/* shelf */}
      <div className="w-[88%]">
        <div className="h-3 rounded-t-[2px] bg-black/35" />
        <div className="h-1.5 bg-black/55" />
      </div>

      {/* copy */}
      <div className="relative mt-7">
        <p
          className="font-serif text-2xl font-semibold leading-snug"
          style={{ color: FOIL }}
        >
          {isLogin ? "Good to see you again" : "A shelf shared by readers"}
        </p>
        <p
          className="mx-auto mt-2 max-w-[26ch] text-sm leading-relaxed"
          style={{ color: "rgba(233,217,171,.75)" }}
        >
          {isLogin
            ? "Pick up where you left off. Your shelf and your loans are waiting."
            : "Borrow books, add your own and keep track of everything in one place."}
        </p>
      </div>
    </div>
  );
}

/* ───────── component ───────── */

export default function AuthDialog({
  mode = "login",
  triggerButton,
  triggerClassName,
  isOpen: externalIsOpen,
  onClose,
  initialMode,
}: AuthDialogProps) {
  const router = useRouter();

  // Internal state fallback if used independently without external props
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [authModeState, setAuthModeState] = useState({
    initialMode,
    isLogin: initialMode ? initialMode === "login" : mode === "login",
  });

  // Update derived state during render when the parent changes initialMode.
  if (authModeState.initialMode !== initialMode) {
    setAuthModeState({
      initialMode,
      isLogin: initialMode ? initialMode === "login" : authModeState.isLogin,
    });
  }

  const isLogin = authModeState.isLogin;
  const setIsLogin = (nextIsLogin: boolean) =>
    setAuthModeState((current) => ({ ...current, isLogin: nextIsLogin }));

  // Controlled externally or internally
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    if (isControlled) {
      if (!open && onClose) onClose();
    } else {
      setInternalIsOpen(open);
    }
  };

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation rules for register
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const rules = [
    { ok: hasUppercase, label: "An uppercase letter" },
    { ok: hasLowercase, label: "A lowercase letter" },
    { ok: hasMinLength, label: "At least 6 characters" },
  ];

  const switchMode = (nextIsLogin: boolean) => {
    setIsLogin(nextIsLogin);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          setErrorMessage("Please fill in all required fields.");
          setLoading(false);
          return;
        }

        const { data, error } = await signIn.email({ email, password });

        if (error) {
          setErrorMessage(error.message || "Failed to log in.");
          setLoading(false);
          return;
        }

        if (data) {
          setSuccessMessage("Signed in. Welcome back.");
          setTimeout(() => {
            setIsOpen(false);
            setSuccessMessage("");
            window.location.href = "/";
          }, 1000);
        }
      } else {
        // Register mode
        if (!name || !email || !password || !repassword) {
          setErrorMessage("Please fill in all required fields.");
          setLoading(false);
          return;
        }
        if (!hasUppercase || !hasLowercase || !hasMinLength) {
          setErrorMessage("Please fix password validation requirements.");
          setLoading(false);
          return;
        }
        if (password !== repassword) {
          setErrorMessage("Passwords do not match.");
          setLoading(false);
          return;
        }

        const { data, error } = await signUp.email({
          email,
          password,
          name,
          image: photoURL || undefined,
        });

        if (error) {
          setErrorMessage(error.message || "Failed to create account.");
          setLoading(false);
          return;
        }

        if (data) {
          setSuccessMessage("Account created successfully. Please sign in.");
          setTimeout(() => {
            setLoading(false);
            setSuccessMessage("");
            setIsLogin(true); // Smoothly switches back to the Sign In view tab
          }, 1200);
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("Redirecting to Google…");
      await signIn.social({ provider: "google", callbackURL: "/" });
    } catch (error: unknown) {
      console.error("Google sign-in failed:", error);
      setSuccessMessage("");
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerButton && (
        <DialogTrigger
          className={
            triggerClassName || "inline-flex cursor-pointer items-center gap-1"
          }
        >
          {triggerButton}
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-[4px] border border-stone-300 bg-white p-0 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] dark:border-stone-700 dark:bg-stone-900 sm:max-w-md md:max-w-3xl">
        <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <BrandPanel isLogin={isLogin} />

          {/* ───────── Form panel ───────── */}
          <div className="px-6 pb-8 pt-8 sm:px-9">
            <DialogTitle className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#2d2a26] dark:text-[#f0eae1]">
              {isLogin ? "Welcome back" : "Create your account"}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {isLogin
                ? "Sign In to borrow and share books."
                : "Join BookNook to add, borrow and share books."}
            </DialogDescription>

            {/* tabs, like index-card dividers */}
            <div
              role="tablist"
              aria-label="Account"
              className="mt-5 flex gap-7 border-b-2 border-[#b4473f]/70"
            >
              {[
                { id: "login", label: "Sign In", active: isLogin },
                { id: "register", label: "Create Account", active: !isLogin },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={tab.active}
                  onClick={() => switchMode(tab.id === "login")}
                  className={`min-h-11 cursor-pointer font-serif text-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#8c6d46] ${
                    tab.active
                      ? "font-semibold text-[#2d2a26] dark:text-[#f0eae1]"
                      : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* messages */}
            <div aria-live="polite" className="empty:hidden">
              {errorMessage && (
                <p
                  role="alert"
                  className="mt-4 text-sm font-medium text-[#9b2f2a] dark:text-[#e58a84]"
                >
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#2f4a3c] dark:text-[#8fbf9f]">
                  <Check className="h-4 w-4 shrink-0" />
                  {successMessage}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {!isLogin && (
                <Field id="auth-name" label="Full name">
                  <Input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Alex Johnson"
                    className={ruledInput}
                  />
                </Field>
              )}

              <Field id="auth-email" label="Email address">
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="alex@booknook.lib"
                  className={ruledInput}
                />
              </Field>

              {!isLogin && (
                <Field id="auth-photo" label="Photo URL (optional)">
                  <Input
                    id="auth-photo"
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    autoComplete="url"
                    placeholder="https://example.com/avatar.jpg"
                    className={ruledInput}
                  />
                </Field>
              )}

              <PasswordField
                id="auth-password"
                label="Password"
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />

              {!isLogin && (
                <PasswordField
                  id="auth-repassword"
                  label="Confirm password"
                  value={repassword}
                  onChange={setRepassword}
                  show={showRepassword}
                  onToggle={() => setShowRepassword(!showRepassword)}
                  autoComplete="new-password"
                />
              )}

              {/* password rules: three spines that fill in */}
              {!isLogin && (
                <div className="flex items-center gap-4 border-y border-dashed border-stone-300 py-3 dark:border-stone-700">
                  <div className="flex items-end gap-[4px]" aria-hidden>
                    {RULE_TICKS.map((h, i) => (
                      <span
                        key={i}
                        className={`w-[7px] rounded-[1px] transition-colors duration-300 ${
                          rules[i].ok
                            ? "bg-[#3e342a] dark:bg-[#d4a373]"
                            : "bg-stone-300 dark:bg-stone-600"
                        }`}
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                  <ul className="space-y-0.5 text-sm">
                    {rules.map((r) => (
                      <li
                        key={r.label}
                        className={`flex items-center gap-2 ${
                          r.ok
                            ? "text-[#2f4a3c] dark:text-[#8fbf9f]"
                            : "text-stone-500 dark:text-stone-400"
                        }`}
                      >
                        {r.ok ? (
                          <Check className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <span
                            aria-hidden
                            className="ml-[5px] mr-[5px] h-1 w-1 shrink-0 rounded-full bg-current"
                          />
                        )}
                        {r.label}
                        <span className="sr-only">
                          {r.ok ? " (done)" : " (needed)"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full cursor-pointer rounded-[6px] bg-[#3e342a] text-sm font-semibold text-[#faf8f5] shadow-md transition-[filter,transform] hover:bg-[#3e342a] hover:brightness-125 active:translate-y-px disabled:opacity-50 dark:bg-[#d4a373] dark:text-[#181614] dark:hover:bg-[#d4a373]"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading
                  ? isLogin
                    ? "Signing in"
                    : "Creating account"
                  : isLogin
                    ? "Sign In"
                    : "Create account"}
              </Button>
            </form>

            {/* divider */}
            <div className="my-5 flex items-center gap-3" aria-hidden>
              <span className="flex-1 border-t border-dotted border-stone-300 dark:border-stone-600" />
              <span className="text-sm text-stone-500 dark:text-stone-400">
                or
              </span>
              <span className="flex-1 border-t border-dotted border-stone-300 dark:border-stone-600" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              className="h-11 w-full cursor-pointer gap-3 rounded-[6px] border-stone-300 bg-transparent text-sm font-medium text-[#2d2a26] shadow-none hover:bg-stone-100 dark:border-stone-600 dark:bg-transparent dark:text-[#f0eae1] dark:hover:bg-white/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
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
              Continue with Google
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
