import Header from "../components/Header";

const contactMethods = [
  {
    icon: "📱",
    title: "WhatsApp",
    description: "Il modo più veloce per prenotare",
    value: "+39 339 186 2999",
    link: "https://wa.me/393391862999",
    cta: "Scrivici ora",
  },
  {
    icon: "📞",
    title: "Telefono",
    description: "Chiamaci direttamente",
    value: "+39 339 186 2999",
    link: "tel:+393391862999",
    cta: "Chiama ora",
  },
  {
    icon: "✉️",
    title: "Email",
    description: "Per informazioni generali",
    value: "sultan.nails.store@gmail.com",
    link: "sultan.nails.store@gmail.com",
    cta: "Invia email",
  },
  {
    icon: "📍",
    title: "Indirizzo",
    description: "Vieni a trovarci",
    value: "Via Corso Umberto I 52, Casalnuovo di Napoli",
    link: "https://maps.google.com/?q=Via+Corso+Umberto+I+52+Casalnuovo+di+Napoli",
    cta: "Apri in Maps",
  },
];

const openingHours = [
  { day: "Lunedì", hours: "09:00 - 19:00", closed: false },
  { day: "Martedì", hours: "09:00 - 19:00", closed: false },
  { day: "Mercoledì", hours: "09:00 - 19:00", closed: false },
  { day: "Giovedì", hours: "09:00 - 19:00", closed: false },
  { day: "Venerdì", hours: "09:00 - 19:00", closed: false },
  { day: "Sabato", hours: "Chiuso", closed: true },
  { day: "Domenica", hours: "Chiuso", closed: true },
];

const faq = [
  {
    question: "Come posso prenotare un appuntamento?",
    answer:
      "Puoi prenotare tramite WhatsApp, telefono o compilando il form online. Ti risponderemo entro poche ore per confermare data e orario.",
  },
  {
    question: "Quanto tempo prima devo prenotare?",
    answer:
      "Consigliamo di prenotare con almeno 3-5 giorni di anticipo, specialmente per i weekend. Per servizi specifici o eventi speciali, contattaci con più anticipo.",
  },
  {
    question: "Quali metodi di pagamento accettate?",
    answer:
      "Accettiamo contanti, carte di credito/debito, bancomat e pagamenti digitali (Satispay, PayPal). Per gli abbonamenti mensili è possibile impostare il bonifico automatico.",
  },
  {
    question: "Posso cancellare o spostare l'appuntamento?",
    answer:
      "Certo! Ti chiediamo cortesemente di avvisarci almeno 24 ore prima per permetterci di gestire al meglio gli appuntamenti.",
  },
  {
    question: "Offrite servizi a domicilio?",
    answer:
      "Sì, offriamo servizi a domicilio per occasioni speciali come matrimoni o eventi. Contattaci per maggiori informazioni e preventivi personalizzati.",
  },
  {
    question: "I prodotti sono sicuri e certificati?",
    answer:
      "Assolutamente sì! Utilizziamo solo prodotti certificati EU, testati dermatologicamente e di alta qualità. Tutti gli strumenti sono sterilizzati professionalmente.",
  },
];

const socialMedia = [
  {
    name: "Instagram",
    handle: "@sultanyan__",
    icon: "📸",
    link: "https://instagram.com/sultanyan__",
  },
  {
    name: "Facebook",
    handle: "Sultan Nails",
    icon: "👍",
    link: "https://facebook.com/sultannails",
  },
  {
    name: "TikTok",
    handle: "@sultannails",
    icon: "🎵",
    link: "https://tiktok.com/@sultannails",
  },
];

