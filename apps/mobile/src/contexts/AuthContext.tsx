import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { api } from "@/lib/api";
import { clearSession, getStoredUser, saveSession, saveUser } from "@/lib/auth";
import type { SessionPayload, UserRole } from "@hedhunter/shared";

interface AuthContextValue {
  user: SessionPayload | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getStoredUser<SessionPayload>();
      if (stored) setUser(stored);
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // 1. Authenticate with Firebase
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const idToken = await cred.user.getIdToken();

    // 2. Exchange Firebase ID token for a signed session JWT
    const res = await api.post("/api/auth/session", { token: idToken });
    const { token, role } = res.data as { token: string; role: UserRole };

    // 3. Persist session
    const sessionUser: SessionPayload = { uid: cred.user.uid, email, role };
    await saveSession(token);
    await saveUser(sessionUser);
    setUser(sessionUser);
    redirectByRole(role);
  }, []);

  const register = useCallback(async (
    email: string, password: string, role: UserRole
  ) => {
    // 1. Create Firebase account
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const idToken = await cred.user.getIdToken();

    // 2. Register in Firestore + get session JWT
    const res = await api.post("/api/auth/register", { token: idToken, role });
    const { token } = res.data as { token: string; role: UserRole };

    // 3. Persist session
    const sessionUser: SessionPayload = { uid: cred.user.uid, email, role };
    await saveSession(token);
    await saveUser(sessionUser);
    setUser(sessionUser);
    redirectByRole(role, true);
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth);
    await clearSession();
    setUser(null);
    router.replace("/(auth)/login");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function redirectByRole(role: UserRole, onboarding = false) {
  if (role === "JOB_SEEKER") {
    router.replace(onboarding ? "/(job-seeker)/onboarding" : "/(job-seeker)/dashboard");
  } else if (role === "COMPANY") {
    router.replace(onboarding ? "/(company)/onboarding" : "/(company)/dashboard");
  } else {
    router.replace("/(admin)/dashboard");
  }
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
