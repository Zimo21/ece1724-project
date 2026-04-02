"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons/GoogleIcon";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
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
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-200 bg-white/90 p-8 shadow-xl backdrop-blur">
          <div className="mb-6">
            <div className="mb-2 text-2xl font-semibold">Login</div>
            <p className="text-sm text-neutral-500">Welcome back! Please sign in.</p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border-neutral-200 bg-white py-6 shadow-sm hover:bg-neutral-50"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <GoogleIcon />
            <span className="ml-2">Sign in with Google</span>
          </Button>

          <div className="my-5 text-center text-xs tracking-wider text-neutral-400">
            Or sign in with email
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-neutral-600">Email</label>
              <input
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-neutral-600">Password</label>
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-600">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                />
                Keep me logged in
              </label>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-6 text-white hover:bg-indigo-700"
              disabled={!canSubmit}
            >
              Login
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-neutral-500">
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
        <div className="relative hidden h-full w-full items-center justify-center lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -top-12 right-10 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 opacity-70 blur-2xl" />
            <div className="absolute bottom-6 left-8 h-56 w-56 rounded-full bg-gradient-to-br from-teal-200 via-cyan-300 to-blue-300 opacity-70 blur-2xl" />
            <div className="absolute top-24 left-1/2 h-36 w-36 -translate-x-1/2 rounded-3xl bg-gradient-to-br from-pink-300 to-orange-300 opacity-80 blur-xl" />
          </div>

          <div className="relative z-10 max-w-sm text-right">
            <p className="text-4xl font-semibold leading-tight text-neutral-800">
              Changing the way <br /> the world writes
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}