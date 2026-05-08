import styles from "./RetroLoader.module.css";

type RetroLoaderProps = {
  topLabel?: string;
  title?: string;
  meta?: string;
  soft?: boolean;
};

export default function RetroLoader({
  topLabel = "booting_sultan_nails.exe",
  title = "loading cyber-pop world",
  meta = "please wait / glossy assets / video sync",
  soft = false,
}: RetroLoaderProps) {
  return (
    <div className={`${styles.overlay} ${soft ? styles.overlaySoft : ""}`}>
      <div className={styles.window}>
        <div className={styles.topBar}>
          <span>{topLabel}</span>
          <span className={styles.dots}>...</span>
        </div>
        <div className={styles.body}>
          <div className={styles.title}>{title}</div>
          <div className={styles.bar}>
            <div className={styles.barFill} />
          </div>
          <div className={styles.meta}>{meta}</div>
        </div>
      </div>
    </div>
  );
}
