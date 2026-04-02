"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "../providers/AuthProvider";
import { signInWithGoogle, signUpWithEmail } from "@/lib/auth/actions";
import { GoogleIcon } from "@/components/ui/icons/GoogleIcon";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!email.trim() || !password) return false;
    if (password !== confirm) return false;
    return true;
  }, [email, password, confirm, submitting]);

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

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signUpWithEmail(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed");
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
            <div className="mb-2 text-2xl font-semibold">Sign up</div>
            <p className="text-sm text-neutral-500">
              Create your account to start converting documents.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border-neutral-200 bg-white py-6 shadow-sm hover:bg-neutral-50"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <GoogleIcon />
            <span className="ml-2">Continue with Google</span>
          </Button>

          <div className="my-5 text-center text-xs uppercase tracking-wider text-neutral-400">
            Or sign up with email
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
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
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

            <div>
              <label className="block text-sm mb-1 text-neutral-600">
                Confirm password
              </label>
              <input
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
              />
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
              Create account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <button
              className="text-indigo-600 hover:underline"
              type="button"
              onClick={() => router.push("/login")}
            >
              Log in
            </button>
          </p>
        </div>

        <div className="relative hidden h-full w-full items-center justify-center lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -top-12 right-10 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 opacity-70 blur-2xl" />
            <div className="absolute bottom-6 left-8 h-56 w-56 rounded-full bg-gradient-to-br from-teal-200 via-cyan-300 to-blue-300 opacity-70 blur-2xl" />
            <div className="absolute top-24 left-1/2 h-36 w-36 -translate-x-1/2 rounded-3xl bg-gradient-to-br from-pink-300 to-orange-300 opacity-80 blur-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}