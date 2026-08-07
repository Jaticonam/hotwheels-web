import "./CategoriesSection.css";

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { getCategoryUrl } from "@/app/routes/routes";
import { CATEGORIES } from "@/tenant/config/catalog";

export default function CategoriesSection() {
  return (
    <section
      id="categorias"
      className="home-collectibles-categories"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-3xl">
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-400">
            Explora
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
            Encuentra el auto que estás buscando.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Navega por nuestras categorías y descubre nuevas piezas para tu colección.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const href =
              category.id === "todas"
                ? "/catalogo"
                : getCategoryUrl(category.id);

            return (
              <Link
                key={category.id}
                to={href}
                className="home-collectibles-category-card group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">
                    {category.icon}
                  </span>

                  <ArrowRight
                    size={18}
                    className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-sky-400"
                  />
                </div>

                <div className="mt-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {category.id}
                  </span>

                  <h3 className="mt-2 text-xl font-black text-white">
                    {category.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}