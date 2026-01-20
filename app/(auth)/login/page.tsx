"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import ForgotPasswordModal from "@/app/components/ForgotPasswordModal";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login(email, password);

      // Redirect based on role
      if (response.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/area-utente');
      }
    } catch (err: any) {
      setError(err.message || "Errore durante il login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-black via-[#0f1018] to-black pt-24 pb-20 px-6">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400/90 to-sky-400/90 shadow-xl">
                <span className="text-3xl">💅</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Accedi</h1>
              <p className="mt-2 text-white/70">
                Accedi al tuo account Sultan Nails
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/90">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  placeholder="tua@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/90">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-fuchsia-400 hover:text-fuchsia-300 transition"
                >
                  Password dimenticata?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-400 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-xl shadow-purple-500/40 transition hover:-translate-y-0.5 hover:shadow-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Accesso in corso..." : "Accedi"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/70">
              Non hai un account?{" "}
              <Link href="/register" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">
                Registrati
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-white/60 hover:text-white/80">
                ← Torna alla home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </>
  );
}
