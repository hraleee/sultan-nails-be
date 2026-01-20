import Header from "../components/Header";

const services = [
  {
    title: "Signature Gel",
    description:
      "Copertura in gel ultra-sottile, equilibrio perfetto tra resistenza e luce.",
    price: "da 60€",
    highlight: "Durata 3+ settimane",
    details: [
      "Preparazione completa della lamina ungueale",
      "Applicazione gel premium ultra-sottile",
      "Finiture con lampada UV/LED professionale",
      "Finitura con olio curativo alle vitamine",
    ],
  },
  {
    title: "Luxe Manicure Spa",
    description:
      "Esfoliazione, maschera idratante, massaggio e smalto long-wear.",
    price: "da 55€",
    highlight: "Effetto pelle di seta",
    details: [
      "Bagno termale con oli essenziali",
      "Esfoliazione delicata con scrub naturale",
      "Maschera nutriente e idratante",
      "Massaggio rilassante mani e avambracci",
      "Applicazione smalto long-lasting",
    ],
  },
  {
    title: "Pedicure Glow",
    description:
      "Pedicure estetica + trattamento screpolature e finish luminoso.",
    price: "da 65€",
    highlight: "Relax totale",
    details: [
      "Pediluvio termale con sali marini",
      "Rimozione cuticole e callus professionale",
      "Trattamento intensivo anti-screpolature",
      "Massaggio piedi e polpacci",
      "Smalto gel o long-wear",
    ],
  },
  {
    title: "Nail Art Couture",
    description:
      "Design su misura, micro-dettagli, foil e pigmenti specchio premium.",
    price: "su richiesta",
    highlight: "Solo su appuntamento",
    details: [
      "Consulenza personalizzata per il design",
      "Tecniche avanzate: chrome, cat-eye, foil",
      "Decorazioni 3D e cristalli Swarovski",
      "Pigmenti speciali effetto specchio",
      "Finiture durature premium",
    ],
  },
  {
    title: "Refill & Ritocco",
    description: "Mantenimento unghie gel con ritocco della ricrescita.",
    price: "da 45€",
    highlight: "Ogni 3-4 settimane",
    details: [
      "Limatura e preparazione della ricrescita",
      "Applicazione gel per uniformare",
      "Rimodellamento della forma",
      "Lucidatura e sigillatura",
    ],
  },
  {
    title: "Rimozione Gel Completa",
    description:
      "Rimozione sicura e delicata del gel con trattamento rigenerante.",
    price: "da 25€",
    highlight: "Con cura della lamina",
    details: [
      "Rimozione professionale senza danni",
      "Trattamento rigenerante per unghie",
      "Massaggio con olio nutriente",
      "Lucidatura naturale",
    ],
  },
];

export default function ServiziPage() {
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
              Servizi Premium
            </div>
            <h1 className="text-4xl font-light tracking-wide leading-tight sm:text-5xl lg:text-6xl text-white">
              I nostri <span className="text-purple-200 font-thin">trattamenti esclusivi</span>
            </h1>
            <p className="max-w-3xl text-lg text-white/70 font-light sm:text-xl leading-relaxed">
              Ogni servizio è pensato per offrirti un'esperienza unica, con
              prodotti di alta qualità, tecniche all'avanguardia e l'attenzione
              ai dettagli che ci contraddistingue.
            </p>
          </section>

          {/* Services Grid */}
          <section className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group relative overflow-hidden rounded-3xl border border-purple-200/10 bg-purple-500/5 p-6 shadow-lg transition hover:-translate-y-1 hover:border-purple-200/30 hover:bg-purple-500/10 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <h2 className="text-2xl font-light tracking-wide text-white">
                        {service.title}
                      </h2>
                      <span className="rounded-full bg-purple-500/10 border border-purple-200/20 px-4 py-2 text-sm font-medium text-purple-100 whitespace-nowrap">
                        {service.price}
                      </span>
                    </div>
                    <p className="text-white/60 font-light text-base leading-relaxed">
                      {service.description}
                    </p>
                    <span className="text-sm font-medium text-purple-200">
                      ✨ {service.highlight}
                    </span>

                    <div className="mt-2 space-y-2">
                      <div className="text-sm font-medium text-white/80">
                        Include:
                      </div>
                      <ul className="space-y-1.5 text-sm text-white/60 font-light">
                        {service.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-300 mt-0.5">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="https://wa.me/393391862999"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 hover:shadow-purple-500/50"
                    >
                      Prenota questo servizio
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Info Section */}
          <section className="rounded-3xl border border-purple-200/10 bg-purple-900/5 p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <div className="space-y-4">
              <h3 className="text-2xl font-light tracking-wide text-white">
                Perché scegliere Sultan Nails?
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: "💎",
                    title: "Prodotti Premium",
                    desc: "Solo prodotti certificati e di alta qualità",
                  },
                  {
                    icon: "🎨",
                    title: "Design Personalizzato",
                    desc: "Ogni set è unico e creato su misura per te",
                  },
                  {
                    icon: "⏱️",
                    title: "Durata Garantita",
                    desc: "Fino a 4 settimane senza sbeccature",
                  },
                  {
                    icon: "🧼",
                    title: "Igiene Totale",
                    desc: "Sterilizzazione professionale di tutti gli strumenti",
                  },
                  {
                    icon: "🌿",
                    title: "Trattamenti Naturali",
                    desc: "Oli essenziali e ingredienti botanici",
                  },
                  {
                    icon: "✨",
                    title: "Esperienza Luxury",
                    desc: "Ambiente privato e rilassante",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-purple-200/5 bg-purple-500/5 p-5 hover:bg-purple-500/10 transition"
                  >
                    <div className="text-3xl mb-2 grayscale brightness-125 opacity-80">{item.icon}</div>
                    <div className="font-medium text-white mb-1">
                      {item.title}
                    </div>
                    <div className="text-sm text-white/50 font-light">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="rounded-3xl border border-purple-200/10 bg-gradient-to-r from-purple-500/15 via-purple-900/20 to-sky-400/20 p-8 text-center shadow-inner">
            <h3 className="text-3xl font-light tracking-wide mb-4 text-white">
              Pronta per il tuo prossimo appuntamento?
            </h3>
            <p className="text-white/70 font-light mb-6 max-w-2xl mx-auto leading-relaxed">
              Contattaci per prenotare il tuo servizio o per ricevere una
              consulenza personalizzata. Rispondiamo entro poche ore!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/393391862999"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-1 hover:shadow-purple-500/50"
              >
                Prenota su WhatsApp
              </a>
              <a
                href="tel:+393391862999"
                className="rounded-full border border-purple-200/30 bg-purple-500/10 px-8 py-4 text-base font-medium text-white transition hover:border-purple-200/50 hover:bg-purple-500/20"
              >
                Chiamaci ora
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
