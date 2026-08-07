import { Link } from "react-router-dom";
import {
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

import { BRAND_CONFIG } from "@/tenant/config/brand";

export default function HomeFloatingButtons() {
  const whatsappUrl =
    `https://wa.me/${BRAND_CONFIG.contact.whatsapp}?text=${encodeURIComponent(
      "Hola, quiero consultar por los autos coleccionables disponibles.",
    )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <Link
        to="/catalogo"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-xs font-black text-white shadow-2xl transition hover:bg-slate-800"
      >
        <ShoppingBag size={17} />
        Catálogo
      </Link>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-xs font-black text-white shadow-2xl transition hover:bg-emerald-400"
      >
        <MessageCircle size={17} />
        WhatsApp
      </a>
    </div>
  );
}