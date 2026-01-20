import Header from "../components/Header";

const collections = [
  {
    name: "Classic Elegance",
    description: "Tonalità senza tempo per un look sofisticato",
    colors: [
      { name: "French White", hex: "#FFFFFF", tone: "Bianco puro" },
      { name: "Nude Beige", hex: "#E8D4C0", tone: "Beige naturale" },
      { name: "Soft Pink", hex: "#F5C7D4", tone: "Rosa delicato" },
      { name: "Ballet Slipper", hex: "#F0D9E1", tone: "Rosa ballet" },
    ],
  },
  {
    name: "Pastel Dreams",
    description: "Colori pastello per un tocco di dolcezza",
    colors: [
      { name: "Lavender Mist", hex: "#E6D8F0", tone: "Lavanda chiaro" },
      { name: "Mint Breeze", hex: "#D4F0E8", tone: "Menta pastello" },
      { name: "Peach Blush", hex: "#FFE5D9", tone: "Pesca delicato" },
      { name: "Baby Blue", hex: "#D6E8F5", tone: "Azzurro pastello" },
    ],
  },
  {
    name: "Bold & Beautiful",
    description: "Colori intensi per chi osa",
    colors: [
      { name: "Crimson Red", hex: "#C41E3A", tone: "Rosso cremisi" },
      { name: "Deep Berry", hex: "#8B3A62", tone: "Mora scuro" },
      { name: "Royal Purple", hex: "#6B3FA0", tone: "Viola regale" },
      { name: "Emerald Green", hex: "#0C6B4E", tone: "Verde smeraldo" },
    ],
  },
  {
    name: "Nude Couture",
    description: "Palette nude per ogni carnagione",
    colors: [
      { name: "Porcelain", hex: "#F5E6D3", tone: "Porcellana" },
      { name: "Caramel", hex: "#D4A574", tone: "Caramello" },
      { name: "Cocoa", hex: "#B88A6B", tone: "Cacao" },
      { name: "Mocha", hex: "#A67C5B", tone: "Moka" },
    ],
  },
  {
    name: "Metallic Luxe",
    description: "Finish metallici e cromati premium",
    colors: [
      { name: "Rose Gold", hex: "#E8C4B8", tone: "Oro rosa" },
      { name: "Silver Chrome", hex: "#C0C0C0", tone: "Argento cromato" },
      { name: "Gold Shimmer", hex: "#FFD700", tone: "Oro brillante" },
      { name: "Copper Glow", hex: "#D4926F", tone: "Rame luminoso" },
    ],
  },
  {
    name: "Dark Romance",
    description: "Tonalità scure e misteriose",
    colors: [
      { name: "Black Velvet", hex: "#1C1C1C", tone: "Nero vellutato" },
      { name: "Burgundy Wine", hex: "#6B1F3D", tone: "Bordeaux" },
      { name: "Midnight Blue", hex: "#1A1F4C", tone: "Blu notte" },
      { name: "Forest Green", hex: "#2C4A3A", tone: "Verde foresta" },
    ],
  },
];

const finishes = [
  {
    name: "Glossy",
    icon: "✨",
    description: "Finitura super lucida e brillante",
    effect: "Effetto specchio ad alta lucentezza",
  },
  {
    name: "Matte",
    icon: "🌙",
    description: "Finitura opaca elegante",
    effect: "Texture vellutata senza riflessi",
  },
  {
    name: "Chrome",
    icon: "💎",
    description: "Effetto specchio metallico",
    effect: "Riflesso cromato ultra-lucido",
  },
  {
    name: "Velvet",
    icon: "🎀",
    description: "Texture vellutata premium",
    effect: "Effetto pelliccia morbida al tatto",
  },
  {
    name: "Shimmer",
    icon: "⭐",
    description: "Finish perlato luminoso",
    effect: "Micro-glitter che catturano la luce",
  },
  {
    name: "Cat Eye",
    icon: "👁️",
    description: "Effetto magnetico 3D",
    effect: "Striscia magnetica che cambia con la luce",
  },
];

