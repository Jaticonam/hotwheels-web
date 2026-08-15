import {
  ArrowLeft,
  Share2,
} from "lucide-react";

import type {
  ProductHeaderProps,
} from "./ProductHeader.types";

import "./ProductHeader.css";

export function ProductHeader({
  title,
  code,
  onBack,
  onShare,
}: ProductHeaderProps) {
  return (
    <header className="product-detail-header">
      <div className="product-detail-header-inner">
        <button
          type="button"
          onClick={onBack}
          className="product-detail-icon-button"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="product-detail-header-title">
          <p>
            ID {code}
          </p>

          <h1>
            {title}
          </h1>
        </div>

        <button
          type="button"
          onClick={onShare}
          className="product-detail-icon-button"
          aria-label="Compartir producto"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}