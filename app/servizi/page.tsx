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
      {/* Grain overlay */}
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
              services.exe
            </p>
            <h1 className="font-poster text-5xl uppercase tracking-tight text-white sm:text-6xl">
              I nostri<br />trattamenti
            </h1>
            <p className="mt-4 max-w-2xl font-hud text-[11px] uppercase leading-7 tracking-[0.16em] text-white/70">
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
                className="flex flex-col border-b-2 border-l-2 border-r-2 border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]"
              >
                {/* Title bar */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                  <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">
                    {s.title}.exe
                  </span>
                  <div className="flex gap-1">
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9]" />
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9]" />
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                  </div>
                </div>

                {/* Menu strip */}
                <div className="flex gap-4 border-b border-white/30 bg-[#c9c9c9] px-3 py-1">
                  {["File", "Edit", "View", "Help"].map((m) => (
                    <span key={m} className="font-hud text-[8px] uppercase tracking-wider text-[#1a1a1a]">
                      {m}
                    </span>
                  ))}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-[#0817a3]">
                      {s.highlight}
                    </span>
                    <span className="font-hud text-[10px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]">
                      {s.price}
                    </span>
                  </div>
                  <p className="mb-4 font-hud text-[10px] uppercase leading-6 tracking-[0.12em] text-[#333]">
                    {s.description}
                  </p>
                  <ul className="mb-5 flex-1 space-y-1.5">
                    {s.details.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 font-hud text-[9px] uppercase tracking-[0.1em] text-[#444]"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 bg-[#0817a3]" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className="block w-full border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] py-2.5 text-center font-hud text-[9px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5">
                    Prenota questo servizio
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── WHY US ─── */}
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
                perché noi
              </p>
              <h2 className="font-poster text-3xl uppercase tracking-tight text-white sm:text-4xl">
                Sultan Nails,<br />la differenza si vede
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {perché.map((item) => (
                <div
                  key={item.title}
                  className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
                >
                  <div className="mb-3 h-px w-8 bg-[#0817a3]" />
                  <h3 className="mb-1 font-hud text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]">
                    {item.title}
                  </h3>
                  <p className="font-hud text-[9px] uppercase leading-6 tracking-[0.12em] text-[#444]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] p-10 text-center shadow-[8px_8px_0_rgba(0,0,0,0.3)]">

            {/* Title bar */}
            <div className="mb-6 font-hud text-[9px] uppercase tracking-[0.3em] text-[#0817a3]">
              booking.exe
            </div>

            <h2 className="font-poster text-3xl uppercase tracking-tight text-[#1a1a1a] sm:text-4xl">
              Pronta per il tuo<br />prossimo appuntamento?
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-hud text-[10px] uppercase leading-6 tracking-[0.14em] text-[#444]">
              Contattaci per prenotare il tuo servizio o per una consulenza personalizzata.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-white/90 px-8 py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a] shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
              >
                Prenota Online
              </Link>
              <a
  href="tel:+393391862999"
  className="border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] px-8 py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
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
