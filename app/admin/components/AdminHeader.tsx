"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";

export default function AdminHeader() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    try {
      authApi.logout();
      // Force reload to clear any state
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear localStorage manually and redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
  };

  if (!mounted) {
    return (
      <header className="fixed left-0 right-0 top-0 z-[999] border-b border-white/10 bg-gradient-to-b from-black/80 via-black/90 to-black/95 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-400/90 to-sky-400/90 shadow-xl shadow-fuchsia-500/50" />
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-fuchsia-100">
                Sultan
              </div>
              <div className="text-sm font-bold text-white">Admin Panel</div>
            </div>
          </div>
          <div className="h-10 w-24 rounded-full bg-white/5" />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[999] border-b border-white/10 bg-gradient-to-b from-black/80 via-black/90 to-black/95 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-400/90 to-sky-400/90 shadow-xl shadow-fuchsia-500/50" />
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-fuchsia-100">
              Sultan
            </div>
            <div className="text-sm font-bold text-white">Admin Panel</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-fuchsia-500/40 hover:shadow-fuchsia-500/60 hover:-translate-y-1 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

