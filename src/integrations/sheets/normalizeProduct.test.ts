import { describe, expect, it } from "vitest";

import { normalizeProduct } from "./normalizeProduct";

describe("normalizeProduct MVP", () => {
  it("normaliza precios, stock y prioridad", () => {
    const product = normalizeProduct({
      id: "HW-001",
      title: "Collector Car",
      price: "29,90",
      offer_price: "24.50",
      stock: "6",
      priority: "10",
      status: "Publicado",
    });

    expect(product.id).toBe("HW-001");
    expect(product.price).toBe(29.9);
    expect(product.offer_price).toBe(24.5);
    expect(product.stock).toBe(6);
    expect(product.priority).toBe(10);
  });

  it("normaliza galería separada por pipe", () => {
    const product = normalizeProduct({
      id: "HW-002",
      title: "Collector Car",
      price: "20",
      status: "Publicado",
      images: "uno.webp|dos.webp|tres.webp",
    });

    expect(product.images).toEqual([
      "uno.webp",
      "dos.webp",
      "tres.webp",
    ]);
  });

  it("acepta badge o badges", () => {
    const product = normalizeProduct({
      id: "HW-003",
      title: "Collector Car",
      price: "20",
      status: "Publicado",
      badge: "Nuevo|Premium",
    });

    expect(product.badges).toEqual([
      "Nuevo",
      "Premium",
    ]);
  });

  it("elimina atributos duplicados", () => {
    const product = normalizeProduct({
      id: "HW-004",
      title: "Collector Car",
      price: "20",
      status: "Publicado",
      attributes: "Premium|premium|Edición Especial",
    });

    expect(product.attributes).toEqual([
      "premium",
      "edicion-especial",
    ]);
  });

  it("normaliza estados equivalentes", () => {
    const product = normalizeProduct({
      id: "HW-005",
      title: "Collector Car",
      price: "20",
      status: "Disponible",
    });

    expect(product.status).toBe("Publicado");
  });
});