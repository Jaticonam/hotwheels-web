import { Link } from "react-router-dom";
import {
  MessageCircle,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Explora",
    text: "Busca modelos y revisa las categorías disponibles.",
    emoji: "🔎",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Selecciona",
    text: "Agrega al carrito las unidades que deseas comprar.",
    emoji: "🛒",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Confirma",
    text: "Envía tu pedido y confirma disponibilidad por WhatsApp.",
    emoji: "💬",
  },
  {
    number: "04",
    icon: Truck,
    title: "Recibe",
    text: "Coordinamos entrega o envío según tu ubicación.",
    emoji: "📦",
  },
];

export default function HowToBuySection() {
  return (
    <section
      id="como-comprar"
      className="border-t border-white/10 bg-slate-900"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-400">
            Fácil y directo
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
            ¿Cómo comprar?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Elige tus piezas, arma tu pedido y termina la compra directamente con nosotros.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative rounded-[28px] border border-white/10 bg-white/[0.035] p-7"
              >
                <span className="absolute right-6 top-5 text-5xl font-black tracking-[-0.08em] text-white/[0.035]">
                  {step.number}
                </span>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-400">
                  <Icon size={21} />
                </div>

                <h3 className="mt-7 text-lg font-black text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {step.text}
                </p>

                <span className="mt-7 block text-2xl">
                  {step.emoji}
                </span>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/catalogo"
            className="rounded-2xl bg-sky-500 px-8 py-4 text-sm font-black text-white transition hover:bg-sky-400"
          >
            Ir al catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}