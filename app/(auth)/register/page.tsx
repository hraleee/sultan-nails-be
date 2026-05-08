"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import RetroLoader from "@/app/components/RetroLoader";

/* ── BgVideo ── */
const BgVideo = ({ onReady }: { onReady: () => void }) => (
  <div className="fixed inset-0 -z-10 bg-black">
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onCanPlay={onReady}
      className="h-full w-full object-cover opacity-60"
    >
      <source src="/bgvideoY2K.webm" type="video/webm" />
      <source src="/bgvideoY2K.mp4" type="video/mp4" />
    </video>
  </div>
);

/* ── Video Loader (booting) ── */
export default function RegisterPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
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
      const res = await authApi.register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone || undefined
      );
      // @ts-ignore
      if (res.verificationNeeded || res.message) {
        setIsSuccess(true);
        setTimer(60);
        setCanResend(false);
      }
    } catch (err: any) {
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
      <main className="relative min-h-screen bg-transparent">
        <BgVideo onReady={() => setIsVideoReady(true)} />
        {!isVideoReady && <RetroLoader topLabel="booting_sultan_nails.exe" />}
        {loading && <RetroLoader topLabel="loading.exe" title="attendere prego..." soft />}
        <div className="flex min-h-screen items-center justify-center px-6 py-20">
          <div className="w-full max-w-md">
            <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[8px_8px_0_rgba(0,0,0,0.4)]">

              {/* Title bar */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">verify.exe</span>
                <div className="flex gap-1">
                  <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                  <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                  <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                </div>
              </div>

              {/* Menu strip */}
              <div className="flex gap-4 border-b border-white/30 bg-[#c9c9c9] px-3 py-1">
                {["File", "Security", "Help"].map((m) => (
                  <span key={m} className="font-hud text-[8px] uppercase tracking-wider text-[#1a1a1a]">{m}</span>
                ))}
              </div>

              <div className="p-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-white/80 shadow-[3px_3px_0_rgba(0,0,0,0.1)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0817a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <p className="mb-2 font-hud text-[10px] uppercase tracking-[0.3em] text-[#ff4fb3]">Sultan Nails</p>
                <h1 className="mb-3 font-poster text-2xl uppercase tracking-tight text-[#1a1a1a]">Verifica Email</h1>
                <p className="mb-4 font-hud text-[9px] uppercase leading-6 tracking-[0.1em] text-[#444]">
                  Abbiamo inviato un codice a{" "}
                  <span className="font-bold text-[#1a1a1a]">{formData.email}</span>.
                  Inseriscilo qui sotto per attivare il tuo account.
                </p>
                <div className="mb-6 border border-white/50 bg-white/40 px-4 py-3">
                  <p className="font-hud text-[8px] uppercase leading-5 tracking-[0.12em] text-[#555]">
                    Non hai ricevuto l'email? Controlla <strong>Spam</strong> o{" "}
                    <strong>Posta Indesiderata</strong> o riprova tra 15 minuti.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 border border-red-400/50 bg-red-100 px-4 py-3">
                    <p className="font-hud text-[9px] uppercase tracking-[0.12em] text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    className="w-full border-b-2 border-l border-r-2 border-t border-b-white/50 border-l-[#787878] border-r-white/50 border-t-[#787878] bg-white px-4 py-3 text-center font-poster text-2xl tracking-widest text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#0817a3]/30"
                    maxLength={6}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Verifica..." : "Verifica Account"}
                  </button>
                </form>

                <div className="mt-6 border-t border-white/50 pt-6">
                  <p className="mb-3 font-hud text-[9px] uppercase tracking-[0.14em] text-[#555]">
                    Non hai ricevuto il codice?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    className="font-hud text-[9px] uppercase tracking-[0.16em] text-[#0817a3] underline underline-offset-2 hover:text-[#ff4fb3] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {canResend ? "Invia nuovo codice" : `Invia nuovo codice tra ${timer}s`}
                  </button>
                </div>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 font-hud text-[9px] uppercase tracking-[0.14em] text-[#888] hover:text-[#1a1a1a]"
                >
                  ← Indietro
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Main Register screen ── */
  return (
    <main className="relative min-h-screen bg-transparent">
      <BgVideo onReady={() => setIsVideoReady(true)} />
      {!isVideoReady && <RetroLoader topLabel="booting_sultan_nails.exe" />}
      {loading && <RetroLoader topLabel="loading.exe" title="attendere prego..." soft />}
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">

          <div className="mb-4">
            <Link href="/" className="font-hud text-[9px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition">
              ← Torna alla home
            </Link>
          </div>

          <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[8px_8px_0_rgba(0,0,0,0.4)]">

            {/* Title bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
              <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">register.exe</span>
              <div className="flex gap-1">
                <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
              </div>
            </div>

            {/* Menu strip */}
            <div className="flex gap-4 border-b border-white/30 bg-[#c9c9c9] px-3 py-1">
              {["File", "Account", "Help"].map((m) => (
                <span key={m} className="font-hud text-[8px] uppercase tracking-wider text-[#1a1a1a]">{m}</span>
              ))}
            </div>

            <div className="p-5">
              <div className="mb-5 text-center">
                <p className="mb-1 font-hud text-[10px] uppercase tracking-[0.3em] text-[#ff4fb3]">Sultan Nails</p>
                <h1 className="font-poster text-2xl uppercase tracking-tight text-[#1a1a1a]">Registrati</h1>
                <p className="mt-1 font-hud text-[8px] uppercase tracking-[0.12em] text-[#555]">
                  Crea il tuo account per prenotare online
                </p>
              </div>

              {error && (
                <div className="mb-4 border border-red-400/50 bg-red-100 px-3 py-2">
                  <p className="font-hud text-[9px] uppercase tracking-[0.12em] text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="firstName" className="mb-1 block font-hud text-[8px] uppercase tracking-[0.12em] text-[#333]">Nome</label>
                    <input
                      id="firstName" name="firstName" type="text"
                      value={formData.firstName} onChange={handleChange} required
                      placeholder="Nome"
                      className="w-full border-b-2 border-l border-r-2 border-t border-b-white/50 border-l-[#787878] border-r-white/50 border-t-[#787878] bg-white px-3 py-2 font-hud text-[10px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#0817a3]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-1 block font-hud text-[8px] uppercase tracking-[0.12em] text-[#333]">Cognome</label>
                    <input
                      id="lastName" name="lastName" type="text"
                      value={formData.lastName} onChange={handleChange} required
                      placeholder="Cognome"
                      className="w-full border-b-2 border-l border-r-2 border-t border-b-white/50 border-l-[#787878] border-r-white/50 border-t-[#787878] bg-white px-3 py-2 font-hud text-[10px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#0817a3]/30"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block font-hud text-[8px] uppercase tracking-[0.12em] text-[#333]">Email</label>
                  <input
                    id="email" name="email" type="email"
                    value={formData.email} onChange={handleChange} required
                    placeholder="tua@email.com"
                    className="w-full border-b-2 border-l border-r-2 border-t border-b-white/50 border-l-[#787878] border-r-white/50 border-t-[#787878] bg-white px-3 py-2 font-hud text-[10px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#0817a3]/30"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 block font-hud text-[8px] uppercase tracking-[0.12em] text-[#333]">
                    Telefono <span className="text-[#999]">(opzionale)</span>
                  </label>
                  <input
                    id="phone" name="phone" type="tel"
                    value={formData.phone} onChange={handleChange}
                    placeholder="+39 123 456 7890"
                    className="w-full border-b-2 border-l border-r-2 border-t border-b-white/50 border-l-[#787878] border-r-white/50 border-t-[#787878] bg-white px-3 py-2 font-hud text-[10px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#0817a3]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="password" className="mb-1 block font-hud text-[8px] uppercase tracking-[0.12em] text-[#333]">Password</label>
                    <input
                      id="password" name="password" type="password"
                      value={formData.password} onChange={handleChange} required
                      placeholder="Min. 6 caratteri"
                      className="w-full border-b-2 border-l border-r-2 border-t border-b-white/50 border-l-[#787878] border-r-white/50 border-t-[#787878] bg-white px-3 py-2 font-hud text-[10px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#0817a3]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="mb-1 block font-hud text-[8px] uppercase tracking-[0.12em] text-[#333]">Conferma</label>
                    <input
                      id="confirmPassword" name="confirmPassword" type="password"
                      value={formData.confirmPassword} onChange={handleChange} required
                      placeholder="Ripeti"
                      className="w-full border-b-2 border-l border-r-2 border-t border-b-white/50 border-l-[#787878] border-r-white/50 border-t-[#787878] bg-white px-3 py-2 font-hud text-[10px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#0817a3]/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] py-2.5 font-hud text-[10px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Registrazione in corso..." : "Registrati"}
                </button>
              </form>

              <div className="mt-4 border-t border-white/50 pt-4 text-center">
                <p className="font-hud text-[9px] uppercase tracking-[0.14em] text-[#555]">
                  Hai già un account?{" "}
                  <Link href="/login" className="font-bold text-[#0817a3] underline underline-offset-2 hover:text-[#ff4fb3]">
                    Accedi
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

