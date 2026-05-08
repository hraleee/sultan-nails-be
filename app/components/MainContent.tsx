"use client";

import Link from "next/link";
import styles from "./MainContent.module.css";
import { useState } from "react";
import RetroLoader from "./RetroLoader";

const chatLines = [
  { from: "stylist.exe", text: "hot pink chrome? say less.", side: "left" },
  { from: "you", text: "need something flirty, glossy, chaotic.", side: "right" },
  { from: "stylist.exe", text: "copy that. loading poster-girl protocol.", side: "left" },
];

const profileCards = [
  {
    title: "PROFILE_01",
    subtitle: "nail ritual",
    copy: "Glossy sculpted sets with game-cover energy and instant-messenger attitude.",
  },
  {
    title: "PROFILE_02",
    subtitle: "chrome lab",
    copy: "Mirror finishes, silver flash, hot pink edges and playful retro stickers.",
  },
  {
    title: "PROFILE_03",
    subtitle: "booking open",
    copy: "Direct booking, custom sets and editorial looks built for attention.",
  },
];

const stickerTags = [
  "online now",
  "gloss mode",
  "teen icon",
  "2004 energy",
  "chrome crush",
];

export default function MainContent() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  return (
   <main className={styles.page}>
  {!isVideoReady && (
    <RetroLoader topLabel="booting_sultan_nails.exe" />
  )}

  <div className={styles.background}>
<video
  className={styles.backgroundVideo}
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  onLoadedData={() => setIsVideoReady(true)}
  onCanPlayThrough={() => setIsVideoReady(true)}
  onError={() => setIsVideoReady(true)}
>
  <source src="/bgvideoY2K.webm" type="video/webm" />
  <source src="/bgvideoY2K.mp4" type="video/mp4" />
</video>
  </div>

  <div className={styles.grain} />
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            
            <h1 className={styles.title}>
              Y2K
              <br />
              cyber-pop
              <br />
              nail world
            </h1>
            <p className={styles.lead}>
              Glossy chaos, game-cover drama, instant messenger flirt energy and
              nail sets composed like a teen magazine poster you would tear out
              and keep forever.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/contatti" className={styles.primaryButton}>
                Start the vibe
              </Link>
              <Link href="/palette" className={styles.secondaryButton}>
                See the colors
              </Link>
            </div>

            <div className={styles.stickerRow}>
              {stickerTags.map((tag, index) => (
                <span
                  key={tag}
                  className={`${styles.sticker} ${index % 2 === 0 ? styles.stickerPink : styles.stickerGreen}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.posterFrame}>
              <div className={styles.posterTopBar}>
                <div className={styles.titleBarText}>L'aura_Flux.exe</div>
                <div className={styles.titleBarControls}>
                  <span className={styles.titleButton} />
                  <span className={styles.titleButton} />
                  <span className={styles.titleButton}>x</span>
                </div>
              </div>
              <div className={styles.menuStrip}>
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Options</span>
                <span>Help</span>
              </div>

              <div className={styles.posterMain}>
                <div className={styles.posterPhotoWrap}>
                  <img
                    src="/hero-cyber-chrome.png"
                    alt="Cyber chrome nail art"
                    className={styles.posterPhoto}
                  />
                  <div className={styles.posterBadge}>main character nails</div>
                  <div className={styles.posterSticker}>gloss alert</div>
                </div>

                <div className={styles.posterSidebar}>
                  <div className={styles.phoneCard}>
                    <div className={styles.panelLabel}>chat drop</div>
                    <img
                      src="/phoneimg.jpg"
                      alt="Retro flip phone moodboard"
                      className={styles.phoneImage}
                    />
                  </div>

                  <div className={styles.miniProfile}>
                    <div className={styles.panelLabel}>status</div>
                    <div className={styles.profileName}>L'aura Flux online</div>
                    <div className={styles.profileMeta}>Napoli / chrome crush / booking open</div>
                  </div>
                </div>
              </div>

              <div className={styles.posterFooter}>
                <div className={styles.footerThumbs}>
                  <div className={styles.thumb}>
                    <img src="/phoneimg.jpg" alt="" className={styles.thumbImage} />
                  </div>
                  <div className={styles.thumb}>
                    <img src="/hero-cyber-chrome.png" alt="" className={styles.thumbImage} />
                  </div>
                  <div className={styles.thumbText}>pick your interaction</div>
                </div>
                <div className={styles.posterTinyText}>
                  playful. glossy. flirty. editorial. nostalgic.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.windowsSection}>
        <div className={styles.windowsGrid}>
          <div className={styles.chatWindow}>
            <div className={styles.windowHeader}>
              <div className={styles.titleBarText}>IM_WINDOW.exe</div>
              <div className={styles.titleBarControls}>
                <span className={styles.titleButton} />
                <span className={styles.titleButton} />
                <span className={styles.titleButton}>x</span>
              </div>
            </div>
            <div className={styles.menuStrip}>
              <span>File</span>
              <span>Chat</span>
              <span>View</span>
              <span>Help</span>
            </div>
            <div className={styles.chatBody}>
              {chatLines.map((line) => (
                <div
                  key={`${line.from}-${line.text}`}
                  className={`${styles.chatLine} ${line.side === "right" ? styles.chatRight : styles.chatLeft}`}
                >
                  <div className={styles.chatMeta}>{line.from}</div>
                  <div className={styles.chatBubble}>{line.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.profileStack}>
            {profileCards.map((card, index) => (
              <article
                key={card.title}
                className={`${styles.profileCard} ${index === 1 ? styles.profileCardTiltLeft : ""} ${index === 2 ? styles.profileCardTiltRight : ""}`}
              >
                <div className={styles.panelLabel}>{card.title}</div>
                <h3 className={styles.profileCardTitle}>{card.subtitle}</h3>
                <p className={styles.profileCardCopy}>{card.copy}</p>
                <span className={styles.profileChip}>add to favorites</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.collageSection}>
        <div className={styles.collageGrid}>
          <article className={`${styles.panel} ${styles.panelLarge}`}>
            <div className={styles.windowHeader}>
              <div className={styles.titleBarText}>Lookbook.exe</div>
              <div className={styles.titleBarControls}>
                <span className={styles.titleButton} />
                <span className={styles.titleButton} />
                <span className={styles.titleButton}>x</span>
              </div>
            </div>
            <div className={styles.menuStrip}>
              <span>File</span>
              <span>Edit</span>
              <span>Image</span>
              <span>Help</span>
            </div>
            <div className={styles.framedImage}>
              <img src="/hero-cyber-chrome.png" alt="Nail artwork" className={styles.framedImageAsset} />
              <div className={styles.framedTag}>chrome fantasy</div>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.panelSmall}`}>
            <div className={styles.windowHeader}>
              <div className={styles.titleBarText}>Reactions.dll</div>
              <div className={styles.titleBarControls}>
                <span className={styles.titleButton} />
                <span className={styles.titleButton} />
                <span className={styles.titleButton}>x</span>
              </div>
            </div>
            <div className={styles.menuStrip}>
              <span>Pack</span>
              <span>Tags</span>
              <span>Send</span>
            </div>
            <div className={styles.reactionCloud}>
              <span className={styles.reaction}>so cute</span>
              <span className={styles.reaction}>obsessed</span>
              <span className={styles.reaction}>need this</span>
              <span className={styles.reaction}>call me</span>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.panelSmall}`}>
            <div className={styles.windowHeader}>
              <div className={styles.titleBarText}>ControlPanel.cpl</div>
              <div className={styles.titleBarControls}>
                <span className={styles.titleButton} />
                <span className={styles.titleButton} />
                <span className={styles.titleButton}>x</span>
              </div>
            </div>
            <div className={styles.menuStrip}>
              <span>Links</span>
              <span>Open</span>
              <span>Setup</span>
            </div>
            <div className={styles.buttonStack}>
              <Link href="/servizi" className={styles.glossyAction}>
                open services
              </Link>
              <Link href="/pacchetti" className={styles.glossyActionSecondary}>
                view packages
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