export default function ContattiPage() {
  return (
    <>
      <Header />
      <main className="relative isolate overflow-hidden text-white pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,232,255,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(171,226,255,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#0f1018]/80 to-[#080810]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-8 sm:px-10 lg:px-14">
          {/* Hero Section */}
          <section className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/20 bg-purple-500/5 px-4 py-2 text-xs font-light uppercase tracking-[0.2em] text-purple-100 w-fit">
              Contattaci
            </div>
            <h1 className="text-4xl font-light tracking-wide leading-tight sm:text-5xl lg:text-6xl text-white">
              Siamo qui <span className="text-purple-200 font-thin">per te</span>
            </h1>
            <p className="max-w-3xl text-lg text-white/70 font-light sm:text-xl leading-relaxed">
              Hai domande o vuoi prenotare un appuntamento? Contattaci con il
              metodo che preferisci. Rispondiamo sempre entro poche ore!
            </p>
          </section>

          {/* Contact Methods */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method) => (
              <div
                key={method.title}
                className="group rounded-2xl border border-purple-200/10 bg-purple-500/5 p-6 transition hover:-translate-y-1 hover:border-purple-200/30 hover:bg-purple-500/10"
              >
                <div className="text-4xl mb-4 grayscale brightness-125 opacity-80">{method.icon}</div>
                <h3 className="text-xl font-light text-purple-50 tracking-wide mb-2">{method.title}</h3>
                <p className="text-sm text-white/60 font-light mb-3">
                  {method.description}
                </p>
                <div className="font-medium text-purple-100 mb-4 text-sm">
                  {method.value}
                </div>
                <a
                  href={method.link}
                  target={method.link.startsWith("http") ? "_blank" : undefined}
                  rel={
                    method.link.startsWith("http") ? "noreferrer" : undefined
                  }
                  className="inline-block rounded-full bg-purple-500/10 border border-purple-200/20 px-4 py-2 text-sm font-medium text-purple-100 transition hover:bg-purple-500/20 hover:border-purple-200/40"
                >
                  {method.cta}
                </a>
              </div>
            ))}
          </section>

          {/* Opening Hours */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-purple-200/10 bg-purple-900/5 p-8 space-y-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md">
              <div>
                <h2 className="text-3xl font-light tracking-wide mb-2 text-white">Orari</h2>
                <p className="text-white/60 font-light">
                  Siamo aperti dal lunedì al venerdì
                </p>
              </div>
              <div className="space-y-3">
                {openingHours.map((item) => (
                  <div
                    key={item.day}
                    className={`flex items-center justify-between rounded-xl border border-purple-200/5 bg-purple-500/5 px-5 py-3 ${item.closed ? "opacity-50" : ""
                      }`}
                  >
                    <span className="font-light text-white/90">{item.day}</span>
                    <span
                      className={
                        item.closed ? "text-white/50 font-light" : "text-purple-200 font-medium"
                      }
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-purple-200/10">
                <div className="text-sm text-white/50 font-light">
                  💡 Appuntamenti su prenotazione. Chiuso festivi nazionali.
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="rounded-3xl border border-purple-200/10 bg-gradient-to-br from-purple-500/10 via-white/5 to-sky-400/5 p-8 space-y-6 shadow-inner">
              <div>
                <h2 className="text-3xl font-light tracking-wide mb-2 text-white">Dove siamo</h2>
                <p className="text-white/60 font-light">
                  Nel cuore di Casalnuovo, facilmente raggiungibile
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl grayscale opacity-80">📍</span>
                  <div>
                    <div className="font-medium text-white mb-1">
                      Indirizzo
                    </div>
                    <div className="text-white/70 font-light text-sm leading-relaxed">
                      Via Corso Umberto I 52
                      <br />
                      80013 Casalnuovo di Napoli (NA)
                      <br />
                      Italia
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl grayscale opacity-80">🚗</span>
                  <div>
                    <div className="font-medium text-white mb-1">
                      Parcheggio
                    </div>
                    <div className="text-white/70 font-light text-sm">
                      Parcheggio pubblico a 2 minuti a piedi
                    </div>
                  </div>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/t3w1A8m83u4dVyVW8"
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-full bg-purple-500/10 border border-purple-200/30 px-6 py-3 text-center font-medium text-white transition hover:bg-purple-500/20 hover:border-purple-200/50"
              >
                Apri su Google Maps
              </a>
            </div>
          </section>

          {/* Social Media */}
          <section className="rounded-3xl border border-purple-200/10 bg-purple-900/5 p-8 space-y-6">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-2 text-white">
                Seguici sui social
              </h2>
              <p className="text-white/60 font-light">
                Scopri le nostre ultime creazioni e le novità del momento
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-purple-200/10 bg-purple-500/5 p-5 transition hover:-translate-y-1 hover:border-purple-200/30 hover:bg-purple-500/10"
                >
                  <span className="text-3xl grayscale brightness-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition">{social.icon}</span>
                  <div>
                    <div className="font-medium text-white group-hover:text-purple-200 transition">
                      {social.name}
                    </div>
                    <div className="text-sm text-white/50 font-light">{social.handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-2 text-white">Domande frequenti</h2>
              <p className="text-white/60 font-light">
                Le risposte alle domande più comuni
              </p>
            </div>
            <div className="space-y-4">
              {faq.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-purple-200/10 bg-purple-500/5 p-6 transition hover:bg-purple-500/10"
                >
                  <h3 className="text-lg font-medium mb-2 text-purple-100">
                    {item.question}
                  </h3>
                  <p className="text-white/70 font-light text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency Info */}
          <section className="rounded-3xl border border-purple-200/10 bg-gradient-to-r from-purple-500/15 via-purple-900/20 to-sky-400/20 p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl grayscale brightness-150">⚡</span>
                <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white">
                  Appuntamenti urgenti?
                </h3>
              </div>
              <p className="text-white/70 font-light max-w-2xl">
                Se hai bisogno di un appuntamento urgente o dell'ultimo minuto,
                contattaci direttamente su WhatsApp. Faremo del nostro meglio
                per trovare una soluzione!
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://wa.me/393391862999"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all"
                >
                  Contattaci su WhatsApp
                </a>
                <a
                  href="tel:+393391862999"
                  className="rounded-full border border-purple-200/30 bg-purple-500/10 px-8 py-4 text-base font-medium text-white transition hover:border-purple-200/50 hover:bg-purple-500/20"
                >
                  Chiamaci ora
                </a>
              </div>
            </div>
          </section>

          {/* Privacy Note */}
          <section className="rounded-2xl border border-purple-200/10 bg-purple-500/5 p-6 text-center">
            <p className="text-sm text-white/50 font-light">
              🔒 La tua privacy è importante per noi. Tutti i dati personali
              sono trattati secondo il GDPR e utilizzati esclusivamente per la
              gestione degli appuntamenti.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
