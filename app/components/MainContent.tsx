import Link from "next/link";
import BookingButton from "./BookingButton";
export default function MainContent() {
  return (
    <main className="relative isolate text-white min-h-screen -mt-24">  {/* min-h invece di h-screen */}
      {/* Gradienti e overlay su tutto il main */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,232,255,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(171,226,255,0.12),transparent_40%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#0f1018]/80 to-[#080810]" />

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center gap-6 px-6 sm:flex-row sm:items-center sm:justify-between relative">  {/* h-screen solo qui */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/sultannailsvideohome.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 text-center sm:text-left max-w-4xl">
          <div className="relative z-20 flex flex-col items-center gap-8 sm:gap-12 text-center max-w-3xl mx-auto drop-shadow-2xl px-4">
            {/* Badge solo mobile/tablet */}
            <div className="flex lg:hidden justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-purple-400/60 bg-purple-400/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-50 drop-shadow-xl">
                Sultan Nails
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              Unghie couture, <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">rituali spa</span> e design su misura
            </h1>
          </div>

        </div>
      </section>

      {/* Contenuti successivi VISIBILI */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-8 sm:px-10 lg:px-14 z-10">
        {/* Hero Section */}



        {/* About Section */}
        <section className="grid gap-6 rounded-3xl border border-purple-200/10 bg-purple-900/5 p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md lg:grid-cols-[2fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-light tracking-wider text-purple-200">
              Beauty tech · Design sartoriale
            </div>
            <h2 className="text-3xl font-light sm:text-4xl tracking-wide text-white">
              Un rituale per mani e piedi, <br />
              <span className="text-purple-200/80">oltre la semplice manicure</span>
            </h2>
            <p className="text-white/60 font-light leading-relaxed">
              Postazioni private, lampade a spettro controllato, strumenti
              sterilizzati a caldo e pigmenti certificati EU. Protocollo di
              analisi pelle e unghie per creare texture, colori e finish che
              rispecchiano la tua energia.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Clienti felici", value: "950+" },
                { label: "Durata media", value: "3-4 sett." },
                { label: "Pigmenti selezionati", value: "120+" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-purple-200/10 bg-purple-500/5 px-5 py-4 text-sm"
                >
                  <div className="text-xl font-light text-purple-100">
                    {item.value}
                  </div>
                  <div className="text-white/40 font-light text-xs uppercase tracking-wider mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-purple-200/10 bg-gradient-to-br from-purple-500/10 via-white/5 to-sky-400/5 p-8 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,180,254,0.1),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(232,121,249,0.1),transparent_35%)]" />
            <div className="relative flex flex-col gap-4 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.2em] text-purple-200/80 font-light">
                Micro-momenti
              </span>
              <p className="text-base font-light leading-relaxed">
                Mani calde, oli botanici, playlist curata. Ogni fase è lenta,
                mirata e ripetibile.
              </p>
              <ul className="space-y-3 text-white/60 font-light">
                <li className="flex gap-2">
                  <span className="text-purple-300">•</span> Consulto iniziale con prova finish
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-300">•</span> Cuticole "waterless" + vapori
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-300">•</span> Lampada controllata
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-300">•</span> Rifinitura diamond-touch
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Links to Pages */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-light sm:text-4xl text-white tracking-wide">
              Esplora il nostro mondo
            </h2>
            <p className="mt-2 text-white/60 font-light">
              Scopri tutto ciò che abbiamo da offrirti
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Servizi",
                desc: "Trattamenti esclusivi per mani e piedi",
                icon: "💅",
                link: "/servizi",
              },
              {
                title: "Palette",
                desc: "Oltre 120 tonalità selezionate",
                icon: "🎨",
                link: "/palette",
              },
              {
                title: "Pacchetti",
                desc: "Offerte e abbonamenti convenienti",
                icon: "✨",
                link: "/pacchetti",
              },
              {
                title: "Contatti",
                desc: "Prenota il tuo appuntamento",
                icon: "📞",
                link: "/contatti",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.link}
                className="group relative overflow-hidden rounded-3xl border border-purple-200/10 bg-purple-500/5 p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-200/30 hover:bg-purple-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/10 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex flex-col gap-3">
                  <div className="text-4xl grayscale brightness-125 opacity-80">{item.icon}</div>
                  <h3 className="text-xl font-light text-purple-50 tracking-wide">{item.title}</h3>
                  <p className="text-sm text-white/60 font-light">{item.desc}</p>
                  <span className="text-sm font-medium text-purple-200/80 group-hover:text-purple-200 transition-colors">
                    Scopri di più →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Services Preview - Stile About */}
        <section className="grid gap-6 rounded-3xl border border-purple-200/10 bg-purple-900/5 p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md lg:grid-cols-[2fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-light tracking-wider text-purple-200">
              Servizi top
            </div>
            <h2 className="text-3xl font-light sm:text-4xl tracking-wide text-white">
              I nostri servizi <br />
              <span className="text-purple-200/80">più richiesti</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Signature Gel", value: "da 60€" },
                { label: "Luxe Spa", value: "da 55€" },
                { label: "Nail Art", value: "su misura" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-purple-200/10 bg-purple-500/5 px-5 py-4 text-sm">
                  <div className="text-xl font-light text-purple-100">{item.value}</div>
                  <div className="text-white/40 font-light text-xs uppercase tracking-wider mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-purple-200/10 bg-gradient-to-br from-purple-500/10 via-white/5 to-sky-400/5 p-8 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,180,254,0.1),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(232,121,249,0.1),transparent_35%)]" />
            <div className="relative space-y-4 text-sm text-white/80">
              <ul className="space-y-3 font-light">
                <li className="flex gap-2"><span className="text-purple-300">•</span> Copertura gel ultra-sottile 3+ settimane</li>
                <li className="flex gap-2"><span className="text-purple-300">•</span> Esfoliazione, massaggio long-wear</li>
                <li className="flex gap-2"><span className="text-purple-300">•</span> Design couture pigmenti premium</li>
              </ul>
              <a href="/servizi" className="inline-flex items-center gap-2 rounded-full border border-purple-200/30 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-100 hover:border-purple-200/50 hover:bg-purple-500/20 transition">
                Vedi tutti →
              </a>
            </div>
          </div>
        </section>

        {/* Testimonials - Stile About */}
        <section className="grid gap-6 rounded-3xl border border-purple-200/10 bg-purple-900/5 p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md lg:grid-cols-[2fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-light tracking-wider text-purple-200">
              Recensioni reali
            </div>
            <h2 className="text-3xl font-light sm:text-4xl tracking-wide text-white">
              Cosa dicono <br />
              <span className="text-purple-200/80">le nostre clienti</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Napoli", value: "150+" },
                { label: "Rating medio", value: "4.9⭐" },
                { label: "Repeat", value: "85%" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-purple-200/10 bg-purple-500/5 px-5 py-4 text-sm">
                  <div className="text-xl font-light text-purple-100">{item.value}</div>
                  <div className="text-white/40 font-light text-xs uppercase tracking-wider mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-purple-200/10 bg-gradient-to-br from-purple-500/10 via-white/5 to-sky-400/5 p-8 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,180,254,0.1),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(232,121,249,0.1),transparent_35%)]" />
            <div className="relative space-y-4 text-sm text-white/80">
              <div className="text-lg text-fuchsia-200 mb-3">⭐⭐⭐⭐⭐</div>
              <p>"La migliore nail artist di Napoli! Professionalità top e unghie perfette."</p>
              <div className="font-semibold text-white">- Laura M.</div>
            </div>
          </div>
        </section>

        {/* Final CTA - Stile About */}
        <section className="grid gap-6 rounded-3xl border border-purple-200/10 bg-gradient-to-r from-purple-500/15 via-purple-900/20 to-sky-400/20 p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md lg:grid-cols-[2fr_1.1fr]">
          <div className="space-y-6 lg:pr-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-light tracking-wider text-purple-200">
              Ultimo passo
            </div>
            <h2 className="text-3xl font-light sm:text-4xl tracking-wide text-white">
              Pronta per il <br />
              <span className="text-purple-200/80">tuo prossimo set?</span>
            </h2>
            <p className="text-white/80 font-light leading-relaxed max-w-lg">
              Invia foto del look desiderato. Creo proposta personalizzata con tempi e prezzo entro ore.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-purple-200/10 bg-purple-500/10 p-8 shadow-inner grid place-items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,232,255,0.15),transparent_50%)]" />
            <div className="relative flex flex-wrap gap-3 justify-center">
              <a
                href="https://wa.me/393391862999"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 hover:-translate-y-1 transition-all"
              >
                Prenota WhatsApp
              </a>
              <a
                href="/contatti"
                className="rounded-full border-2 border-purple-200/40 bg-purple-500/10 px-8 py-4 text-base font-medium text-purple-100 hover:border-purple-200/60 hover:bg-purple-500/20 transition-all"
              >
                Contatti
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
