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
      <main className="text-neutral-900" style={{ paddingTop: 68 }}>

        {/* ─── PAGE HEADER ─── */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              Contattaci
            </p>
            <h1 className="text-4xl font-light leading-tight tracking-wide text-neutral-900 sm:text-5xl">
              Siamo qui per te
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-500 font-light leading-relaxed">
              Hai domande o vuoi prenotare? Contattaci con il metodo che preferisci.
              Rispondiamo sempre entro poche ore.
            </p>
          </div>
        </section>

        {/* ─── CONTACT CARDS ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((m) => (
              <div
                key={m.title}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <h3 className="mb-1 font-medium text-neutral-900">{m.title}</h3>
                <p className="mb-3 text-sm text-neutral-500 font-light">{m.description}</p>
                <p className="mb-5 flex-1 text-sm font-medium text-neutral-700 break-all">
                  {m.value}
                </p>
                <a
                  href={m.link}
                  target={m.external ? "_blank" : undefined}
                  rel={m.external ? "noreferrer" : undefined}
                  className="inline-block rounded-full border border-neutral-200 px-4 py-2 text-center text-sm font-medium text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition"
                >
                  {m.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ORARI + DOVE SIAMO ─── */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
            <div className="grid gap-8 lg:grid-cols-2">

              {/* Orari */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-8">
                <h2 className="mb-1 text-2xl font-light text-neutral-900">Orari</h2>
                <p className="mb-6 text-sm text-neutral-500 font-light">
                  Aperti dal lunedì al venerdì
                </p>
                <div className="space-y-2">
                  {openingHours.map((h) => (
                    <div
                      key={h.day}
                      className={`flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3 text-sm ${
                        h.closed ? "opacity-40" : ""
                      }`}
                    >
                      <span className="font-light text-neutral-700">{h.day}</span>
                      <span className={h.closed ? "text-neutral-500" : "font-medium text-neutral-900"}>
                        {h.hours}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs text-neutral-400 font-light">
                  Su prenotazione. Chiuso nei festivi nazionali.
                </p>
              </div>

              {/* Dove siamo */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col">
                <h2 className="mb-1 text-2xl font-light text-neutral-900">Dove siamo</h2>
                <p className="mb-6 text-sm text-neutral-500 font-light">
                  Nel cuore di Casalnuovo, facilmente raggiungibile
                </p>
                <div className="flex-1 space-y-5">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                      Indirizzo
                    </p>
                    <p className="text-sm text-neutral-600 font-light leading-relaxed">
                      Via Corso Umberto I 52<br />
                      80013 Casalnuovo di Napoli (NA)<br />
                      Italia
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                      Parcheggio
                    </p>
                    <p className="text-sm text-neutral-600 font-light">
                      Parcheggio pubblico a 2 minuti a piedi
                    </p>
                  </div>
                </div>
                <a
                  href="https://maps.app.goo.gl/t3w1A8m83u4dVyVW8"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 block w-full rounded-full bg-neutral-900 py-3 text-center text-sm font-semibold text-white hover:bg-neutral-700 transition"
                >
                  Apri su Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              FAQ
            </p>
            <h2 className="text-3xl font-light tracking-wide text-neutral-900">
              Domande frequenti
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faq.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <h3 className="mb-2 font-medium text-neutral-900">{item.question}</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SOCIAL + CTA ─── */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
                  Social
                </p>
                <h2 className="mb-6 text-2xl font-light text-neutral-900">
                  Seguici sui social
                </h2>
                <div className="flex flex-col gap-3">
                  {[
                    { name: "Instagram", handle: "@sultanyan__", href: "https://instagram.com/sultanyan__" },
                    { name: "Facebook", handle: "Sultan Nails", href: "https://facebook.com/sultannails" },
                    { name: "TikTok", handle: "@sultannails", href: "https://tiktok.com/@sultannails" },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-3.5 hover:border-neutral-400 hover:shadow-sm transition"
                    >
                      <span className="font-medium text-neutral-900">{s.name}</span>
                      <span className="text-sm text-neutral-500 font-light">{s.handle}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-neutral-900 px-8 py-12 text-center text-white">
                <h2 className="text-2xl font-light">Appuntamento urgente?</h2>
                <p className="mt-3 text-neutral-400 font-light text-sm leading-relaxed">
                  Scrivici direttamente su WhatsApp. Faremo del nostro meglio per trovare una soluzione!
                </p>
                <a
                  href="https://wa.me/393391862999"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition"
                >
                  Scrivici su WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRIVACY NOTE ─── */}
        <div className="border-t border-neutral-200 py-6 text-center">
          <p className="text-xs text-neutral-400 font-light">
            🔒 Dati personali trattati secondo il GDPR, utilizzati esclusivamente per la gestione degli appuntamenti.
          </p>
        </div>

      </main>
    </>
  );
}
