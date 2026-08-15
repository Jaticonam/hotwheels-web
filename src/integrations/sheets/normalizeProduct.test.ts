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

  it("normaliza metadata propia del coleccionable", () => {
    const product = normalizeProduct({
      id: "HW-006",
      title: "Nissan Skyline GT-R R34",
      price: "29.90",
      status: "Publicado",

      brand: "Hot Wheels",
      line: "Mainline",
      series: "HW J-Imports",
      year: "2026",
      scale: "1:64",

      mattel_code: "HYY00",
      case_code: "A",

      rarity: "Regular",
      card_condition: "Nuevo",
      vehicle_condition: "Nuevo",
    });

    expect(product.brand).toBe("Hot Wheels");
    expect(product.line).toBe("Mainline");
    expect(product.series).toBe("HW J-Imports");
    expect(product.year).toBe(2026);
    expect(product.scale).toBe("1:64");
    expect(product.mattel_code).toBe("HYY00");
    expect(product.case_code).toBe("A");
    expect(product.rarity).toBe("Regular");
    expect(product.card_condition).toBe("Nuevo");
    expect(product.vehicle_condition).toBe("Nuevo");
  });

  it("mantiene compatibles filas antiguas sin metadata coleccionable", () => {
    const product = normalizeProduct({
      id: "HW-007",
      title: "Modelo legado",
      price: "19.90",
      status: "Publicado",
    });

    expect(product.brand).toBe("");
    expect(product.line).toBe("");
    expect(product.series).toBe("");
    expect(product.year).toBeNull();
    expect(product.scale).toBe("");
    expect(product.mattel_code).toBe("");
    expect(product.case_code).toBe("");
    expect(product.rarity).toBe("");
    expect(product.card_condition).toBe("");
    expect(product.vehicle_condition).toBe("");
  });

  it("rechaza años no enteros como metadata válida", () => {
    const product = normalizeProduct({
      id: "HW-008",
      title: "Modelo año inválido",
      price: "19.90",
      status: "Publicado",
      year: "2026.5",
    });

    expect(product.year).toBeNull();
  });
});