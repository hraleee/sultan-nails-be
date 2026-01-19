'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authApi.forgotPassword(email);
            setStep(2);
        } catch (err: any) {
            // We might want to handle user not found gracefully/silently, but here we show error or ignore
            setError(err.message || 'Errore nell\'invio del codice.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authApi.resetPassword(email, otp, newPassword);
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Errore nel ripristino della password.');
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setError(null);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f1018] p-8 shadow-2xl relative">
                <button
                    onClick={resetState}
                    className="absolute top-4 right-4 text-white/40 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="mb-2 text-2xl font-bold text-white">Recupero Password</h2>

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6 mt-6">
                        <p className="text-white/60 text-sm">Inserisci la tua email per ricevere un codice di verifica.</p>
                        <div>
                            <input
                                type="email"
                                placeholder="La tua email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                            />
                        </div>
                        {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
                        >
                            {loading ? 'Invio in corso...' : 'Invia Codice'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-6 mt-6">
                        <p className="text-white/60 text-sm">Controlla la tua email e inserisci il codice ricevuto.</p>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Codice OTP (6 cifre)"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 text-center tracking-widest text-lg font-mono"
                            />
                            <input
                                type="password"
                                placeholder="Nuova Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                            />
                        </div>
                        {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
                        >
                            {loading ? 'Verifica e Aggiorna...' : 'Imposta Nuova Password'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-white/40 hover:text-white"
                        >
                            Torna indietro
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6 mt-6">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl">
                            🎉
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white">Password Aggiornata!</h3>
                            <p className="text-white/60">Ora puoi accedere con la tua nuova password.</p>
                        </div>
                        <button
                            onClick={resetState}
                            className="w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-3 font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
                        >
                            Vai al Login
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
