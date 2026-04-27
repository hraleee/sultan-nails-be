import Header from "../components/Header";
import Link from "next/link";

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
      <main className="text-neutral-900" style={{ paddingTop: 68 }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="border-b border-neutral-200 bg-neutral-50 px-6 py-20 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              Pacchetti &amp; Abbonamenti
            </p>
            <h1 className="max-w-3xl text-4xl font-light leading-tight tracking-tight text-neutral-900 sm:text-5xl">
              Scegli il pacchetto{" "}
              <span className="italic font-extralight">perfetto per te</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-neutral-500 font-light leading-relaxed">
              Dai trattamenti express alle esperienze luxury complete. Ogni
              pacchetto è studiato per offrirti il massimo valore e qualità.
            </p>
          </div>
        </section>

        {/* ─── PACKAGES GRID ─────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-2">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 transition hover:border-neutral-400 hover:shadow-lg"
              >
                {/* Badge */}
                <span className="mb-4 inline-block rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-500 w-fit">
                  {pkg.badge}
                </span>

                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-2xl font-light tracking-wide text-neutral-900">
                    {pkg.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400 font-light">
                    {pkg.tagline}
                  </p>
                </div>

                {/* Price & Duration */}
                <div className="mb-5 flex items-baseline gap-3 border-b border-neutral-100 pb-5">
                  <span className="text-3xl font-light text-neutral-900">{pkg.price}</span>
                  <span className="text-sm text-neutral-400 font-light">{pkg.duration}</span>
                </div>

                {/* Description */}
                <p className="mb-5 text-sm text-neutral-500 font-light leading-relaxed">
                  {pkg.description}
                </p>

                {/* Includes */}
                <div className="mb-6 flex-1">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Include
                  </p>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-600 font-light">
                        <span className="mt-1 h-px w-4 shrink-0 bg-neutral-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal For */}
                <div className="mb-6 rounded-xl bg-neutral-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Ideale per
                  </p>
                  <p className="text-sm text-neutral-600 font-light">{pkg.ideal}</p>
                </div>

                {/* CTA */}
                <Link
                  href="/login"
                  className="block w-full rounded-full bg-neutral-900 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-neutral-700"
                >
                  Prenota Online
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ─── SUBSCRIPTIONS ─────────────────────────────────── */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-14">
            <div className="mb-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                Risparmia ogni mese
              </p>
              <h2 className="text-3xl font-light tracking-wide text-neutral-900">
                Abbonamenti mensili
              </h2>
              <p className="mt-3 text-neutral-500 font-light">
                Mantieni le tue unghie sempre perfette con i nostri abbonamenti esclusivi.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {subscriptions.map((sub) => (
                <div
                  key={sub.title}
                  className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 transition hover:border-neutral-400 hover:shadow-lg"
                >
                  <span className="mb-4 inline-block rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 w-fit">
                    {sub.savings}
                  </span>
                  <h3 className="text-2xl font-light tracking-wide text-neutral-900">
                    {sub.title}
                  </h3>
                  <p className="mt-2 mb-6 text-3xl font-light text-neutral-900">
                    {sub.price}
                  </p>
                  <ul className="mb-8 flex-1 space-y-3">
                    {sub.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-600 font-light">
                        <span className="mt-1 h-px w-4 shrink-0 bg-neutral-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/393391862999"
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-full border border-neutral-300 px-6 py-3.5 text-center text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                  >
                    Richiedi info
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GIFT CARDS ────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-14">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10">
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Regalo</p>
              <h3 className="text-2xl font-light tracking-wide text-neutral-900">
                Gift Card
              </h3>
            </div>
            <p className="mb-8 max-w-2xl text-neutral-500 font-light leading-relaxed">
              Regala un'esperienza di bellezza! Le nostre gift card sono
              disponibili per qualsiasi importo e possono essere utilizzate
              per tutti i servizi.
            </p>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {["50€", "100€", "150€"].map((amount) => (
                <div
                  key={amount}
                  className="rounded-xl border border-neutral-200 bg-white p-6 text-center transition hover:border-neutral-400 hover:shadow-md"
                >
                  <div className="text-2xl font-light text-neutral-900">{amount}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-neutral-400">Gift Card</div>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/393391862999"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              Acquista Gift Card
            </a>
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────────── */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-14">
            <h3 className="mb-10 text-2xl font-light tracking-wide text-neutral-900">
              Domande frequenti
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { q: "Posso modificare un pacchetto?", a: "Certo! Tutti i pacchetti sono personalizzabili" },
                { q: "Come funziona l'abbonamento?", a: "Pagamento mensile con rinnovo automatico o manuale" },
                { q: "Posso regalare un pacchetto?", a: "Sì! Acquista una gift card dell'importo desiderato" },
                { q: "Quanto dura la prenotazione?", a: "Il tempo indicato è stimato, può variare leggermente" },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400"
                >
                  <p className="mb-2 font-medium text-neutral-900">{faq.q}</p>
                  <p className="text-sm text-neutral-500 font-light">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA FINALE ────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-14">
          <div className="rounded-3xl bg-neutral-900 px-8 py-16 text-center text-white sm:px-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              Pronta?
            </p>
            <h2 className="text-3xl font-light leading-snug tracking-wide sm:text-4xl">
              Prenota il tuo pacchetto
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-400 font-light leading-relaxed">
              Contattaci per prenotare il tuo pacchetto preferito o per avere
              più informazioni. Il nostro team è a tua disposizione!
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition"
              >
                Prenota Online
              </Link>
              <Link
                href="/contatti"
                className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white hover:border-white/50 hover:bg-white/5 transition"
              >
                Tutti i contatti
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
