"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/servizi" },
  { label: "Palette", href: "/palette" },
  { label: "Packages", href: "/pacchetti" },
  { label: "Book now", href: "/contatti" },
];

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[999] bg-white border-b border-gray-100 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-24 lg:h-28 max-w-[1920px] items-center justify-between px-6 sm:px-10">
          
          {/* Hamburger Mobile */}
          <div className="flex items-center justify-start md:hidden">
            <button 
              className="group flex flex-col gap-[5px] z-[1001] relative" 
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={`h-[2px] w-7 bg-black transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`}></span>
              <span className={`h-[2px] w-7 bg-black transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`h-[2px] w-7 bg-black transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}></span>
            </button>
          </div>

          {/* Navigazione Centrale (Logo + Link PC) */}
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center justify-center w-full gap-4 md:gap-8 lg:gap-12">
              <nav className="hidden items-center gap-10 md:flex lg:gap-16">
                {navLinks.slice(0, 2).map((link) => (
                  <Link key={link.href} href={link.href} className="text-[13px] font-black uppercase tracking-tighter text-black transition-opacity hover:opacity-50">
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Link href="/" className="mx-4 shrink-0 flex items-center justify-center">
                <img
                  src="/laura_fluxx.png"
                  alt="L'aura Flux"
                  className="h-auto w-32 sm:w-44 lg:w-56 object-contain" 
                  style={{ maxHeight: '85px' }} 
                />
              </Link>

              <nav className="hidden items-center gap-10 md:flex lg:gap-16">
                {navLinks.slice(2).map((link) => (
                  <Link key={link.href} href={link.href} className="text-[13px] font-black uppercase tracking-tighter text-black transition-opacity hover:opacity-50">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Lente Mobile */}
          <div className="flex items-center justify-end md:hidden">
            <button aria-label="Search" className="text-black">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* --- SIDEBAR MOBILE --- */}
      <div 
        className={`fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed top-0 left-0 z-[1000] h-full w-[85%] max-w-[320px] bg-white p-10 shadow-2xl transition-transform duration-500 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-6">
  <div className="mb-10 -ml-7">
    <img src="/laura_fluxx.png" alt="Logo" className="w-40 h-auto" />
  </div>

          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                /* 
                   HOVER SIDEBAR: 
                   - Opacity 50% al passaggio (come nell'header)
                   - Leggero spostamento a destra (translate-x-2) per dinamismo
                */
                className="text-3xl font-black uppercase tracking-tighter text-black transition-all duration-300 hover:opacity-50 hover:translate-x-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-gray-100 pt-8 pb-6">

  {/* Login button */}
  <Link
    href="/login"
    onClick={() => setIsOpen(false)}
    className="inline-flex items-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-[0.18em] text-black hover:opacity-50 transition-opacity"
  >
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
    Login
  </Link>

  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Follow us</p>
           <div className="flex gap-6 font-black uppercase text-[11px] tracking-tighter">
  <a
    href="https://www.instagram.com/sultannails_/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:opacity-50 transition-opacity"
  >
    Instagram
  </a>
  <a
    href="https://www.tiktok.com/@sultannails_"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:opacity-50 transition-opacity"
  >
    TikTok
  </a>
</div>
          </div>
        </div>
      </aside>
    </>
  );
}