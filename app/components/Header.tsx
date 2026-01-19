"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { authApi, type User } from "@/lib/api";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Servizi", href: "/servizi" },
  { label: "Palette", href: "/palette" },
  { label: "Pacchetti", href: "/pacchetti" },
  { label: "Contatti", href: "/contatti" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    // Check auth state safely
    const checkAuth = () => {
      try {
        setUser(authApi.getUser());
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      }
    };
    
    checkAuth();
    
    // Listen to storage changes (for logout in other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check on route changes
    const interval = setInterval(checkAuth, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[999] border-b border-white/10 bg-gradient-to-b from-black/80 via-black/90 to-black/95 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-400/90 to-sky-400/90 shadow-xl shadow-fuchsia-500/50" />
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-fuchsia-100">
                Sultan
              </div>
              <div className="text-sm font-bold text-white">Nails Studio</div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group rounded-full px-4 py-2.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin' : '/area-utente'}
                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-fuchsia-500/40 hover:shadow-fuchsia-500/60 hover:-translate-y-1 transition-all duration-200"
              >
                {user.role === 'admin' ? 'Admin' : 'Area Utente'}
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-fuchsia-500/40 hover:shadow-fuchsia-500/60 hover:-translate-y-1 transition-all duration-200"
              >
                Accedi
              </Link>
            )}
          </nav>

          <button
            className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Apri menu"
          >
            <div className="flex flex-col gap-1.5 p-1">
              <span className="block h-[2px] w-6 rounded-full bg-white transition-all group-hover:w-5" />
              <span className="block h-[2px] w-5 rounded-full bg-white/80 transition-all group-hover:w-6" />
              <span className="block h-[2px] w-6 rounded-full bg-white transition-all group-hover:w-5" />
            </div>
          </button>
        </div>
      </header>

      {/* SIDEBAR MODALE - FUORI DALL'HEADER PER COPRIRE TUTTO LO SCHERMO */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-md md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[1001] w-[75vw] max-w-sm border-r border-white/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.95)] backdrop-blur-xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Background Layer */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0f0f18] to-[#080810] opacity-95" />
              <div className="absolute inset-0 bg-[#0c0c13]/98" />

              {/* Content */}
              <div className="relative z-10 h-full overflow-y-auto">
                {/* Profile Header */}
                <div className="p-8 pb-6 border-b border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-fuchsia-400/30 to-sky-400/30 border-4 border-white/20 shadow-2xl" />
                        <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-2xl bg-gradient-to-r from-fuchsia-400 to-rose-400 shadow-xl animate-pulse" />
                      </div>
                      <div>
                        <div className="text-sm uppercase tracking-[0.3em] text-fuchsia-200 mb-1">
                          Studio
                        </div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-white via-fuchsia-100/90 to-white bg-clip-text text-transparent">
                          Sultan Nails
                        </h1>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 0.95 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={close}
                      className="p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      <svg
                        className="h-6 w-6 text-white/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  </div>
                  <div className="space-y-1 text-sm text-white/70">
                    <div>Via Vittoria 18, Brescia</div>
                    <div className="text-xs uppercase tracking-wider text-fuchsia-200/80">
                      Mar-Sab 10-19
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="px-8 py-8 space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="group flex items-center gap-4 p-5 rounded-3xl text-lg font-bold text-white/90 bg-white/5 border border-white/10 hover:bg-white/15 hover:text-white hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all duration-300"
                    >
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-fuchsia-400 to-sky-400 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                      <span>{link.label}</span>
                    </motion.a>
                  ))}
                </nav>

                {/* CTA */}
                <div className="px-8 pb-10 pt-4 border-t border-white/10 space-y-4">
                  {user ? (
                    <motion.a
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      href={user.role === 'admin' ? '/admin' : '/area-utente'}
                      onClick={close}
                      className="w-full flex items-center justify-center gap-3 rounded-4xl bg-gradient-to-r from-fuchsia-500 via-rose-500 to-fuchsia-600 px-8 py-6 text-xl font-black text-white shadow-2xl shadow-fuchsia-500/50 hover:shadow-fuchsia-500/70 transition-all duration-300"
                    >
                      {user.role === 'admin' ? 'Admin' : 'Area Utente'}
                    </motion.a>
                  ) : (
                    <motion.a
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      href="/login"
                      onClick={close}
                      className="w-full flex items-center justify-center gap-3 rounded-4xl bg-gradient-to-r from-fuchsia-500 via-rose-500 to-fuchsia-600 px-8 py-6 text-xl font-black text-white shadow-2xl shadow-fuchsia-500/50 hover:shadow-fuchsia-500/70 transition-all duration-300"
                    >
                      Accedi
                    </motion.a>
                  )}
                  <a
                    href="tel:+393401234567"
                    className="block w-full rounded-2xl border-2 border-white/30 bg-white/10 px-6 py-4 text-center font-bold text-white backdrop-blur-sm hover:border-white hover:bg-white/20 transition-all duration-200"
                  >
                    📞 +39 340 123 4567
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
