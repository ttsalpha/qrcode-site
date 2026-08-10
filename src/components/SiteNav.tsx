import NavMenu from "./NavMenu";
import s from "./SiteNav.module.css";

export function SiteNav() {
  return (
    <nav className={s.nav}>
      <div className={s.navInner}>
        <a href="/" className={s.navBrand}>
          <span className={s.navBrandAt}>@ttsalpha/</span>qrcode
        </a>
        <NavMenu />
      </div>
    </nav>
  );
}
