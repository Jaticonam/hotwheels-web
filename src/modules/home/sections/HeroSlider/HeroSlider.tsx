import "./HeroSlider.css";

import {
  MessageCircle,
} from "lucide-react";

import MiniRace from "@/modules/home/components/MiniRace/MiniRace";

import {
  BRAND_CONFIG,
} from "@/tenant/config/brand";

export default function HeroSlider() {
  const whatsappHref =
    `https://wa.me/${BRAND_CONFIG.contact.whatsapp}?text=${encodeURIComponent(
      "Hola, quiero información sobre Hot Wheels.",
    )}`;

  return (
    <section className="home-mvp-hero">
      <div className="home-mvp-hero-background">
        <img
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1920&q=80"
          alt="Hot Wheels Background"
        />

        <div className="home-mvp-hero-overlay" />
      </div>

      <div className="home-mvp-hero-inner">
        <div className="home-mvp-hero-copy">
          <div className="home-mvp-stock-chip">
            <span className="home-mvp-stock-fire">
              🔥
            </span>

            <span>
              Coleccionables originales · Envíos a todo el Perú
            </span>
          </div>

          <div className="home-mvp-heading">
            <span className="home-mvp-eyebrow">
              HOTWHEELS · COLECCIONABLES 1:64
            </span>

            <h1>
              Hot Wheels originales para{" "}
              <span className="home-mvp-gradient-text">
                coleccionar, disfrutar y regalar
              </span>{" "}
              🚗🔥
            </h1>
          </div>

          <p className="home-mvp-hero-description">
            Descubre modelos para coleccionar, disfrutar o regalar.
            Explora el catálogo, encuentra tus favoritos y recibe tu pedido en cualquier ciudad del Perú.
          </p>

          <div className="home-mvp-hero-actions">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="home-mvp-whatsapp"
            >
              <MessageCircle
                size={20}
                aria-hidden="true"
              />

              <span>
                Consultar por WhatsApp
              </span>
            </a>

            <a
              href="/catalogo"
              className="home-mvp-secondary"
            >
              Ver catálogo
            </a>
          </div>
        </div>

        <MiniRace />
      </div>
    </section>
  );
}