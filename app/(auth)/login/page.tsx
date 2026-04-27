"use client";

import { useState, useEffect } from "react";
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

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [isVerification, setIsVerification] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.verifyEmail(email, otp);
      router.push("/area-utente");
    } catch (err: any) {
      console.error("Verification Error:", err);
      setError(err.message || "Codice non valido");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await authApi.resendVerificationEmail(email);
      setTimer(61);
      setCanResend(false);
      setError("");
    } catch (err: any) {
      console.error("Resend Error:", err);
      setError(err.message || "Errore nell'invio del codice");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // @ts-ignore
      const response = await authApi.login(email, password);
      // @ts-ignore
      if (response.verificationNeeded) {
        setIsVerification(true);
        setTimer(60);
        setCanResend(false);
        return;
      }
      if (response.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/area-utente");
      }
    } catch (err: any) {
      setError(err.message || "Errore durante il login");
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP Verification screen ── */
  if (isVerification) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="mx-auto max-w-md w-full">
          <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-sm text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-3 text-2xl font-light tracking-wide text-neutral-900">
              Verifica Email
            </h1>
            <p className="mb-4 text-sm text-neutral-500 font-light leading-relaxed">
              Abbiamo inviato un codice a{" "}
              <span className="font-medium text-neutral-900">{email}</span>.
              Inseriscilo qui sotto per accedere.
            </p>
            <p className="mb-6 text-xs text-neutral-400 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              Non hai ricevuto l'email? Controlla la cartella{" "}
              <strong>Spam</strong> o <strong>Posta Indesiderata</strong> o
              riprova tra 15 minuti.
            </p>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-5">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Codice OTP (6 cifre)"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center text-2xl font-light tracking-widest text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                maxLength={6}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifica..." : "Verifica Account"}
              </button>
            </form>

            <div className="mt-6 border-t border-neutral-100 pt-6">
              <p className="mb-3 text-sm text-neutral-400">Non hai ricevuto il codice?</p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className="text-sm font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {canResend ? "Invia nuovo codice" : `Invia nuovo codice tra ${timer}s`}
              </button>
            </div>

            <button
              onClick={() => setIsVerification(false)}
              className="mt-4 text-sm text-neutral-400 hover:text-neutral-600"
            >
              ← Indietro
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ── Main Login screen ── */
  return (
    <>
      <main className="min-h-screen bg-white pt-24 pb-20 px-6">
        <div className="mx-auto max-w-md">

          {/* Back link */}
          <div className="mb-8">
            <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 transition">
              ← Torna alla home
            </Link>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-sm">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                Sultan Nails
              </p>
              <h1 className="text-3xl font-light tracking-wide text-neutral-900">Accedi</h1>
              <p className="mt-2 text-sm text-neutral-400 font-light">
                Accedi al tuo account per gestire le prenotazioni
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                  placeholder="tua@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-neutral-500 hover:text-neutral-800 transition underline underline-offset-2"
                >
                  Password dimenticata?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Accesso in corso..." : "Accedi"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-500">
              Non hai un account?{" "}
              <Link href="/register" className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700">
                Registrati
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
