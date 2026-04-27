import Header from "../components/Header";
import Link from "next/link";

const services = [
  {
    title: "Signature Gel",
    description: "Copertura in gel ultra-sottile, equilibrio perfetto tra resistenza e luce.",
    price: "da 60€",
    highlight: "Durata 3+ settimane",
    details: [
      "Preparazione completa della lamina ungueale",
      "Applicazione gel premium ultra-sottile",
      "Finiture con lampada UV/LED professionale",
      "Olio curativo alle vitamine in chiusura",
    ],
  },
  {
    title: "Luxe Manicure Spa",
    description: "Esfoliazione, maschera idratante, massaggio e smalto long-wear.",
    price: "da 55€",
    highlight: "Effetto pelle di seta",
    details: [
      "Bagno termale con oli essenziali",
      "Esfoliazione delicata con scrub naturale",
      "Maschera nutriente e idratante",
      "Massaggio rilassante mani e avambracci",
    ],
  },
  {
    title: "Pedicure Glow",
    description: "Pedicure estetica + trattamento screpolature e finish luminoso.",
    price: "da 65€",
    highlight: "Relax totale",
    details: [
      "Pediluvio termale con sali marini",
      "Rimozione cuticole e callus professionale",
      "Trattamento intensivo anti-screpolature",
      "Massaggio piedi e polpacci",
    ],
  },
  {
    title: "Nail Art Couture",
    description: "Design su misura, micro-dettagli, foil e pigmenti specchio premium.",
    price: "su richiesta",
    highlight: "Solo su appuntamento",
    details: [
      "Consulenza personalizzata per il design",
      "Tecniche avanzate: chrome, cat-eye, foil",
      "Decorazioni 3D e cristalli Swarovski",
      "Pigmenti speciali effetto specchio",
    ],
  },
  {
    title: "Refill & Ritocco",
    description: "Mantenimento unghie gel con ritocco della ricrescita.",
    price: "da 45€",
    highlight: "Ogni 3–4 settimane",
    details: [
      "Limatura e preparazione della ricrescita",
      "Applicazione gel per uniformare",
      "Rimodellamento della forma",
      "Lucidatura e sigillatura",
    ],
  },
  {
    title: "Rimozione Gel",
    description: "Rimozione sicura e delicata con trattamento rigenerante.",
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

const perché = [
  { title: "Prodotti Premium", desc: "Solo prodotti certificati e di alta qualità" },
  { title: "Design Personalizzato", desc: "Ogni set è unico e creato su misura per te" },
  { title: "Durata Garantita", desc: "Fino a 4 settimane senza sbeccature" },
  { title: "Igiene Totale", desc: "Sterilizzazione professionale di tutti gli strumenti" },
  { title: "Trattamenti Naturali", desc: "Oli essenziali e ingredienti botanici" },
  { title: "Esperienza Luxury", desc: "Ambiente privato e rilassante" },
];

export default function ServiziPage() {
  return (
    <>
      <Header />
      <main className="text-neutral-900" style={{ paddingTop: 68 }}>

        {/* ─── PAGE HEADER ─── */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              Servizi
            </p>
            <h1 className="text-4xl font-light leading-tight tracking-wide text-neutral-900 sm:text-5xl">
              I nostri trattamenti esclusivi
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-500 font-light leading-relaxed">
              Ogni servizio è pensato per offrirti un'esperienza unica, con prodotti di alta qualità
              e l'attenzione ai dettagli che ci contraddistingue.
            </p>
          </div>
        </section>

        {/* ─── SERVICES GRID ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <article
                key={s.title}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-7 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h2 className="text-xl font-medium text-neutral-900">{s.title}</h2>
                  <span className="shrink-0 rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
                    {s.price}
                  </span>
                </div>
                <p className="mb-3 text-sm text-neutral-500 font-light leading-relaxed">
                  {s.description}
                </p>
                <p className="mb-5 text-xs font-medium uppercase tracking-widest text-neutral-400">
                  {s.highlight}
                </p>
                <ul className="mb-6 flex-1 space-y-2">
                  {s.details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-neutral-500 font-light">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                      {d}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block w-full rounded-full bg-neutral-900 py-3 text-center text-sm font-semibold text-white hover:bg-neutral-700 transition-colors"
                >
                  Prenota questo servizio
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ─── WHY US ─── */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
            <div className="mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
                Perché sceglierci
              </p>
              <h2 className="text-3xl font-light tracking-wide text-neutral-900">
                Sultan Nails, la differenza si vede
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {perché.map((item) => (
                <div key={item.title} className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="mb-3 h-px w-8 bg-neutral-300" />
                  <h3 className="mb-1 font-medium text-neutral-900">{item.title}</h3>
                  <p className="text-sm text-neutral-500 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="rounded-3xl bg-neutral-900 px-8 py-14 text-center text-white sm:px-16">
            <h2 className="text-3xl font-light tracking-wide">
              Pronta per il tuo prossimo appuntamento?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-400 font-light">
              Contattaci per prenotare il tuo servizio o per ricevere una consulenza personalizzata.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition"
              >
                Prenota Online
              </Link>
              <a
                href="tel:+393391862999"
                className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white hover:border-white/50 transition"
              >
                Chiamaci
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
