import Header from "../components/Header";

const packages = [
  {
    name: "Reset Express",
    tagline: "Veloce e impeccabile",
    price: "45€",
    duration: "45 min",
    description:
      "Perfetto per chi ha poco tempo ma vuole un risultato impeccabile",
    includes: [
      "Shape e limatura professionale",
      "Pulizia cuticole delicata",
      "Smalto long-wear ultra-resistente",
      "Finish lucido o matte",
      "Olio nutriente per cuticole",
    ],
    ideal: "Chi vuole unghie perfette in poco tempo",
    badge: "Express",
  },
  {
    name: "Spa Ritual",
    tagline: "Relax e bellezza",
    price: "70€",
    duration: "90 min",
    description: "Un'esperienza completa di benessere per mani e spirito",
    includes: [
      "Manicure completa con cuticole",
      "Bagno termale con oli essenziali",
      "Scrub esfoliante delicato",
      "Maschera nutriente e idratante",
      "Massaggio rilassante mani e avambracci (15 min)",
      "Smalto long-wear premium",
      "Trattamento anti-età",
    ],
    ideal: "Chi cerca un momento di relax totale",
    badge: "Luxury",
  },
  {
    name: "Iconic Set",
    tagline: "Design couture",
    price: "95€",
    duration: "120 min",
    description: "Il massimo della personalizzazione con nail art esclusiva",
    includes: [
      "Consulenza design personalizzata",
      "Preparazione completa delle unghie",
      "Copertura gel premium ultra-sottile",
      "Nail art su misura (tutte le unghie)",
      "Decorazioni con cristalli Swarovski",
      "Effetti speciali: chrome, cat-eye, foil",
      "Sigillatura e finish premium",
      "Fototessera del design",
    ],
    ideal: "Chi vuole un set unico e personalizzato",
    badge: "Premium",
  },
  {
    name: "Pedicure Delight",
    tagline: "Piedi perfetti",
    price: "65€",
    duration: "75 min",
    description: "Cura completa per piedi morbidi e curati",
    includes: [
      "Pediluvio termale con sali marini",
      "Rimozione professionale di calli e duroni",
      "Scrub esfoliante per piedi",
      "Trattamento anti-screpolature",
      "Massaggio piedi e polpacci (10 min)",
      "Smalto gel o long-wear",
      "Crema idratante intensiva",
    ],
    ideal: "Chi vuole piedi morbidi e perfetti",
    badge: "Relax",
  },
  {
    name: "Complete Glow",
    tagline: "Manicure + Pedicure",
    price: "120€",
    duration: "150 min",
    description: "Il pacchetto completo per mani e piedi perfetti",
    includes: [
      "Manicure spa completa",
      "Pedicure glow completa",
      "Doppio massaggio (mani e piedi)",
      "Trattamenti idratanti premium",
      "Smalto coordinato",
      "Sconto 15€ rispetto ai servizi singoli",
    ],
    ideal: "Chi vuole il pacchetto completo beauty",
    badge: "Best Value",
  },
  {
    name: "Bridal Exclusive",
    tagline: "Per il tuo giorno speciale",
    price: "da 150€",
    duration: "180 min",
    description: "Il trattamento esclusivo per spose con prova design inclusa",
    includes: [
      "Consulenza pre-matrimonio",
      "Prova design gratuita (appuntamento separato)",
      "Manicure e pedicure spa",
      "Nail art da sposa personalizzata",
      "Cristalli Swarovski premium",
      "Trattamento mani anti-età",
      "Kit emergenza per il matrimonio",
      "Disponibilità servizio a domicilio",
    ],
    ideal: "Spose che vogliono unghie perfette",
    badge: "Bridal",
  },
];

const subscriptions = [
  {
    title: "Beauty Monthly",
    price: "150€/mese",
    savings: "Risparmi 30€",
    features: [
      "3 manicure mensili (gel o long-wear)",
      "Refill inclusi",
      "10% sconto su nail art",
      "Priorità prenotazione",
    ],
  },
  {
    title: "Premium Club",
    price: "280€/mese",
    savings: "Risparmi 60€",
    features: [
      "3 manicure + 2 pedicure mensili",
      "Nail art basic inclusa",
      "15% sconto su tutti i servizi extra",
      "Prenotazione prioritaria garantita",
      "Trattamento spa mensile gratuito",
    ],
  },
];

