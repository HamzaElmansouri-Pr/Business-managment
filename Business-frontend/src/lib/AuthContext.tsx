"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "./types";
import { api } from "./api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("bm_token");
      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const res = await api.get<{ data: User }>("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        localStorage.removeItem("bm_token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("bm_token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
