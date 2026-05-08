import Header from "../components/Header";

const contactMethods = [
  {
    title: "WhatsApp",
    description: "Il modo più veloce per prenotare",
    value: "+39 339 186 2999",
    link: "https://wa.me/393391862999",
    cta: "Scrivici ora",
    external: true,
  },
  {
    title: "Telefono",
    description: "Chiamaci direttamente",
    value: "+39 339 186 2999",
    link: "tel:+393391862999",
    cta: "Chiama ora",
    external: false,
  },
  {
    title: "Email",
    description: "Per informazioni generali",
    value: "sultan.nails.store@gmail.com",
    link: "mailto:sultan.nails.store@gmail.com",
    cta: "Invia email",
    external: false,
  },
  {
    title: "Indirizzo",
    description: "Vieni a trovarci",
    value: "Via Corso Umberto I 52, Casalnuovo di Napoli",
    link: "https://maps.app.goo.gl/t3w1A8m83u4dVyVW8",
    cta: "Apri in Maps",
    external: true,
  },
];

const openingHours = [
  { day: "Lunedì", hours: "09:00 – 19:00", closed: false },
  { day: "Martedì", hours: "09:00 – 19:00", closed: false },
  { day: "Mercoledì", hours: "09:00 – 19:00", closed: false },
  { day: "Giovedì", hours: "09:00 – 19:00", closed: false },
  { day: "Venerdì", hours: "09:00 – 19:00", closed: false },
  { day: "Sabato", hours: "Chiuso", closed: true },
  { day: "Domenica", hours: "Chiuso", closed: true },
];

const faq = [
  {
    question: "Come posso prenotare un appuntamento?",
    answer: "Puoi prenotare tramite WhatsApp, telefono o dal tuo account online. Ti risponderemo entro poche ore per confermare data e orario.",
  },
  {
    question: "Quanto tempo prima devo prenotare?",
    answer: "Consigliamo almeno 3–5 giorni di anticipo, specialmente per i weekend. Per eventi speciali, contattaci prima.",
  },
  {
    question: "Quali metodi di pagamento accettate?",
    answer: "Accettiamo contanti, carte di credito/debito, bancomat e pagamenti digitali (Satispay, PayPal).",
  },
  {
    question: "Posso cancellare o spostare l'appuntamento?",
    answer: "Sì! Ti chiediamo cortesemente di avvisarci almeno 24 ore prima.",
  },
  {
    question: "Offrite servizi a domicilio?",
    answer: "Sì, per occasioni speciali come matrimoni o eventi. Contattaci per informazioni e preventivi.",
  },
  {
    question: "I prodotti sono sicuri e certificati?",
    answer: "Assolutamente sì! Solo prodotti certificati EU, testati dermatologicamente. Strumenti sterilizzati professionalmente.",
  },
];

