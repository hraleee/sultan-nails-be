"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authApi, type User } from "@/lib/api";

interface BookingButtonProps {
    className?: string;
}

export default function BookingButton({ className }: BookingButtonProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const currentUser = authApi.getUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error checking auth:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        // Poll every 2 seconds to match Header logic
        const interval = setInterval(checkAuth, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Default class if none provided
    const buttonClass = className || "rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-200";

    if (loading) {
        // Return a placeholder or the default button (pointing to login) to avoid layout shift
        // Ideally we might want a spinner, but keeping it simple as per request
        return (
            <Link href="/login" className={buttonClass}>
                Prenota Online
            </Link>
        );
    }

    return (
        <Link
            href={user ? (user.role === 'admin' ? '/admin' : '/area-utente') : '/login'}
            className={buttonClass}
        >
            Prenota Online
        </Link>
    );
}
