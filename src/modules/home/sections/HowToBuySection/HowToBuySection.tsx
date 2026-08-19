import { BRAND_CONFIG } from "@/tenant/config/brand";
import {
  Link,
} from "react-router-dom";

import {
  BadgeCheck,
  Banknote,
  Box,
  CheckCircle2,
  FileCheck2,
  MapPin,
  MessageCircle,
  PackageCheck,
  PackagePlus,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PackagePlus,
    title: "Elige y arma Mi Box",
    text: "Explora el catálogo, revisa los modelos disponibles y agrega las unidades que deseas comprar.",
    emoji: "📦",
  },
  {
    number: "02",
    icon: BadgeCheck,
    title: "Confirma",
    text: "Verificamos stock disponible y el total exacto de tu pedido.",
    emoji: "✅",
  },
  {
    number: "03",
    icon: Banknote,
    title: "Paga",
    text: "Puedes pagar mediante Yape, Plin o transferencia.",
    emoji: "💳",
  },
  {
    number: "04",
    icon: Truck,
    title: "Recibe",
    text: "Coordinamos entrega o despacho asegurado a tu ciudad.",
    emoji: "🚚",
  },
];

const shippingJourney = [
  {
    number: "01",
    icon: CheckCircle2,
    title: "Confirmado",
    text: "Validamos tu pedido y coordinamos contigo antes del despacho.",
  },
  {
    number: "02",
    icon: PackageCheck,
    title: "Protegido",
    text: "Preparamos cada pieza con embalaje reforzado para cuidar su presentación.",
  },
  {
    number: "03",
    icon: Truck,
    title: "En camino",
    text: "Despachamos mediante Shalom o agencias de confianza hacia tu ciudad.",
  },
  {
    number: "04",
    icon: MapPin,
    title: "Recibido",
    text: "Tu pedido llega a destino listo para disfrutar, regalar o sumar a tu colección.",
  },
];

const shippingHighlights = [
  {
    icon: Route,
    label: "+350 destinos",
  },
  {
    icon: Truck,
    label: "Shalom y agencias",
  },
  {
    icon: ShieldCheck,
    label: "Protección coordinada",
  },
  {
    icon: FileCheck2,
    label: "Boleta o factura",
  },
];

export default function HowToBuySection() {
  return (
    <section
      id="como-comprar"
      className="border-t border-slate-200/80 bg-white how-to-buy-brand"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--color-identity-light)]">
            Fácil y directo
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[var(--color-text)] md:text-5xl">
            ¿Cómo comprar?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Elige tus modelos, arma Mi Box y confirma directamente por WhatsApp.
            Nosotros verificamos disponibilidad, pago y despacho.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon =
              step.icon;

            return (
              <article
                key={step.number}
                className="relative rounded-[28px] border border-white/10 bg-white/[0.035] p-7"
              >
                <span className="absolute right-6 top-5 text-5xl font-black tracking-[-0.08em] text-[var(--color-text)]/[0.035]">
                  {step.number}
                </span>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-400">
                  <Icon size={21} />
                </div>

                <h3 className="mt-7 text-lg font-black text-[var(--color-text)]">
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

        <div className="shipping-brand-panel relative mt-12 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-amber-400/[0.06] blur-3xl"
          />

          <div className="relative p-6 md:p-9">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="shipping-brand-eyebrow-icon flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                    <Sparkles
                      size={16}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="shipping-brand-eyebrow text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
                    Envíos a todo el Perú
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-black tracking-[-0.035em] text-[var(--color-text)] md:text-3xl">
                  Desde Tu Box hasta tus manos.
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                  Coordinamos cada etapa para que tu pedido viaje protegido desde la confirmación hasta que llegue a tu ciudad.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
                <a
                  href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 text-xs font-black text-emerald-400 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.12]"
                >
                  <MessageCircle
                    size={17}
                    aria-hidden="true"
                  />

                  Consultar envío
                </a>

                <Link
                  to="/catalogo"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 text-xs font-black text-[var(--color-text)] transition hover:bg-sky-400"
                >
                  <Box
                    size={17}
                    aria-hidden="true"
                  />

                  Ver catálogo
                </Link>
              </div>
            </div>

            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute left-[9%] right-[9%] top-7 hidden h-px bg-gradient-to-r from-sky-500/10 via-sky-400/40 to-emerald-400/20 lg:block"
              />

              <div className="shipping-journey-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {shippingJourney.map(
                  (stage) => {
                    const Icon =
                      stage.icon;

                    return (
                      <article
                        key={stage.number}
                        className="shipping-journey-card relative z-10 rounded-2xl border border-slate-200/80 bg-white p-5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="shipping-journey-icon flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/15 bg-sky-400/[0.08] text-sky-400 shadow-[0_0_30px_rgba(14,165,233,0.06)]">
                            <Icon
                              size={21}
                              aria-hidden="true"
                            />
                          </div>

                          <span className="shipping-journey-number text-[10px] font-black tracking-[0.2em] text-slate-700">
                            {stage.number}
                          </span>
                        </div>

                        <h4 className="shipping-journey-title mt-5 text-sm font-black text-white">
                          {stage.title}
                        </h4>

                        <p className="shipping-journey-copy mt-2 text-xs leading-5 text-slate-500">
                          {stage.text}
                        </p>
                      </article>
                    );
                  },
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {shippingHighlights.map(
                (highlight) => {
                  const Icon =
                    highlight.icon;

                  return (
                    <span
                      key={highlight.label}
                      className="shipping-highlight-chip inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-slate-400"
                    >
                      <Icon
                        size={14}
                        className="text-sky-400"
                        aria-hidden="true"
                      />

                      {highlight.label}
                    </span>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
