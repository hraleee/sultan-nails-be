"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import Link from "next/link";
import { Suspense } from 'react';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState("Verifica in corso...");

    useEffect(() => {
        if (!email || !code) {
            setStatus('error');
            setMessage("Link non valido.");
            return;
        }

        const verify = async () => {
            try {
                await authApi.verifyEmail(email, code);
                setStatus('success');
                setMessage("Email verificata con successo! Reindirizzamento...");
                setTimeout(() => {
                    router.push("/area-utente");
                }, 2000);
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || "Link scaduto o non valido.");
            }
        };

        verify();
    }, [email, code, router]);

    return (
        <div className="mx-auto max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl text-center">
                <div className="mb-6 flex justify-center">
                    {status === 'loading' && (
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-fuchsia-500"></div>
                    )}
                    {status === 'success' && (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-4xl">
                            ✅
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-4xl">
                            ❌
                        </div>
                    )}
                </div>

                <h1 className="mb-2 text-2xl font-bold text-white">
                    {status === 'loading' && "Verifica Email"}
                    {status === 'success' && "Verificato!"}
                    {status === 'error' && "Errore"}
                </h1>

                <p className="mb-8 text-white/70">{message}</p>

                {status === 'error' && (
                    <Link
                        href="/login"
                        className="inline-block rounded-xl bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20"
                    >
                        Torna al Login
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0f1018] to-black px-6">
            <Suspense fallback={<div className="text-white">Caricamento...</div>}>
                <VerifyContent />
            </Suspense>
        </main>
    );
}
