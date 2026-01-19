'use client';

import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { User } from '@/lib/api';

interface UserProfileProps {
    userData: User | null;
    onUpdate: () => void; // Callback to refresh data in parent
}

export default function UserProfile({ userData, onUpdate }: UserProfileProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone || '',
            }));
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Basic validation
        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            setMessage({ text: 'Le nuove password non coincidono', type: 'error' });
            setLoading(false);
            return;
        }

        if (formData.newPassword && formData.newPassword.length < 6) {
            setMessage({ text: 'La nuova password deve essere di almeno 6 caratteri', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            const updates: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
            };

            if (formData.newPassword) {
                updates.currentPassword = formData.currentPassword;
                updates.newPassword = formData.newPassword;
            }

            await userApi.updateProfile(updates);

            setMessage({ text: 'Profilo aggiornato con successo', type: 'success' });
            // Clear password fields logic could be here
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));

            onUpdate(); // Refresh parent data
        } catch (error) {
            setMessage({
                text: error instanceof Error ? error.message : 'Errore durante l\'aggiornamento',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                    Il Tuo Profilo
                </h2>
                <p className="text-white/40">Gestisci le tue informazioni personali e di accesso</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-8">

                {/* Personal Info Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white/90 border-b border-white/10 pb-4">Dati Personali</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 ml-1">Nome</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/30 transition shadow-inner"
                                placeholder="Il tuo nome"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 ml-1">Cognome</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/30 transition shadow-inner"
                                placeholder="Il tuo cognome"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/30 transition shadow-inner"
                                placeholder="tua@email.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 ml-1">Telefono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/30 transition shadow-inner"
                                placeholder="+39 ..."
                            />
                        </div>
                    </div>
                </div>

                {/* Password Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white/90 border-b border-white/10 pb-4 pt-4">Sicurezza</h3>
                    <p className="text-sm text-white/40 mb-4">Compila solo se desideri modificare la tua password attuale.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm text-white/60 ml-1">Password Attuale (Richiesta per modifiche password)</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/30 transition shadow-inner"
                                placeholder="Inserisci la password attuale"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 ml-1">Nuova Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/30 transition shadow-inner"
                                placeholder="Minimo 6 caratteri"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 ml-1">Conferma Nuova Password</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={formData.confirmNewPassword}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/30 transition shadow-inner"
                                placeholder="Ripeti nuova password"
                            />
                        </div>
                    </div>
                </div>

                {/* Feedback Message */}
                {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold hover:from-fuchsia-500 hover:to-purple-500 focus:ring-2 focus:ring-fuchsia-500/50 transition shadow-lg shadow-fuchsia-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Salvataggio...' : 'Salva Modifiche'}
                    </button>
                </div>
            </form>
        </div>
    );
}
