import { Link } from "react-router-dom";

import { BrandLockup } from "@/shared/components/brand/BrandLockup";
import {
  Menu,
  Search,
  ShoppingBag,
} from "lucide-react";

type HomeNavProps = {
  cartCount?: number;
  onCartClick?: () => void;
};

export default function HomeNav({
  cartCount = 0,
  onCartClick,
}: HomeNavProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link
          to="/"
          className="flex flex-col leading-none"
        >
          <BrandLockup align="start" size="default" />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-bold text-slate-300 md:flex">
          <Link
            to="/catalogo"
            className="transition hover:text-white"
          >
            Catálogo
          </Link>

          <a
            href="#categorias"
            className="transition hover:text-white"
          >
            Categorías
          </a>

          <a
            href="#como-comprar"
            className="transition hover:text-white"
          >
            ¿Cómo comprar?
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/catalogo"
            aria-label="Buscar productos"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-sky-400/50 hover:text-white sm:flex"
          >
            <Search size={19} />
          </Link>

          <button
            type="button"
            onClick={onCartClick}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-sky-400/50 hover:bg-white/10"
            aria-label="Ver Mi Box"
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[10px] font-black text-white ring-2 ring-slate-950">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            to="/catalogo"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
            aria-label="Abrir catálogo"
          >
            <Menu size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}