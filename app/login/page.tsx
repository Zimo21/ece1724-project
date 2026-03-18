"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons/GoogleIcon";

// const router = useRouter();

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true); // UI only (see note below)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !submitting;
  }, [email, password, submitting]);

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      // redirect happens via useEffect when user becomes available
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmail(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Email sign-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* LEFT: Login column */}
        <section className="relative flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8">
              {/* <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-cyan-400 opacity-90" /> */}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">Login</h1>

            <div className="mt-6 space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 justify-center gap-2 rounded-xl"
                onClick={handleGoogle}
                disabled={submitting}
              >
                
                 <GoogleIcon />
                Sign in with Google
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">Or sign in with email</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input
                    className="w-full h-11 rounded-xl border bg-muted/20 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Password</label>
                  <div className="relative">
                    <input
                      className="w-full h-11 rounded-xl border bg-muted/20 px-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
                    <input
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      className="h-4 w-4 rounded border"
                    />
                    Keep me logged in
                  </label>

                  {/* This is only UI for now */}
                  <button
                    type="button"
                    className="text-sm text-indigo-600 hover:underline"
                    onClick={() => alert("Forgot password not wired yet. Tell me if you want it enabled.")}
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700"
                  disabled={!canSubmit}
                >
                  Login
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center pt-2">
                Don’t have an account?{" "}
                    <button
                        className="text-indigo-600 hover:underline"
                        type="button"
                        onClick={() => router.push("/signup")}
                        >
                    Sign up
                 </button>
              </p>
            </div>

            {/* Note about keepLoggedIn */}
            {/* <p className="mt-8 text-xs text-muted-foreground">
              Note: “Keep me logged in” is currently visual only. If you want it to control Firebase persistence
              (session vs local), tell me and I’ll add it.
            </p> */}
          </div>
        </section>

        {/* RIGHT: Marketing / shapes */}
        <section className="relative overflow-hidden hidden lg:flex items-center justify-center bg-white">
          {/* Decorative gradient blobs (approximate screenshot) */}
          <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200 to-fuchsia-200 blur-2xl opacity-70" />
          <div className="absolute top-10 right-24 h-44 w-44 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 blur-2xl opacity-80" />
          <div className="absolute bottom-20 right-28 h-56 w-56 rounded-full bg-gradient-to-br from-cyan-200 to-indigo-200 blur-2xl opacity-70" />

          {/* dotted pattern */}
          <div className="absolute top-40 right-40 h-24 w-32 opacity-40"
               style={{
                 backgroundImage:
                   "radial-gradient(#cbd5e1 1px, transparent 1px)",
                 backgroundSize: "10px 10px",
               }}
          />

          {/* Center text */}
          <div className="relative px-10">
            <h2 className="text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
              Changing the way
              <br />
              <span className="relative inline-block">
                the world writes
                <span className="absolute -left-3 -bottom-2 h-5 w-16 rotate-[-12deg] rounded-full bg-gradient-to-r from-rose-300 to-orange-200 opacity-70" />
              </span>
            </h2>
          </div>
        </section>
      </div>
    </main>
  );
}