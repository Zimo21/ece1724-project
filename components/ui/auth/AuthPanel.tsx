"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { signInWithEmail, signInWithGoogle, signOutUser, signUpWithEmail } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function AuthPanel() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (loading) return <p className="text-sm text-muted-foreground">Loading auth…</p>;

  if (user) {
    return (
      <div className="space-y-2">
        <p className="text-sm">
          Signed in as <span className="font-medium">{user.email ?? user.uid}</span>
        </p>
        <Button variant="outline" onClick={() => signOutUser()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => signInWithEmail(email, password)}>Sign in</Button>
        <Button variant="outline" onClick={() => signUpWithEmail(email, password)}>
          Sign up
        </Button>
        <Button variant="secondary" onClick={() => signInWithGoogle()}>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}