export default function PalettePage() {
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
              Palette Colori
            </div>
            <h1 className="text-4xl font-light tracking-wide leading-tight sm:text-5xl lg:text-6xl text-white">
              Oltre 120 <span className="text-purple-200 font-thin">tonalità selezionate</span>
            </h1>
            <p className="max-w-3xl text-lg text-white/70 font-light sm:text-xl leading-relaxed">
              Pigmenti premium certificati EU, aggiornati ogni stagione. Ogni
              colore è testato per garantire fedeltà cromatica e durata
              eccezionale.
            </p>
          </section>

          {/* Finishes Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-2 text-white">
                Finiture disponibili
              </h2>
              <p className="text-white/60 font-light">
                Scegli l'effetto perfetto per il tuo stile
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {finishes.map((finish) => (
                <div
                  key={finish.name}
                  className="group rounded-2xl border border-purple-200/10 bg-purple-500/5 p-6 transition hover:-translate-y-1 hover:border-purple-200/30 hover:bg-purple-500/10"
                >
                  <div className="text-4xl mb-3 grayscale brightness-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition">{finish.icon}</div>
                  <h3 className="text-xl font-light text-purple-50 tracking-wide mb-2">{finish.name}</h3>
                  <p className="text-white/70 font-light text-sm mb-2 leading-relaxed">
                    {finish.description}
                  </p>
                  <p className="text-xs text-purple-200/80 font-medium tracking-wide">{finish.effect}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Color Collections */}
          <section className="space-y-8">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-2 text-white">
                Le nostre collezioni
              </h2>
              <p className="text-white/60 font-light">
                Palette cromatiche curate per ogni occasione
              </p>
            </div>

            {collections.map((collection) => (
              <div
                key={collection.name}
                className="rounded-3xl border border-purple-200/10 bg-purple-900/5 p-6 sm:p-8 space-y-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md"
              >
                <div>
                  <h3 className="text-2xl font-light text-white mb-2 tracking-wide">
                    {collection.name}
                  </h3>
                  <p className="text-white/60 font-light">{collection.description}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {collection.colors.map((color) => (
                    <div
                      key={color.name}
                      className="group rounded-2xl border border-purple-200/10 bg-purple-500/5 p-4 transition hover:-translate-y-1 hover:border-purple-200/30 hover:bg-purple-500/10"
                    >
                      <div
                        className="w-full h-24 rounded-xl mb-4 border border-white/10 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="space-y-1">
                        <div className="font-medium text-white group-hover:text-purple-100 transition">
                          {color.name}
                        </div>
                        <div className="text-sm text-white/50 font-light">
                          {color.tone}
                        </div>
                        <div className="text-xs font-mono text-white/30">
                          {color.hex}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Seasonal Updates */}
          <section className="rounded-3xl border border-purple-200/10 bg-gradient-to-r from-purple-500/15 via-white/5 to-sky-400/20 p-8 shadow-inner">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-light uppercase tracking-wider text-purple-200">
                Novità
              </div>
              <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white">
                Collezioni stagionali
              </h3>
              <p className="text-white/70 font-light max-w-2xl leading-relaxed">
                Ogni stagione introduciamo nuove tonalità ispirate alle tendenze
                della moda e del design internazionale. Seguici su Instagram per
                scoprire in anteprima le novità!
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-4">
                {[
                  { season: "Primavera 2024", colors: "12 nuove tonalità" },
                  { season: "Estate 2024", colors: "15 colori vibranti" },
                  { season: "Autunno 2024", colors: "10 sfumature calde" },
                ].map((item) => (
                  <div
                    key={item.season}
                    className="rounded-2xl border border-purple-200/10 bg-purple-500/10 p-4"
                  >
                    <div className="font-medium text-purple-100 mb-1">
                      {item.season}
                    </div>
                    <div className="text-sm text-white/60 font-light">{item.colors}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Custom Color Mixing */}
          <section className="rounded-3xl border border-purple-200/10 bg-purple-900/5 p-8 space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-light tracking-wide mb-3 text-white">
                Non trovi il colore perfetto?
              </h3>
              <p className="text-white/70 font-light max-w-2xl leading-relaxed">
                Possiamo creare miscele personalizzate per te! Porta una foto o
                un campione del colore desiderato e lo riprodurremo con i nostri
                pigmenti premium.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Mix Personalizzato",
                  desc: "Creiamo il tuo colore unico",
                  icon: "🎨",
                },
                {
                  title: "Match Perfetto",
                  desc: "Abbiniamo colori da foto o tessuti",
                  icon: "📸",
                },
                {
                  title: "Consulenza Colore",
                  desc: "Ti aiutiamo a scegliere la tonalità ideale",
                  icon: "💡",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-purple-200/10 bg-purple-500/5 p-5 transition hover:bg-purple-500/10"
                >
                  <div className="text-3xl mb-3 grayscale brightness-125 opacity-80">{feature.icon}</div>
                  <h4 className="font-medium text-purple-100 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-white/60 font-light">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="rounded-3xl border border-purple-200/10 bg-gradient-to-r from-purple-500/15 via-purple-900/20 to-sky-400/20 p-8 text-center shadow-[0_20px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <h3 className="text-3xl font-light tracking-wide mb-4 text-white">
              Vuoi vedere i colori dal vivo?
            </h3>
            <p className="text-white/70 font-light mb-6 max-w-2xl mx-auto leading-relaxed">
              Prenota un appuntamento per una consulenza colore gratuita. Ti
              mostreremo la palette completa e ti aiuteremo a scegliere!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/393391862999"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all"
              >
                Prenota consulenza
              </a>
              <a
                href="/servizi"
                className="rounded-full border border-purple-200/30 bg-purple-500/10 px-8 py-4 text-base font-medium text-white transition hover:border-purple-200/50 hover:bg-purple-500/20"
              >
                Vedi i servizi
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
