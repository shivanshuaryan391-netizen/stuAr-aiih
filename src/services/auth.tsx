import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState({
    id: "demo-user",
    name: "Aryan",
    email: "demo@stuar.ai",
    avatarColor: "#6366f1",
    provider: "demo",
    createdAt: Date.now(),
  });

  const value = useMemo(
    () => ({
      user,
      loading: false,
      backend: "local",
      signIn: async () => {},
      signUp: async () => {},
      signInWithGoogle: async () => {},
      resetPassword: async () => {},
      signOut: async () => {},
      refreshUser: () => {},
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}