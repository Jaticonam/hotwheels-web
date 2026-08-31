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

  it("normaliza datos coleccionables esenciales del Nivel 1", () => {
    const product = normalizeProduct({
      id: "HW-C26-063",
      title: "Ferrari F40 Competizione",
      price: "29.90",
      status: "Publicado",
      year: "2026",
      case_code: "C",
      card_number: "63/250",
      mini_series: "Ferrari 3/5",
    });

    expect(product.year).toBe(2026);
    expect(product.case_code).toBe("C");
    expect(product.card_number).toBe("63/250");
    expect(product.mini_series).toBe("Ferrari 3/5");
  });

  it("mantiene compatibles filas antiguas sin metadata Nivel 1", () => {
    const product = normalizeProduct({
      id: "HW-007",
      title: "Modelo legado",
      price: "19.90",
      status: "Publicado",
    });

    expect(product.year).toBeNull();
    expect(product.case_code).toBe("");
    expect(product.card_number).toBe("");
    expect(product.mini_series).toBe("");
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

  it("normaliza metadata Taxonomy 1.0 desde Sheets", () => {
    const product = normalizeProduct({
      id: "HW-TAX-001",
      title: "Porsche 911 GT3",
      price: "59.90",
      status: "Publicado",

      series: "Car Culture",
      collection: "Modern Classics",
      set_number: "3/5",

      format: "Team Transport",
      rarity: "Super Treasure Hunt",

      manufacturer: "Porsche",
      franchise: "Fast & Furious",
      style: "JDM",
      exclusivity: "ZAMAC",
    });

    expect(product.series)
      .toBe("Car Culture");

    expect(product.collection)
      .toBe("Modern Classics");

    expect(product.set_number)
      .toBe("3/5");

    expect(product.format)
      .toBe("team-transport");

    expect(product.rarity)
      .toBe("super-treasure-hunt");

    expect(product.manufacturer)
      .toBe("Porsche");

    expect(product.franchise)
      .toBe("Fast & Furious");

    expect(product.style)
      .toBe("jdm");

    expect(product.exclusivity)
      .toBe("zamac");
  });

  it("acepta aliases operativos seguros para formato y rareza", () => {
    const product = normalizeProduct({
      id: "HW-TAX-002",
      title: "Treasure Test",
      price: "20",
      status: "Publicado",
      format: "Caja",
      rarity: "STH",
    });

    expect(product.format)
      .toBe("case");

    expect(product.rarity)
      .toBe("super-treasure-hunt");
  });

  it("no inventa formato o rareza cuando el valor no es reconocido", () => {
    const product = normalizeProduct({
      id: "HW-TAX-003",
      title: "Unknown Taxonomy",
      price: "20",
      status: "Publicado",
      format: "Formato desconocido",
      rarity: "Ultra raro inventado",
    });

    expect(product.format)
      .toBe("");

    expect(product.rarity)
      .toBe("");
  });

  it("preserva mini_series legacy y migra sus campos determinísticos", () => {
    const product = normalizeProduct({
      id: "HW-TAX-004",
      title: "Legacy Product",
      price: "20",
      status: "Publicado",
      mini_series: "Ferrari 3/5",
    });

    expect(product.mini_series)
      .toBe("Ferrari 3/5");

    expect(product.series)
      .toBe("Ferrari");

    expect(product.collection)
      .toBe("");

    expect(product.set_number)
      .toBe("3/5");

    expect(product.format)
      .toBe("");

    expect(product.rarity)
      .toBe("");

    expect(product.manufacturer)
      .toBe("");

    expect(product.franchise)
      .toBe("");

    expect(product.style)
      .toBe("");

    expect(product.exclusivity)
      .toBe("");
  });
  it("migra un JDM 2026 auditado a Mainline", () => {
    const product = normalizeProduct({
      id: "HWC26060",
      title: "Toyota Prius Custom",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "60/250",
      category: "JDM",
      badges: "JDM",
    });

    expect(product.category)
      .toBe("mainline");

    expect(product.categories)
      .toEqual([
        "mainline",
      ]);

    expect(product.explore_tags)
      .toEqual([
        "jdm",
      ]);
  });

  it("migra Fantasía 2026 sin convertirla en categoría", () => {
    const product = normalizeProduct({
      id: "HWC26005",
      title: "Pass 'n Go",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "5/250",
      category: "Fantasía",
    });

    expect(product.category)
      .toBe("mainline");

    expect(product.categories)
      .toEqual([
        "mainline",
      ]);

    expect(product.explore_tags)
      .toEqual([
        "fantasia",
      ]);

    expect(
      product.categories,
    ).not.toContain(
      "fantasia",
    );
  });

  it("prioriza una categoría canónica explícita sobre la regla Mainline 2026", () => {
    const product = normalizeProduct({
      id: "HW-SILVER-001",
      title: "Silver Test",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "10/250",
      category: "Silver Series",
    });

    expect(product.category)
      .toBe(
        "silver-series",
      );

    expect(product.categories)
      .toEqual([
        "silver-series",
      ]);

    expect(product.explore_tags)
      .toEqual([]);
  });

  it("no extrapola Mainline 2026 hacia productos de otro año", () => {
    const product = normalizeProduct({
      id: "HW-2027-001",
      title: "Legacy 2027",
      price: "20",
      status: "Publicado",

      year: "2027",
      card_number: "60/250",
      category: "Clásicos",
    });

    expect(product.category)
      .toBe(
        "clasicos",
      );

    expect(product.categories)
      .toContain(
        "clasicos",
      );

    expect(product.explore_tags)
      .toEqual([
        "clasicos",
      ]);
  });

  it("no contamina categories con la clasificación legacy migrada", () => {
    const product = normalizeProduct({
      id: "HWC26015",
      title: "Porsche 911 Carrera T",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "15/250",
      category: "Deportivos",
    });

    expect(product.category)
      .toBe(
        "mainline",
      );

    expect(product.categories)
      .toEqual([
        "mainline",
      ]);

    expect(product.explore_tags)
      .toEqual([
        "deportivos",
      ]);

    expect(
      product.categories,
    ).not.toContain(
      "deportivos",
    );
  });
  it("infiere single para Mainline 2026 auditado cuando format está vacío", () => {
    const product = normalizeProduct({
      id: "HWC26060",
      title: "Toyota Prius Custom",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "60/250",
      category: "JDM",
    });

    expect(product.category)
      .toBe("mainline");

    expect(product.format)
      .toBe("single");
  });

  it("respeta un format explícito válido sobre la inferencia Mainline 2026", () => {
    const product = normalizeProduct({
      id: "HW-FORMAT-001",
      title: "Formato explícito",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "60/250",
      category: "JDM",

      format: "5-pack",
    });

    expect(product.category)
      .toBe("mainline");

    expect(product.format)
      .toBe("5-pack");
  });

  it("no reemplaza silenciosamente un format explícito inválido por single", () => {
    const product = normalizeProduct({
      id: "HW-FORMAT-002",
      title: "Formato inválido",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "60/250",
      category: "JDM",

      format: "rocket-pack",
    });

    expect(product.category)
      .toBe("mainline");

    expect(product.format)
      .toBe("");
  });

  it("no infiere single fuera de la migración Mainline 2026 auditada", () => {
    const product = normalizeProduct({
      id: "HW-2027-FORMAT",
      title: "Producto 2027",
      price: "20",
      status: "Publicado",

      year: "2027",
      card_number: "60/250",
      category: "JDM",
    });

    expect(product.category)
      .toBe("");

    expect(product.categories)
      .toEqual([]);

    expect(product.explore_tags)
      .toEqual([
        "jdm",
      ]);

    expect(product.format)
      .toBe("");
  });
  it("migra mini_series determinística hacia series y set_number", () => {
    const product = normalizeProduct({
      id: "HWC26025",
      title: "McMurtry Spéirling",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "25/250",
      category: "Deportivos",

      mini_series:
        "Exoticars 2/10",
    });

    expect(product.series)
      .toBe(
        "Exoticars",
      );

    expect(product.set_number)
      .toBe(
        "2/10",
      );

    expect(product.mini_series)
      .toBe(
        "Exoticars 2/10",
      );
  });

  it("no inventa set_number para Layin Low", () => {
    const product = normalizeProduct({
      id: "HWC26017",
      title: "Bounce'n Bass",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "17/250",
      category: "Fantasía",

      mini_series:
        "Layin' Low",
    });

    expect(product.series)
      .toBe("");

    expect(product.set_number)
      .toBe("");

    expect(product.mini_series)
      .toBe(
        "Layin' Low",
      );
  });

  it("no propaga una posición imposible desde mini_series", () => {
    const product = normalizeProduct({
      id: "HWC26199",
      title:
        "Nissan Skyline GT-R (BNR34)",
      price: "20",
      status: "Publicado",

      year: "2026",
      card_number: "199/250",
      category: "JDM",

      mini_series:
        "HW J-Imports 11/10",
    });

    expect(product.series)
      .toBe("");

    expect(product.set_number)
      .toBe("");

    expect(product.mini_series)
      .toBe(
        "HW J-Imports 11/10",
      );
  });

  it("da prioridad a series y set_number canónicos explícitos", () => {
    const product = normalizeProduct({
      id: "HW-CANONICAL-SERIES",
      title: "Canonical Series",
      price: "20",
      status: "Publicado",

      mini_series:
        "Exoticars 2/10",

      series:
        "Car Culture",

      set_number:
        "3/5",
    });

    expect(product.series)
      .toBe(
        "Car Culture",
      );

    expect(product.set_number)
      .toBe(
        "3/5",
      );
  });

  it("no mezcla una fuente canónica parcial con mini_series legacy", () => {
    const product = normalizeProduct({
      id: "HW-PARTIAL-SERIES",
      title: "Partial Canonical",
      price: "20",
      status: "Publicado",

      mini_series:
        "Exoticars 2/10",

      series:
        "Car Culture",
    });

    expect(product.series)
      .toBe(
        "Car Culture",
      );

    expect(product.set_number)
      .toBe("");
  });

  it("preserva set_number explícito aislado sin completar series desde legacy", () => {
    const product = normalizeProduct({
      id: "HW-PARTIAL-SET",
      title: "Partial Set",
      price: "20",
      status: "Publicado",

      mini_series:
        "Exoticars 2/10",

      set_number:
        "4/5",
    });

    expect(product.series)
      .toBe("");

    expect(product.set_number)
      .toBe(
        "4/5",
      );
  });});