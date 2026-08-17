import "./BrandLockup.css";

import { BRAND_CONFIG } from "@/tenant/config/brand";

interface BrandLockupProps {
  align?: "start" | "center";
  size?: "compact" | "default";
}

export function BrandLockup({
  align = "center",
  size = "default",
}: BrandLockupProps) {
  return (
    <span
      className={[
        "brand-lockup",
        `brand-lockup-${align}`,
        `brand-lockup-${size}`,
      ].join(" ")}
    >
      <span className="brand-lockup-name">
        {BRAND_CONFIG.name}
      </span>

      <span className="brand-lockup-signature">
        <span
          className="brand-lockup-accent"
          aria-hidden="true"
        />

        <span className="brand-lockup-scale">
          {BRAND_CONFIG.identity.scale}
        </span>
      </span>
    </span>
  );
}