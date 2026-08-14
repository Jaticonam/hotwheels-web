import {
  MessageCircle,
  Package,
  ShoppingCart,
} from "lucide-react";

import { BRAND_CONFIG } from "@/tenant/config/brand";

interface FloatingButtonsProps {
  variant?: "shop" | "home";
  cartCount?: number;
  onCartClick?: () => void;
}

export function FloatingButtons({
  variant = "shop",
  cartCount = 0,
  onCartClick,
}: FloatingButtonsProps) {
  const isHome =
    variant === "home";

  return (
    <div className="fixed bottom-5 right-4 z-[1000] flex flex-col items-end gap-2 sm:right-5">
      {!isHome && onCartClick && (
        <button
          type="button"
          onClick={onCartClick}
          className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-sky-400/20 bg-slate-900/95 px-4 text-sm font-extrabold text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-slate-800"
          aria-label={`Mi carrito, ${cartCount} unidades`}
        >
          <ShoppingCart
            className="h-5 w-5 text-sky-400"
            aria-hidden="true"
          />

          <span className="hidden sm:inline">
            Mi carrito
          </span>

          {cartCount > 0 && (
            <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[10px] font-black text-white">
              {cartCount > 99
                ? "99+"
                : cartCount}
            </span>
          )}
        </button>
      )}

      {isHome && (
        <a
          href="/catalogo"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-sky-400/20 bg-slate-900/95 px-4 text-sm font-extrabold text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-slate-800"
        >
          <Package
            className="h-5 w-5 text-sky-400"
            aria-hidden="true"
          />

          <span className="hidden sm:inline">
            {BRAND_CONFIG.floating.catalogLabel}
          </span>
        </a>
      )}

      <a
        href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500 px-4 text-sm font-extrabold text-white shadow-2xl transition hover:-translate-y-0.5 hover:bg-emerald-400"
      >
        <MessageCircle
          className="h-5 w-5"
          aria-hidden="true"
        />

        <span className="hidden sm:inline">
          {BRAND_CONFIG.floating.whatsappLabel}
        </span>
      </a>
    </div>
  );
}