import Header from "../components/Header";
import Link from "next/link";

const packages = [
  {
    name: "Reset Express",
    tagline: "Veloce e impeccabile",
    price: "45€",
    duration: "45 min",
    description: "Perfetto per chi ha poco tempo ma vuole un risultato impeccabile",
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

        {/* ─── HERO ─── */}
        <section className="border-b border-white/10 px-6 pb-12 pt-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
              pacchetti.exe
            </p>
            <h1 className="font-poster text-5xl uppercase tracking-tight text-white sm:text-6xl">
              Scegli il tuo<br />pacchetto
            </h1>
            <p className="mt-4 max-w-2xl font-hud text-[11px] uppercase leading-7 tracking-[0.16em] text-white/70">
              Dai trattamenti express alle esperienze luxury complete. Ogni pacchetto è studiato
              per offrirti il massimo valore e qualità.
            </p>
          </div>
        </section>

        {/* ─── PACKAGES GRID ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-2">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className="flex flex-col border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]"
              >
                {/* Title bar */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                  <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">
                    {pkg.name}.exe
                  </span>
                  <div className="flex gap-1">
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                  </div>
                </div>

                {/* Menu strip */}
                <div className="flex gap-4 border-b border-white/30 bg-[#c9c9c9] px-3 py-1">
                  {["File", "Edit", "View", "Help"].map((m) => (
                    <span key={m} className="font-hud text-[8px] uppercase tracking-wider text-[#1a1a1a]">{m}</span>
                  ))}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Badge */}
                  <span className="mb-4 w-fit border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] px-3 py-1 font-hud text-[8px] uppercase tracking-[0.2em] text-white">
                    {pkg.badge}
                  </span>

                  {/* Header */}
                  <div className="mb-4">
                    <h2 className="font-poster text-2xl uppercase tracking-tight text-[#1a1a1a]">
                      {pkg.name}
                    </h2>
                    <p className="mt-1 font-hud text-[9px] uppercase tracking-[0.14em] text-[#0817a3]">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price & Duration */}
                  <div className="mb-5 flex items-baseline gap-3 border-b border-white/50 pb-5">
                    <span className="font-poster text-3xl text-[#1a1a1a]">{pkg.price}</span>
                    <span className="font-hud text-[9px] uppercase tracking-[0.14em] text-[#555]">{pkg.duration}</span>
                  </div>

                  {/* Description */}
                  <p className="mb-5 font-hud text-[9px] uppercase leading-6 tracking-[0.12em] text-[#444]">
                    {pkg.description}
                  </p>

                  {/* Includes */}
                  <div className="mb-5 flex-1">
                    <p className="mb-3 font-hud text-[8px] uppercase tracking-[0.28em] text-[#0817a3]">
                      Include
                    </p>
                    <ul className="space-y-2">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 font-hud text-[9px] uppercase leading-5 tracking-[0.1em] text-[#333]">
                          <span className="mt-2 h-px w-3 shrink-0 bg-[#ff4fb3]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ideal For */}
                  <div className="mb-5 border border-white/50 bg-white/30 px-4 py-3">
                    <p className="font-hud text-[8px] uppercase tracking-[0.24em] text-[#0817a3]">
                      Ideale per
                    </p>
                    <p className="mt-1 font-hud text-[9px] uppercase tracking-[0.1em] text-[#333]">
                      {pkg.ideal}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/login"
                    className="block w-full border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] py-3 text-center font-hud text-[9px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
                  >
                    Prenota Online
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── SUBSCRIPTIONS ─── */}
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12">
              <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
                risparmia ogni mese
              </p>
              <h2 className="font-poster text-3xl uppercase tracking-tight text-white sm:text-4xl">
                Abbonamenti
              </h2>
              <p className="mt-3 font-hud text-[10px] uppercase leading-6 tracking-[0.14em] text-white/60">
                Mantieni le tue unghie sempre perfette con i nostri abbonamenti esclusivi.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {subscriptions.map((sub) => (
                <div
                  key={sub.title}
                  className="flex flex-col border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]"
                >
                  {/* Title bar */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                    <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">
                      {sub.title}.exe
                    </span>
                    <div className="flex gap-1">
                      <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                      <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                      <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-4 w-fit border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-white/90 px-3 py-1 font-hud text-[8px] uppercase tracking-[0.2em] text-[#1a1a1a]">
                      {sub.savings}
                    </span>
                    <h3 className="font-poster text-2xl uppercase tracking-tight text-[#1a1a1a]">
                      {sub.title}
                    </h3>
                    <p className="mt-2 mb-6 font-poster text-3xl text-[#1a1a1a]">
                      {sub.price}
                    </p>
                    <ul className="mb-8 flex-1 space-y-2">
                      {sub.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 font-hud text-[9px] uppercase leading-5 tracking-[0.1em] text-[#333]">
                          <span className="mt-2 h-px w-3 shrink-0 bg-[#ff4fb3]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="https://wa.me/393391862999"
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-white/90 py-3 text-center font-hud text-[9px] uppercase tracking-[0.2em] text-[#1a1a1a] shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
                    >
                      Richiedi info
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GIFT CARDS ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]">
            {/* Title bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
              <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">giftcard.exe</span>
              <div className="flex gap-1">
                <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
              </div>
            </div>
            <div className="p-8">
              <p className="mb-2 font-hud text-[10px] uppercase tracking-[0.3em] text-[#ff4fb3]">Regalo</p>
              <h3 className="mb-4 font-poster text-3xl uppercase tracking-tight text-[#1a1a1a]">
                Gift Card
              </h3>
              <p className="mb-8 max-w-2xl font-hud text-[9px] uppercase leading-6 tracking-[0.12em] text-[#444]">
                Regala un'esperienza di bellezza! Le nostre gift card sono disponibili per qualsiasi importo
                e possono essere utilizzate per tutti i servizi.
              </p>
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                {["50€", "100€", "150€"].map((amount) => (
                  <div
                    key={amount}
                    className="border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-white/80 p-6 text-center shadow-[3px_3px_0_rgba(0,0,0,0.1)]"
                  >
                    <div className="font-poster text-3xl text-[#1a1a1a]">{amount}</div>
                    <div className="mt-1 font-hud text-[8px] uppercase tracking-[0.2em] text-[#555]">Gift Card</div>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/393391862999"
                target="_blank"
                rel="noreferrer"
                className="inline-block border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] px-8 py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
              >
                Acquista Gift Card
              </a>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
              faq.exe
            </p>
            <h3 className="mb-10 font-poster text-3xl uppercase tracking-tight text-white">
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
                  className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
                >
                  <p className="mb-2 font-hud text-[9px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]">
                    {faq.q}
                  </p>
                  <p className="font-hud text-[9px] uppercase leading-6 tracking-[0.1em] text-[#555]">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA FINALE ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] p-10 text-center shadow-[8px_8px_0_rgba(0,0,0,0.3)]">
            <div className="mb-4 font-hud text-[9px] uppercase tracking-[0.3em] text-[#0817a3]">
              booking.exe
            </div>
            <h2 className="font-poster text-3xl uppercase tracking-tight text-[#1a1a1a] sm:text-4xl">
              Prenota il tuo<br />pacchetto
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-hud text-[10px] uppercase leading-6 tracking-[0.14em] text-[#444]">
              Contattaci per prenotare il tuo pacchetto preferito o per avere
              più informazioni. Il nostro team è a tua disposizione!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-white/90 px-8 py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a] shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
              >
                Prenota Online
              </Link>
              <Link
                href="/contatti"
                className="border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] px-8 py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
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