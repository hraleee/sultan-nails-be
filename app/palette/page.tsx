import Header from "../components/Header";
import Link from "next/link";

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

        {/* ─── PAGE HEADER ─── */}
        <section className="border-b border-white/10 px-6 pb-12 pt-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
              palette.exe
            </p>
            <h1 className="font-poster text-5xl uppercase tracking-tight text-white sm:text-6xl">
              Oltre 120<br />tonalità
            </h1>
            <p className="mt-4 max-w-2xl font-hud text-[11px] uppercase leading-7 tracking-[0.16em] text-white/70">
              Pigmenti premium certificati EU, aggiornati ogni stagione. Ogni colore è testato
              per garantire fedeltà cromatica e durata eccezionale.
            </p>
          </div>
        </section>

        {/* ─── FINITURE ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="mb-10">
            <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
              effetti disponibili
            </p>
            <h2 className="font-poster text-3xl uppercase tracking-tight text-white sm:text-4xl">
              Finiture
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {finishes.map((f) => (
              <div
                key={f.name}
                className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
              >
                <div className="mb-3 h-px w-8 bg-[#0817a3]" />
                <h3 className="mb-1 font-hud text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]">
                  {f.name}
                </h3>
                <p className="font-hud text-[9px] uppercase leading-6 tracking-[0.12em] text-[#444]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── COLLEZIONI ─── */}
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl space-y-10">
            <div>
              <p className="mb-3 font-hud text-[10px] uppercase tracking-[0.35em] text-[#ff7cc9]">
                collezioni
              </p>
              <h2 className="font-poster text-3xl uppercase tracking-tight text-white sm:text-4xl">
                Le nostre palette
              </h2>
            </div>

            {collections.map((col) => (
              <div
                key={col.name}
                className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] shadow-[6px_6px_0_rgba(0,0,0,0.3)]"
              >
                {/* Title bar */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#0817a3] via-[#1736d0] to-[#4f75ff] px-2 py-1.5">
                  <span className="font-hud text-[9px] uppercase tracking-[0.2em] text-white">
                    {col.name}.exe
                  </span>
                  <div className="flex gap-1">
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="h-3 w-3 border border-white/40 bg-[#c9c9c9]" />
                    <span className="flex h-3 w-3 items-center justify-center border border-white/40 bg-[#c9c9c9] font-hud text-[7px] text-black">x</span>
                  </div>
                </div>

                {/* Menu strip */}
                <div className="flex gap-4 border-b border-white/30 bg-[#c9c9c9] px-3 py-1">
                  {["File", "View", "Colors", "Help"].map((m) => (
                    <span key={m} className="font-hud text-[8px] uppercase tracking-wider text-[#1a1a1a]">{m}</span>
                  ))}
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="mb-6 font-hud text-[9px] uppercase tracking-[0.14em] text-[#0817a3]">
                    {col.description}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {col.colors.map((color) => (
                      <div key={color.name}>
                        <div
                          className="mb-3 h-20 w-full border border-white/40 shadow-[inset_2px_2px_0_rgba(255,255,255,0.6),inset_-2px_-2px_0_rgba(0,0,0,0.15)]"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="font-hud text-[9px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]">
                          {color.name}
                        </p>
                        <p className="font-hud text-[8px] uppercase tracking-[0.1em] text-[#555]">
                          {color.tone}
                        </p>
                        <p className="mt-0.5 font-hud text-[8px] tracking-wider text-[#888]">
                          {color.hex}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="border-b-2 border-l-2 border-r border-t-2 border-b-white/20 border-l-white/80 border-r-white/20 border-t-white/80 bg-[#c9c9c9] p-10 text-center shadow-[8px_8px_0_rgba(0,0,0,0.3)]">
            <div className="mb-4 font-hud text-[9px] uppercase tracking-[0.3em] text-[#0817a3]">
              custom.mix.exe
            </div>
            <h2 className="font-poster text-3xl uppercase tracking-tight text-[#1a1a1a] sm:text-4xl">
              Non trovi il<br />colore perfetto?
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-hud text-[10px] uppercase leading-6 tracking-[0.14em] text-[#444]">
              Possiamo creare miscele personalizzate per te! Porta una foto o un campione e lo riprodurremo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/393391862999"
                target="_blank"
                rel="noreferrer"
                className="border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-white/90 px-8 py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a] shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
              >
                Prenota consulenza
              </a>
              <Link
                href="/servizi"
                className="border-b border-l-2 border-r border-t-2 border-b-[#787878] border-l-white border-r-[#787878] border-t-white bg-[#ff4fb3] px-8 py-3 font-hud text-[10px] uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
              >
                Vedi i servizi
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}