import type { CSSProperties } from "react";
import type { LensType } from "@/constants/lenses";
import { MYFIVE_LENS_TOKENS } from "@/constants/myfiveDesignTokens";

interface AuraSphereMatchProps {
  connectionName: string;
  primaryLens: LensType;
  secondaryLens: LensType;
}

type AuraStyle = CSSProperties & {
  "--aura-primary": string;
  "--aura-secondary": string;
};

export function AuraSphereMatch({
  connectionName,
  primaryLens,
  secondaryLens,
}: AuraSphereMatchProps) {
  const primary = MYFIVE_LENS_TOKENS[primaryLens];
  const secondary = MYFIVE_LENS_TOKENS[secondaryLens];
  const style: AuraStyle = {
    "--aura-primary": primary.hex,
    "--aura-secondary": secondary.hex,
  };
  const accessibleDescription = `${connectionName} relationship aura: ${primary.label} and ${secondary.label} overlap, paired with ${primary.loveLabel} and ${secondary.loveLabel}.`;

  return (
    <figure
      className="myfive-aura"
      style={style}
      role="img"
      aria-label={accessibleDescription}
    >
      <div className="myfive-aura__field" aria-hidden="true">
        <span className="myfive-aura__sphere myfive-aura__sphere--primary" />
        <span className="myfive-aura__sphere myfive-aura__sphere--secondary" />
        <span className="myfive-aura__intersection" />
      </div>
      <figcaption className="myfive-aura__legend">
        <span>
          <i style={{ backgroundColor: primary.hex, color: primary.hex }} />
          {primary.loveLabel}
        </span>
        <span className="myfive-aura__connection">shared space</span>
        <span>
          <i style={{ backgroundColor: secondary.hex, color: secondary.hex }} />
          {secondary.loveLabel}
        </span>
      </figcaption>
    </figure>
  );
}
