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
  { name: "Glossy", description: "Finitura super lucida e brillante. Effetto specchio ad alta lucentezza." },
  { name: "Matte", description: "Finitura opaca elegante. Texture vellutata senza riflessi." },
  { name: "Chrome", description: "Effetto specchio metallico. Riflesso cromato ultra-lucido." },
  { name: "Velvet", description: "Texture vellutata premium. Effetto pelliccia morbida al tatto." },
  { name: "Shimmer", description: "Finish perlato luminoso. Micro-glitter che catturano la luce." },
  { name: "Cat Eye", description: "Effetto magnetico 3D. Striscia magnetica che cambia con la luce." },
];

export default function PalettePage() {
  return (
    <>
      <Header />
      <main className="text-neutral-900" style={{ paddingTop: 68 }}>

        {/* ─── PAGE HEADER ─── */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              Palette
            </p>
            <h1 className="text-4xl font-light leading-tight tracking-wide text-neutral-900 sm:text-5xl">
              Oltre 120 tonalità selezionate
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-500 font-light leading-relaxed">
              Pigmenti premium certificati EU, aggiornati ogni stagione. Ogni colore è testato
              per garantire fedeltà cromatica e durata eccezionale.
            </p>
          </div>
        </section>

        {/* ─── FINITURE ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              Effetti disponibili
            </p>
            <h2 className="text-3xl font-light tracking-wide text-neutral-900">
              Finiture
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {finishes.map((f) => (
              <div
                key={f.name}
                className="rounded-2xl border border-neutral-200 bg-white p-6 hover:shadow-sm transition"
              >
                <h3 className="mb-2 text-base font-medium text-neutral-900">{f.name}</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── COLLEZIONI ─── */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14 space-y-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
                Collezioni
              </p>
              <h2 className="text-3xl font-light tracking-wide text-neutral-900">
                Le nostre palette cromatiche
              </h2>
            </div>

            {collections.map((col) => (
              <div
                key={col.name}
                className="rounded-2xl border border-neutral-200 bg-white p-7"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-neutral-900">{col.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500 font-light">{col.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {col.colors.map((color) => (
                    <div key={color.name} className="group">
                      <div
                        className="mb-3 h-20 w-full rounded-xl border border-neutral-200"
                        style={{ backgroundColor: color.hex }}
                      />
                      <p className="text-sm font-medium text-neutral-900">{color.name}</p>
                      <p className="text-xs text-neutral-500 font-light">{color.tone}</p>
                      <p className="mt-0.5 font-mono text-xs text-neutral-300">{color.hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="rounded-3xl bg-neutral-900 px-8 py-14 text-center text-white sm:px-16">
            <h2 className="text-3xl font-light tracking-wide">
              Non trovi il colore perfetto?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-400 font-light">
              Possiamo creare miscele personalizzate per te! Porta una foto o un campione e lo riprodurremo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/393391862999"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition"
              >
                Prenota consulenza
              </a>
              <a
                href="/servizi"
                className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white hover:border-white/50 transition"
              >
                Vedi i servizi
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
