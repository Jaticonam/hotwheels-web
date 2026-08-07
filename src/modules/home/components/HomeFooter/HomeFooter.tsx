import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

export default function HomeFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="text-xl font-black uppercase tracking-[0.12em] text-white">
            Coleccionables
          </p>

          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-sky-400">
            Escala 1:64
          </p>

          <p className="mt-5 max-w-md text-sm leading-6 text-slate-500">
            Catálogo digital de autos y piezas coleccionables.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-xs font-bold text-slate-400">
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
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-5 py-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 md:px-8">
          © {currentYear} · Catálogo de coleccionables
        </div>
      </div>
    </footer>
  );
}