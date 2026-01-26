'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();

    // Nascondi il footer nelle pagine di login e register
    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    return (
        <footer className="bg-transparent py-12 mt-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Logo & Brand */}
                <div className="flex flex-col items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-foreground/10">
                        <Image
                            src="/sultannailslogo.jpg"
                            alt="Sultan Nails Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                        Esaltiamo la tua bellezza con trattamenti unici e personalizzati.
                        Il tuo benessere è la nostra priorità.
                    </p>
                </div>

                {/* Link Rapidi */}
                <div>
                    <h3 className="text-foreground font-semibold mb-4">Esplora</h3>
                    <ul className="space-y-3 text-foreground/70 text-sm">
                        <li><Link href="/" className="hover:text-foreground transition">Home</Link></li>
                        <li><Link href="/servizi" className="hover:text-foreground transition">Servizi</Link></li>
                        <li><Link href="/pacchetti" className="hover:text-foreground transition">Pacchetti</Link></li>
                        <li><Link href="/contatti" className="hover:text-foreground transition">Contatti</Link></li>
                    </ul>
                </div>

                {/* Contatti */}
                <div>
                    <h3 className="text-foreground font-semibold mb-4">Contatti</h3>
                    <ul className="space-y-3 text-foreground/70 text-sm">
                        <li>📍 Casalnuovo di Napoli, Via Corso Umberto I n 52</li>
                        <li>📞 <a href="tel:+393391862999" className="hover:text-foreground">339 186 2999</a></li>
                        <li>✉️ <a href="mailto:sultan.nails.store@gmail.com" className="hover:text-foreground">sultan.nails.store@gmail.com</a></li>
                        <li>⏰ Lun - Ven: 09:00 - 19:00</li>
                    </ul>
                </div>

                {/* Social & Legal */}
                <div>
                    <h3 className="text-foreground font-semibold mb-4">Seguici</h3>
                    <div className="flex gap-4 mb-6">
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground hover:text-background transition">
                            📷
                        </a>
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground hover:text-background transition">
                            📘
                        </a>
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground hover:text-background transition">
                            🎵
                        </a>
                    </div>
                    <p className="text-xs text-foreground/50">
                        © {new Date().getFullYear()} Sultan Nails. <br />Tutti i diritti riservati.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
