import {
  LayoutGrid,
  MessageCircle,
  PackagePlus,
} from "lucide-react";

import { BRAND_CONFIG } from "@/tenant/config/brand";

interface FloatingButtonsProps {
  variant?: "shop" | "home";
  cartCount?: number;
  onCartClick?: () => void;
}

const utilityButtonClass =
  "relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border shadow-2xl backdrop-blur-xl transition [transition-duration:var(--motion-duration-standard)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

export function FloatingButtons({
  variant = "shop",
  cartCount = 0,
  onCartClick,
}: FloatingButtonsProps) {
  const isHome =
    variant === "home";

  const visibleCartCount =
    cartCount > 99
      ? "99+"
      : cartCount;

  const whatsappMessage =
    isHome
      ? "Hola, quiero consultar por los autos coleccionables disponibles."
      : "";

  const whatsappHref =
    `https://wa.me/${BRAND_CONFIG.contact.whatsapp}${
      whatsappMessage
        ? `?text=${encodeURIComponent(whatsappMessage)}`
        : ""
    }`;

  return (
    <div
      className="fixed right-3 z-[1000] flex flex-col items-center gap-2 sm:right-4"
      style={{
        bottom:
          "calc(env(safe-area-inset-bottom) + 0.75rem)",
      }}
      aria-label="Acciones rápidas"
    >
      {!isHome && onCartClick && (
        <button
          type="button"
          onClick={onCartClick}
          className={`${utilityButtonClass} border-sky-300/55 bg-sky-500 text-slate-950 shadow-[0_14px_36px_rgba(14,165,233,0.38)] ring-1 ring-sky-300/20 hover:border-sky-200/70 hover:bg-sky-400 hover:shadow-[0_16px_42px_rgba(14,165,233,0.46)]`}
          aria-label={`Mi Box, ${cartCount} unidades`}
          title="Mi Box"
        >
          <PackagePlus
            className="h-[19px] w-[19px]"
            aria-hidden="true"
          />

          {cartCount > 0 && (
            <span
              className="absolute -left-1.5 -top-1.5 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border border-sky-300/55 bg-slate-950 px-1 text-[9px] font-black leading-none text-white shadow-lg"
              aria-hidden="true"
            >
              {visibleCartCount}
            </span>
          )}
        </button>
      )}

      {isHome && (
        <a
          href="/catalogo"
          className={`${utilityButtonClass} border-sky-400/25 bg-slate-900/95 text-sky-400 hover:border-sky-300/50 hover:bg-slate-800`}
          aria-label={
            BRAND_CONFIG.floating.catalogLabel
          }
          title={
            BRAND_CONFIG.floating.catalogLabel
          }
        >
          <LayoutGrid
            className="h-[19px] w-[19px]"
            aria-hidden="true"
          />
        </a>
      )}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${utilityButtonClass} border-emerald-300/20 bg-emerald-500 text-white hover:border-emerald-200/40 hover:bg-emerald-400`}
        aria-label={
          BRAND_CONFIG.floating.whatsappLabel
        }
        title={
          BRAND_CONFIG.floating.whatsappLabel
        }
      >
        <MessageCircle
          className="h-[19px] w-[19px]"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}