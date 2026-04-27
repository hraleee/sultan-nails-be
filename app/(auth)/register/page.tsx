"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

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
      await authApi.verifyEmail(formData.email, otp);
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
      await authApi.resendVerificationEmail(formData.email);
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }
    if (formData.password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri");
      return;
    }

    setLoading(true);
    try {
      console.log("Calling authApi.register...");
      const res = await authApi.register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone || undefined
      );
      // @ts-ignore - verificationNeeded added to backend response
      if (res.verificationNeeded || res.message) {
        setIsSuccess(true);
        setTimer(60);
        setCanResend(false);
      }
    } catch (err: any) {
      console.error("Register Error:", err);
      setError(err.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ── OTP Verification screen ── */
  if (isSuccess) {
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
              <span className="font-medium text-neutral-900">{formData.email}</span>.
              Inseriscilo qui sotto per attivare il tuo account.
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
              onClick={() => setIsSuccess(false)}
              className="mt-4 text-sm text-neutral-400 hover:text-neutral-600"
            >
              ← Indietro
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ── Main Register screen ── */
  return (
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
            <h1 className="text-3xl font-light tracking-wide text-neutral-900">Registrati</h1>
            <p className="mt-2 text-sm text-neutral-400 font-light">
              Crea il tuo account per prenotare online
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-neutral-700">
                  Nome
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                  placeholder="Nome"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-neutral-700">
                  Cognome
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                  placeholder="Cognome"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                placeholder="tua@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-neutral-700">
                Telefono <span className="text-neutral-400 font-light">(opzionale)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                placeholder="+39 123 456 7890"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                placeholder="Minimo 6 caratteri"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-neutral-700">
                Conferma Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                placeholder="Ripeti la password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrazione in corso..." : "Registrati"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            Hai già un account?{" "}
            <Link href="/login" className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700">
              Accedi
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
