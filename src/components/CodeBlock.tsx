import { codeToHtml } from "shiki";
import CopyButton from "@/components/CopyButton";
import s from "./CodeBlock.module.css";

interface Props {
  code: string;
  lang?: string;
  showLang?: boolean;
}

export default async function CodeBlock({
  code,
  lang = "tsx",
  showLang = true,
}: Props) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <div className={s.wrap}>
      <div className={s.toolbar}>
        {showLang ? <span className={s.lang}>{lang}</span> : <span />}
        <CopyButton text={code.trim()} />
      </div>
      <div className={s.pre} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
