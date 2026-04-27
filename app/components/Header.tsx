"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Services", href: "/servizi" },
  { label: "Palette", href: "/palette" },
  { label: "Packages", href: "/pacchetti" },
  { label: "Book now", href: "/contatti" },
];

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 12);

      if (currentY <= 12) {
        setVisible(true);
      } else if (currentY > lastScrollY.current + 6) {
        setVisible(false);
      } else if (currentY < lastScrollY.current - 6) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[999] px-4 pt-4 transition-transform duration-300 sm:px-6 lg:px-8 ${
          visible ? "translate-y-0" : "-translate-y-[140%]"
        }`}
      >
        <div
          className={`mx-auto max-w-[1480px] rounded-[14px] border transition-all duration-300 ${
            scrolled
              ? "border-white/25 bg-[linear-gradient(90deg,rgba(11,11,16,0.88),rgba(26,26,38,0.88),rgba(20,27,38,0.88))] shadow-[0_18px_40px_rgba(0,0,0,0.34)] backdrop-blur-md"
              : "border-white/20 bg-[linear-gradient(90deg,rgba(14,14,18,0.72),rgba(28,26,36,0.72),rgba(17,24,34,0.7))] shadow-[0_14px_30px_rgba(0,0,0,0.24)] backdrop-blur-[6px]"
          }`}
        >
          <div className="relative flex items-center justify-between gap-4 rounded-[14px] border-t border-l border-white/20 border-r border-b border-r-black/35 border-b-black/35 px-4 py-3 sm:px-6">
            <div className="hidden flex-1 items-center gap-3 md:flex">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-[40px] items-center rounded-[10px] border border-white/15 bg-white/5 px-4 font-hud text-[10px] uppercase tracking-[0.18em] text-white/72 transition-colors hover:bg-white/10 hover:text-[#ff53b6]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              className="absolute left-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[10px] border border-white/15 bg-white/5 text-white/80 transition-colors hover:text-[#ff53b6] md:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label="Apri menu"
            >
              <span className="flex flex-col gap-[5px]">
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ${open ? "w-5 translate-y-[6.5px] rotate-45" : "w-5"}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ${open ? "opacity-0" : "w-4"}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ${open ? "w-5 -translate-y-[6.5px] -rotate-45" : "w-5"}`} />
              </span>
            </button>

            <div className="flex flex-1 justify-center md:flex-none">
              <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
                <img
                  src="/logo-header.png"
                  alt="Sultan Nails"
                  className="h-auto w-36 object-contain sm:w-40 md:w-44"
                />
              </Link>
            </div>

            <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
              {navLinks.slice(2).map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex min-h-[40px] items-center rounded-[10px] border px-4 font-hud text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    index === 1
                      ? "border-[#ff53b6]/35 bg-[#ff53b6]/12 text-[#ff87cd] hover:bg-[#ff53b6]/18"
                      : "border-white/15 bg-white/5 text-white/72 hover:bg-white/10 hover:text-[#ff53b6]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[998] bg-black/35 backdrop-blur-[2px] md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute left-4 right-4 top-[88px] rounded-[16px] border border-white/15 bg-[linear-gradient(180deg,rgba(16,16,22,0.96),rgba(25,24,36,0.96))] p-4 shadow-[0_22px_40px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 font-hud text-[9px] uppercase tracking-[0.22em] text-white/45">
              navigation
            </div>
            <div className="flex flex-col gap-3">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`inline-flex min-h-[44px] items-center rounded-[10px] border px-4 font-hud text-[10px] uppercase tracking-[0.18em] ${
                    index === 3
                      ? "border-[#ff53b6]/35 bg-[#ff53b6]/12 text-[#ff87cd]"
                      : "border-white/12 bg-white/5 text-white/78"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
