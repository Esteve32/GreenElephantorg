import { localPage } from "@shared/site-language";
import { scanLiteracy, type ScanLanguage } from "@shared/scan-literacy";
import { Link } from "wouter";
import "@/pages/acx-article.css";

export function ScanAcxSection({ language = "en" }: { language?: ScanLanguage }) {
  const c = scanLiteracy[language];
  return <section lang={language} className="py-16 px-4" style={{ background: "linear-gradient(#0a0a0a, #0a1628 45%, #0a0a0a)" }} aria-labelledby="scan-acx-title">
    <div className="max-w-4xl mx-auto">
      <h2 id="scan-acx-title" className="text-3xl font-bold mb-5">{c.levelsTitle}</h2>
      <p className="text-lg text-muted-foreground mb-8">{c.levelsIntro}</p>
      <h3 className="text-xl font-semibold mb-3">{c.why}</h3>
      <p className="text-muted-foreground mb-8">{c.whyText}</p>
      <div className="grid md:grid-cols-2 gap-8">
        {c.levels.map(([title, description], index) => <article key={index}>
          <Link href={localPage(`/blog/acx-levels-ai-literacy#acx-${index + 1}`, language)} className="acx-level-heading acx-jump" data-acx-level={index + 1}>
            <span className="acx-level-icon"><img src={`/images/acx/acx-${index + 1}-outline.svg`} alt="" aria-hidden="true" width="80" height="80" /></span>
            <div><span className="acx-level-label">ACX {index + 1}</span><h3 className="text-xl font-semibold">{title}</h3></div>
          </Link>
          <p className="text-muted-foreground leading-relaxed mt-4">{description}</p>
        </article>)}
      </div>
      <p className="text-sm text-muted-foreground mt-8">{c.privacy}</p>
      <Link href={localPage("/blog/acx-levels-ai-literacy#acx-scan", language)} className="inline-block underline mt-5 text-needs">{c.guide}</Link>
    </div>
  </section>;
}
