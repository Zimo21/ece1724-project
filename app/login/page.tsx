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
    <main className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
      <div className="w-full max-w-md border border-black bg-white p-6">
        <h1 className="text-xl font-semibold">Login</h1>

        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <GoogleIcon />
            <span className="ml-2">Sign in with Google</span>
          </Button>

          <div className="my-4 text-center text-sm">Or sign in with email</div>

          <form onSubmit={handleEmailLogin}>
            <div className="mb-3">
              <label className="block text-sm mb-1">Email</label>
              <input
                className="w-full border border-black px-3 py-2 bg-white text-black"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Password</label>
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 border border-black px-3 py-2 bg-white text-black"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="border border-black px-3 py-2 bg-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                Keep me logged in
              </label>

              <button
                type="button"
                className="text-sm underline"
                onClick={() =>
                  alert(
                    "Forgot password not wired yet. Tell me if you want it enabled."
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="mb-3 border border-black p-3 text-sm">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              Login
            </Button>
          </form>

          <p className="mt-4 text-sm text-center">
            Don’t have an account?{" "}
            <button
              className="underline"
              type="button"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}