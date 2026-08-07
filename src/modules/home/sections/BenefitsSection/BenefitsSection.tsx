import {
  Boxes,
  MessageCircle,
  Search,
  ShoppingBag,
} from "lucide-react";

const benefits = [
  {
    icon: Search,
    title: "Explora fácilmente",
    text: "Encuentra modelos y categorías desde un catálogo directo y ordenado.",
  },
  {
    icon: ShoppingBag,
    title: "Compra por unidad",
    text: "Elige exactamente las piezas que quieres agregar a tu colección.",
  },
  {
    icon: Boxes,
    title: "Stock identificado",
    text: "Cada producto se publica con código y disponibilidad para comprar mejor.",
  },
  {
    icon: MessageCircle,
    title: "Atención directa",
    text: "Finaliza tu selección y coordina tu pedido rápidamente por WhatsApp.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="border-y border-white/10 bg-slate-900/70">
      <div className="mx-auto grid max-w-7xl gap-px px-5 py-2 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <article
              key={benefit.title}
              className="group flex gap-4 border-white/10 px-4 py-8 lg:border-r lg:last:border-r-0"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-400">
                <Icon size={20} />
              </div>

              <div>
                <h2 className="text-sm font-black text-white">
                  {benefit.title}
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {benefit.text}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}