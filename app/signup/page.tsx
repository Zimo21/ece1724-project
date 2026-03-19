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
      await signInWithGoogle(); // Google will create an account on first use
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
      // redirect happens when user becomes available
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
    <main className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
      <div className="w-full max-w-md border border-black bg-white p-6">
        <h1 className="text-xl font-semibold">Sign up</h1>
        <p className="mt-2 text-sm">
          Create your account to start converting documents.
        </p>

        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <GoogleIcon />
            <span className="ml-2">Continue with Google</span>
          </Button>

          <div className="my-4 text-center text-sm">Or sign up with email</div>

          <form onSubmit={handleSignup}>
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
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

            <div className="mb-3">
              <label className="block text-sm mb-1">Confirm password</label>
              <input
                className="w-full border border-black px-3 py-2 bg-white text-black"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="mb-3 border border-black p-3 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              Create account
            </Button>
          </form>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <button
              className="underline"
              type="button"
              onClick={() => router.push("/login")}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}