import s from "./PageNav.module.css";
import ThemeToggle from "./ThemeToggle";

export function PageNav({
  maxWidth = 920,
  backHref,
  backLabel = "← Back",
}: {
  maxWidth?: number;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <nav className={s.nav}>
      <div className={s.navInner} style={{ maxWidth }}>
        <a href="/" className={s.navBrand}>
          <span className={s.navBrandAt}>@ttsalpha/</span>qrcode
        </a>
        <div className={s.navRight}>
          {backHref && (
            <a href={backHref} className={s.navBack}>
              {backLabel}
            </a>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
