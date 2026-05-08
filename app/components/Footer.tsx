"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/servizi" },
  { label: "Palette", href: "/palette" },
  { label: "Contact", href: "/contatti" },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="relative z-10 mt-10 px-6 pb-10 sm:px-10">
      <div className="mx-auto max-w-7xl border-t border-white/30 pt-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg">
           <div className="mb-3 font-hud text-sm uppercase tracking-[0.24em] text-white/50">
  ending screen
</div>

<p className="font-hud text-sm uppercase leading-7 tracking-[0.16em] text-white/90">
  Pop poster layouts, glossy buttons, reaction tags and chrome-fueled
  nail moods from Napoli.
</p>
          </div>

        <div className="flex flex-wrap gap-3">
  {links.map((link, index) => (
    <Link
      key={link.href}
      href={link.href}
      className={`inline-flex items-center px-6 py-3 font-hud text-[10px] uppercase tracking-[0.22em] transition-transform duration-200 hover:-translate-y-0.5 ${
        index % 2 === 0
          ? "border-2 border-white/80 bg-white/90 text-[#1a1a1a] shadow-[inset_0_2px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(0,0,0,0.2)]"
          : "border-2 border-[#ff7cc9] bg-[#ff4fb3] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.35),0_10px_24px_rgba(0,0,0,0.18)]"
      }`}
    >
      {link.label}
    </Link>
  ))}
</div>
        </div>

        <div className="mt-8 flex flex-col gap-3 font-hud text-xs uppercase tracking-[0.16em] text-white/60 sm:flex-row sm:items-center sm:justify-between">
  <span>{`(c) ${new Date().getFullYear()} Sultan Nails`}</span>
  <span className="text-white/40">
    instant message aesthetic / playable poster / all rights reserved
  </span>
</div>
      </div>
    </footer>
  );
}