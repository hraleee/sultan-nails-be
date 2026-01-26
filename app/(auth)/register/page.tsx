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
      setTimer(61); // 60 seconds countdown
      setCanResend(false);
      setError(""); // Clear previous errors
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
        setTimer(60); // Start timer immediately on success
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

  if (isSuccess) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0f1018] to-black px-6">
        <div className="mx-auto max-w-md w-full">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fuchsia-500/20 text-4xl">
                📩
              </div>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-white">Verifica Email</h1>
            <p className="mb-6 text-white/70">
              Abbiamo inviato un codice a <span className="font-semibold text-white">{formData.email}</span>.
              Inseriscilo qui sotto per attivare il tuo account.
            </p>
            <p className="mb-6 text-xs text-white/50 bg-white/5 p-2 rounded-lg border border-white/10">
              ⚠️ Non hai ricevuto l'email? Controlla la cartella <strong>Spam</strong> o <strong>Posta Indesiderata</strong> o riprova tra 15 minuti.
            </p>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Codice OTP (6 cifre)"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl font-bold tracking-widest text-white placeholder:text-white/20 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-400 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-xl shadow-purple-500/40 transition hover:-translate-y-0.5 hover:shadow-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifica..." : "Verifica Account"}
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="mb-3 text-sm text-white/60">Non hai ricevuto il codice?</p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className="text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canResend ? "Invia nuovo codice" : `Invia nuovo codice tra ${timer}s`}
              </button>
            </div>

            <button
              onClick={() => setIsSuccess(false)}
              className="mt-4 text-sm text-white/40 hover:text-white/60"
            >
              Indietro
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0f1018] to-black pt-24 pb-20 px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400/90 to-sky-400/90 shadow-xl">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Registrati</h1>
            <p className="mt-2 text-white/70">
              Crea il tuo account Sultan Nails
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-white/90">
                  Nome
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  placeholder="Nome"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-white/90">
                  Cognome
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  placeholder="Cognome"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/90">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                placeholder="tua@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-white/90">
                Telefono (opzionale)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                placeholder="+39 123 456 7890"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/90">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                placeholder="Minimo 6 caratteri"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-white/90">
                Conferma Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                placeholder="Ripeti la password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-400 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-xl shadow-purple-500/40 transition hover:-translate-y-0.5 hover:shadow-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrazione in corso..." : "Registrati"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/70">
            Hai già un account?{" "}
            <Link href="/login" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">
              Accedi
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
  );
}