export default function PacchettiPage() {
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
              Pacchetti & Abbonamenti
            </div>
            <h1 className="text-4xl font-light tracking-wide leading-tight sm:text-5xl lg:text-6xl text-white">
              Scegli il pacchetto <span className="text-purple-200 font-thin">perfetto per te</span>
            </h1>
            <p className="max-w-3xl text-lg text-white/70 font-light sm:text-xl leading-relaxed">
              Dai trattamenti express alle esperienze luxury complete. Ogni
              pacchetto è studiato per offrirti il massimo valore e qualità.
            </p>
          </section>

          {/* Packages Grid */}
          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {packages.map((pkg) => (
                <article
                  key={pkg.name}
                  className="group relative overflow-hidden rounded-3xl border border-purple-200/10 bg-purple-500/5 p-6 sm:p-8 shadow-lg transition hover:-translate-y-1 hover:border-purple-200/30 hover:bg-purple-500/10 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 opacity-0 transition group-hover:opacity-100" />

                  <div className="relative space-y-4">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-200/20 px-3 py-1 text-xs font-medium text-purple-100">
                      {pkg.badge}
                    </div>

                    {/* Header */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-white mb-1">
                        {pkg.name}
                      </h2>
                      <p className="text-purple-200/80 text-sm font-medium tracking-wide">
                        {pkg.tagline}
                      </p>
                    </div>

                    {/* Price & Duration */}
                    <div className="flex items-center gap-4 pb-4 border-b border-purple-200/10">
                      <div>
                        <div className="text-3xl font-light text-white">
                          {pkg.price}
                        </div>
                        <div className="text-sm text-white/50 font-light">
                          {pkg.duration}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 font-light leading-relaxed">{pkg.description}</p>

                    {/* Includes */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-white/80">
                        Include:
                      </div>
                      <ul className="space-y-2 text-sm text-white/60 font-light">
                        {pkg.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-300 mt-0.5">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ideal For */}
                    <div className="pt-4 border-t border-purple-200/10">
                      <div className="text-xs uppercase tracking-wider text-white/40 mb-1 font-medium">
                        Ideale per
                      </div>
                      <div className="text-sm text-white/80 font-light">{pkg.ideal}</div>
                    </div>

                    {/* CTA Button */}
                    <a
                      href="https://wa.me/393391862999"
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 px-6 py-4 text-center text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 hover:shadow-purple-500/50"
                    >
                      Prenota {pkg.name}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Subscriptions */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-2 text-white">
                Abbonamenti mensili
              </h2>
              <p className="text-white/60 font-light">
                Risparmia con i nostri abbonamenti e mantieni le tue unghie
                sempre perfette
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {subscriptions.map((sub) => (
                <div
                  key={sub.title}
                  className="rounded-3xl border border-purple-200/10 bg-gradient-to-br from-purple-500/10 via-purple-900/5 to-sky-400/5 p-8 space-y-4 shadow-lg backdrop-blur-sm"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-medium text-green-200">
                    {sub.savings}
                  </div>
                  <h3 className="text-2xl font-light tracking-wide text-white">{sub.title}</h3>
                  <div className="text-3xl font-light text-purple-100">
                    {sub.price}
                  </div>
                  <ul className="space-y-2 text-white/70 font-light">
                    {sub.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-300 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/393391862999"
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-full border border-purple-200/30 bg-purple-500/10 px-6 py-3 text-center font-medium text-white transition hover:bg-purple-500/20 hover:border-purple-200/50"
                  >
                    Richiedi info
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Gift Cards */}
          <section className="rounded-3xl border border-purple-200/10 bg-gradient-to-r from-purple-500/15 via-purple-900/20 to-sky-400/20 p-8 shadow-inner">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl grayscale brightness-125">🎁</span>
                <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white">
                  Gift Card
                </h3>
              </div>
              <p className="text-white/70 font-light max-w-2xl">
                Regala un'esperienza di bellezza! Le nostre gift card sono
                disponibili per qualsiasi importo e possono essere utilizzate
                per tutti i servizi.
              </p>
              <div className="grid gap-3 sm:grid-cols-3 pt-2">
                {["50€", "100€", "150€"].map((amount) => (
                  <div
                    key={amount}
                    className="rounded-2xl border border-purple-200/10 bg-purple-500/10 p-4 text-center transition hover:bg-purple-500/20"
                  >
                    <div className="text-2xl font-light text-white">
                      {amount}
                    </div>
                    <div className="text-sm text-white/50 font-light">Gift Card</div>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/393391862999"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-purple-500/10 border border-purple-200/30 px-6 py-3 font-medium text-white transition hover:bg-purple-500/20 hover:border-purple-200/50"
              >
                Acquista Gift Card
              </a>
            </div>
          </section>

          {/* FAQ Quick */}
          <section className="rounded-3xl border border-purple-200/10 bg-purple-900/5 p-8 space-y-6">
            <h3 className="text-2xl font-light tracking-wide text-white">Domande frequenti</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  q: "Posso modificare un pacchetto?",
                  a: "Certo! Tutti i pacchetti sono personalizzabili",
                },
                {
                  q: "Come funziona l'abbonamento?",
                  a: "Pagamento mensile con rinnovo automatico o manuale",
                },
                {
                  q: "Posso regalare un pacchetto?",
                  a: "Sì! Acquista una gift card dell'importo desiderato",
                },
                {
                  q: "Quanto dura la prenotazione?",
                  a: "Il tempo indicato è stimato, può variare leggermente",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-purple-200/10 bg-purple-500/5 p-5 transition hover:bg-purple-500/10"
                >
                  <div className="font-medium text-purple-100 mb-2">{faq.q}</div>
                  <div className="text-sm text-white/60 font-light">{faq.a}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="rounded-3xl border border-purple-200/10 bg-gradient-to-r from-purple-500/15 via-purple-900/20 to-sky-400/20 p-8 text-center shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <h3 className="text-3xl font-light tracking-wide mb-4 text-white">Pronta a prenotare?</h3>
            <p className="text-white/70 font-light mb-6 max-w-2xl mx-auto leading-relaxed">
              Contattaci per prenotare il tuo pacchetto preferito o per avere
              più informazioni. Il nostro team è a tua disposizione!
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
                href="/contatti"
                className="rounded-full border border-purple-200/30 bg-purple-500/10 px-8 py-4 text-base font-medium text-white transition hover:border-purple-200/50 hover:bg-purple-500/20"
              >
                Tutti i contatti
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
