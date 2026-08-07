import "./HeroSlider.css";

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HeroSlider() {
  return (
    <section className="collectibles-hero">
      <div className="collectibles-hero-grid" />
      <div className="collectibles-hero-glow collectibles-hero-glow-a" />
      <div className="collectibles-hero-glow collectibles-hero-glow-b" />

      <div className="relative z-10 mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-20 md:px-8 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-sky-300">
            <Sparkles size={14} />
            Autos para descubrir y coleccionar
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl">
            Tu próxima pieza
            <span className="block text-sky-400">
              empieza aquí.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-slate-400 md:text-lg">
            Explora modelos, encuentra tus favoritos y compra
            unidades seleccionadas directamente desde nuestro catálogo.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalogo"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-sky-500 px-7 py-4 text-sm font-black text-white shadow-[0_20px_60px_rgba(14,165,233,.25)] transition hover:-translate-y-1 hover:bg-sky-400"
            >
              Explorar catálogo
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#categorias"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-black text-white transition hover:bg-white/10"
            >
              Ver categorías
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-7 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-2">
              <Gauge size={16} className="text-sky-400" />
              Compra por unidad
            </span>

            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-sky-400" />
              Stock identificado
            </span>
          </div>
        </div>

        <div className="collectibles-hero-display">
          <div className="collectibles-hero-card">
            <span className="collectibles-hero-number">
              1:64
            </span>

            <div className="collectibles-car">
              <div className="collectibles-car-body" />
              <div className="collectibles-car-window" />
              <div className="collectibles-wheel collectibles-wheel-left" />
              <div className="collectibles-wheel collectibles-wheel-right" />
            </div>

            <div className="collectibles-hero-card-copy">
              <span>CATÁLOGO</span>
              <strong>COLECCIONABLES</strong>
              <small>Encuentra tu próxima pieza</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}