export default function ContattiPage() {
  return (
    <>
      <Header />

      {/* Background video */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover opacity-60"
        >
          <source src="/bgvideoY2K.webm" type="video/webm" />
          <source src="/bgvideoY2K.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Grain */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="text-white" style={{ paddingTop: 68 }}>

        {/* ─── PAGE HEADER ─── */}
        <section className="border-b border-white/10 px-6 pb-12 pt-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
              contatti.exe
            </p>
            <h1 className="font-poster text-5xl uppercase tracking-tight text-white sm:text-6xl">
              Siamo qui<br />per te
            </h1>
            <p className="mt-4 max-w-2xl font-hud text-[11px] uppercase leading-7 tracking-[0.16em] text-white/70">
              Hai domande o vuoi prenotare? Contattaci con il metodo che preferisci.
              Rispondiamo sempre entro poche ore.
            </p>
          </div>
        </section>

        {/* ─── CONTACT CARDS ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((m, index) => (
              <div
                key={m.title}
                className="flex flex-col border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
              >
                <div className="mb-3 h-px w-8 bg-[#0817a3]" />
                <h3 className="mb-1 font-hud text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                  {m.title}
                </h3>
                <p className="mb-3 font-hud text-[9px] uppercase tracking-[0.12em] text-[#555]">
                  {m.description}
                </p>
                <p className="mb-5 flex-1 font-hud text-[9px] uppercase leading-5 tracking-[0.1em] text-[#1a1a1a] break-all">
                  {m.value}
                </p>
                <a
                  href={m.link}
                  target={m.external ? "_blank" : undefined}
                  rel={m.external ? "noreferrer" : undefined}
                  className={`block w-full border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white py-2 text-center font-hud text-[9px] uppercase tracking-[0.18em] shadow-[3px_3px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5 ${
                    index % 2 === 0
                      ? "bg-white/90 text-[#1a1a1a]"
                      : "bg-[#ff4fb3] text-white"
                  }`}
                >
                  {m.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ORARI + DOVE SIAMO ─── */}
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2">

              {/* Orari */}
              <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]">
                {/* Title bar */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                  <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">orari.exe</span>
                  <div className="flex gap-1">
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-2 font-hud text-[10px] uppercase tracking-[0.2em] text-[#ff4fb3]">Orari</p>
                  <p className="mb-6 font-hud text-[9px] uppercase tracking-[0.12em] text-[#555]">
                    Aperti dal lunedì al venerdì
                  </p>
                  <div className="space-y-2">
                    {openingHours.map((h) => (
                      <div
                        key={h.day}
                        className={`flex items-center justify-between border border-white/40 bg-white/30 px-4 py-2.5 ${
                          h.closed ? "opacity-40" : ""
                        }`}
                      >
                        <span className="font-hud text-[9px] uppercase tracking-[0.12em] text-[#333]">
                          {h.day}
                        </span>
                        <span className={`font-hud text-[9px] uppercase tracking-[0.12em] ${h.closed ? "text-[#888]" : "font-bold text-[#1a1a1a]"}`}>
                          {h.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 font-hud text-[8px] uppercase tracking-[0.14em] text-[#888]">
                    Su prenotazione. Chiuso nei festivi nazionali.
                  </p>
                </div>
              </div>

              {/* Dove siamo */}
              <div className="flex flex-col border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]">
                {/* Title bar */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                  <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">location.exe</span>
                  <div className="flex gap-1">
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 font-hud text-[10px] uppercase tracking-[0.2em] text-[#ff4fb3]">Dove siamo</p>
                  <p className="mb-6 font-hud text-[9px] uppercase tracking-[0.12em] text-[#555]">
                    Nel cuore di Casalnuovo, facilmente raggiungibile
                  </p>
                  <div className="flex-1 space-y-5">
                    <div>
                      <p className="mb-2 font-hud text-[8px] uppercase tracking-[0.28em] text-[#0817a3]">
                        Indirizzo
                      </p>
                      <p className="font-hud text-[9px] uppercase leading-6 tracking-[0.1em] text-[#333]">
                        Via Corso Umberto I 52<br />
                        80013 Casalnuovo di Napoli (NA)<br />
                        Italia
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 font-hud text-[8px] uppercase tracking-[0.28em] text-[#0817a3]">
                        Parcheggio
                      </p>
                      <p className="font-hud text-[9px] uppercase tracking-[0.1em] text-[#333]">
                        Parcheggio pubblico a 2 minuti a piedi
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/t3w1A8m83u4dVyVW8"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 block w-full border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] py-3 text-center font-hud text-[9px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
                  >
                    Apri su Google Maps
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="mb-10">
            <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
              faq.exe
            </p>
            <h2 className="font-poster text-3xl uppercase tracking-tight text-white sm:text-4xl">
              Domande frequenti
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faq.map((item, i) => (
              <div
                key={i}
                className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
              >
                <div className="mb-3 h-px w-6 bg-[#ff4fb3]" />
                <h3 className="mb-2 font-hud text-[9px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]">
                  {item.question}
                </h3>
                <p className="font-hud text-[9px] uppercase leading-6 tracking-[0.1em] text-[#555]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SOCIAL + CTA ─── */}
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 items-start lg:grid-cols-2">

              {/* Social */}
              <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                  <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">social.exe</span>
                  <div className="flex gap-1">
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-2 font-hud text-[10px] uppercase tracking-[0.2em] text-[#ff4fb3]">Social</p>
                  <p className="mb-6 font-hud text-[9px] uppercase tracking-[0.12em] text-[#555]">
                    Seguici sui social
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: "Instagram", handle: "@sultanyan__", href: "https://instagram.com/sultanyan__" },
                      { name: "Facebook", handle: "Sultan Nails", href: "https://facebook.com/sultannails" },
                      { name: "TikTok", handle: "@sultannails", href: "https://tiktok.com/@sultannails" },
                    ].map((s, idx) => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-between border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white px-4 py-3 shadow-[3px_3px_0_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5 ${
                          idx % 2 === 0 ? "bg-white/90" : "bg-[#ff4fb3]"
                        }`}
                      >
                        <span className={`font-hud text-[9px] font-bold uppercase tracking-[0.18em] ${idx % 2 === 0 ? "text-[#1a1a1a]" : "text-white"}`}>
                          {s.name}
                        </span>
                        <span className={`font-hud text-[9px] uppercase tracking-[0.12em] ${idx % 2 === 0 ? "text-[#555]" : "text-white/80"}`}>
                          {s.handle}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA urgente */}
              <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                  <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">urgent.exe</span>
                  <div className="flex gap-1">
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <p className="mb-2 font-hud text-[10px] uppercase tracking-[0.2em] text-[#ff4fb3]">
                    Appuntamento urgente?
                  </p>
                  <h2 className="mb-4 font-poster text-2xl uppercase tracking-tight text-[#1a1a1a]">
                    Scrivici subito<br />su WhatsApp
                  </h2>
                  <p className="mx-auto mb-8 max-w-xs font-hud text-[9px] uppercase leading-6 tracking-[0.1em] text-[#444]">
                    Scrivici direttamente su WhatsApp. Faremo del nostro meglio per trovare una soluzione!
                  </p>
                  <a
                    href="https://wa.me/393391862999"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] px-8 py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
                  >
                    Scrivici su WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── PRIVACY NOTE ─── */}
        <div className="border-t border-white/10 py-6 text-center">
          <p className="font-hud text-[9px] uppercase tracking-[0.16em] text-white/40">
            Dati personali trattati secondo il GDPR, utilizzati esclusivamente per la gestione degli appuntamenti.
          </p>
        </div>

      </main>
    </>
  );
}