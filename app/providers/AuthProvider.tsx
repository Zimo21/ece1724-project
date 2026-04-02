"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";


type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        try {
          const token = await u.getIdToken();
          await fetch("/api/user", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch {
          // Ignore errors - user creation is optional
        }
      }
    });
    return () => unsub();
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}