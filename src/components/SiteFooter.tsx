import s from "./SiteFooter.module.css";

export function SiteFooter({
  maxWidth = 920,
  showDocsLink = false,
}: {
  maxWidth?: number;
  showDocsLink?: boolean;
}) {
  return (
    <footer className={s.footer}>
      <div className={s.wrap} style={{ maxWidth }}>
        <div className={s.footerTop}>
          <div className={s.footerBrand}>
            <span className={s.footerBrandAt}>@ttsalpha/</span>qrcode
          </div>
          <nav className={s.footerNav}>
            {showDocsLink && (
              <a href="/" className={s.footerNavLink}>
                Docs
              </a>
            )}
            <a
              href="https://github.com/ttsalpha"
              target="_blank"
              rel="noopener noreferrer"
              className={s.footerNavLink}
            >
              Author
            </a>
            <a
              href="https://github.com/ttsalpha/qrcode/releases"
              target="_blank"
              rel="noopener noreferrer"
              className={s.footerNavLink}
            >
              Changelog
            </a>
            <a
              href="https://github.com/ttsalpha/qrcode/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className={s.footerNavLink}
            >
              License
            </a>
          </nav>
        </div>
        <div className={s.footerBottom}>
          <span className={s.footerCopy}>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/ttsalpha"
              target="_blank"
              rel="noopener noreferrer"
              className={s.footerLink}
            >
              Son Tran
            </a>{" "}
            · MIT License
          </span>
        </div>
      </div>
    </footer>
  );
}
