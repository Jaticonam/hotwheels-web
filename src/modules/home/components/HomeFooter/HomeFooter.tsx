import {
  MessageCircle,
} from "lucide-react";

import {
  BRAND_CONFIG,
} from "@/tenant/config/brand";

const currentYear =
  new Date().getFullYear();

export default function HomeFooter() {
  const whatsappHref =
    `https://wa.me/${BRAND_CONFIG.contact.whatsapp}`;

  return (
    <footer className="relative overflow-hidden brand-footer-dark bg-slate-950 text-white home-brand-footer">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-xl font-black tracking-[-0.025em] text-white">
              JUNG INVERSIONES & NEGOCIOS S.A.C.
            </span>

            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-identity-light)]">
              RUC: 20616037120
            </p>

            <p className="mt-2 max-w-md text-center text-xs leading-5 text-slate-500 md:text-left">
              Respaldo empresarial para nuestra operación de coleccionables en todo el Perú.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400">
              +51 936 188 636
            </span>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de contacto"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-emerald-400/40 hover:bg-emerald-500 hover:text-white"
            >
              <MessageCircle
                size={17}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <p className="text-[10px] font-medium tracking-wide text-slate-600">
            © {currentYear}{" "}
            <span className="text-sky-500">
              JUNG Inversiones & Negocios S.A.C.
            </span>
            {" "}Envíos a todo el Perú. Pasión sobre ruedas.
          </p>
        </div>
      </div>
    </footer>
  );
}