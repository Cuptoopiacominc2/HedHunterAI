import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { authApi } from "@/lib/api";
import { clearSession, getStoredUser, saveSession, saveUser } from "@/lib/auth";
import type { SessionPayload, UserRole } from "@hedhunter/shared";

interface AuthContextValue {
  user: SessionPayload | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, name?: string) => Promise<void>;
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
    const res = await authApi.login({ email, password });
    const { token, user: u } = res.data;
    await saveSession(token);
    await saveUser(u);
    setUser(u);
    redirectByRole(u.role);
  }, []);

  const register = useCallback(async (
    email: string, password: string, role: UserRole, name?: string
  ) => {
    const res = await authApi.register({ email, password, role, name });
    const { token, user: u } = res.data;
    await saveSession(token);
    await saveUser(u);
    setUser(u);
    redirectByRole(u.role, true);
  }, []);

  const logout = useCallback(async () => {
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
