import NavMenu from "./NavMenu";
import s from "./SiteNav.module.css";

export function SiteNav({ maxWidth = 860 }: { maxWidth?: number }) {
  return (
    <nav className={s.nav}>
      <div className={s.navInner} style={{ maxWidth }}>
        <a href="/" className={s.navBrand}>
          <span className={s.navBrandAt}>@ttsalpha/</span>qrcode
        </a>
        <NavMenu />
      </div>
    </nav>
  );
}
