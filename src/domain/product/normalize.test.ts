import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ensureCatalogProduct,
} from "./normalize";

describe("ensureCatalogProduct", () => {
  it("preserva los datos coleccionables existentes", () => {
    const product =
      ensureCatalogProduct({
        id: "HW-001",
        title: "Nissan Skyline GT-R",
        description: "",
        category: "premium",
        categories: ["premium"],
        price: 59.9,
        offer_price: null,
        stock: 2,
        img: "/hw-001.jpg",
        images: [],
        priority: 0,
        status: "Publicado",
        badges: [],
        attributes: [],

        year: 2026,
        case_code: "A",
        card_number: "123/250",
        mini_series: "HW J-Imports 3/10",
      });

    expect(product.year)
      .toBe(2026);

    expect(product.case_code)
      .toBe("A");

    expect(product.card_number)
      .toBe("123/250");

    expect(product.mini_series)
      .toBe("HW J-Imports 3/10");
  });

  it("preserva las dimensiones preparadas para Taxonomy 1.0", () => {
    const product =
      ensureCatalogProduct({
        id: "HW-002",
        title: "Porsche 911",
        category: "premium",
        categories: ["premium"],
        price: 69.9,

        series: "Car Culture",
        collection: "Modern Classics",
        set_number: "3/5",
        format: "single",
        rarity: "chase",
        manufacturer: "Porsche",
        franchise: "",
        style: "euro",
        exclusivity: "retailer-exclusive",
      });

    expect(product.series)
      .toBe("Car Culture");

    expect(product.collection)
      .toBe("Modern Classics");

    expect(product.set_number)
      .toBe("3/5");

    expect(product.format)
      .toBe("single");

    expect(product.rarity)
      .toBe("chase");

    expect(product.manufacturer)
      .toBe("Porsche");

    expect(product.style)
      .toBe("euro");

    expect(product.exclusivity)
      .toBe("retailer-exclusive");
  });

  it("no inventa clasificación coleccionable cuando no existe", () => {
    const product =
      ensureCatalogProduct({
        id: "HW-003",
        title: "Hot Wheels Test",
        price: 10,
      });

    expect(product.category)
      .toBe("");

    expect(product.categories)
      .toEqual([]);

    expect(product.series)
      .toBe("");

    expect(product.collection)
      .toBe("");

    expect(product.set_number)
      .toBe("");

    expect(product.format)
      .toBe("");

    expect(product.rarity)
      .toBe("");

    expect(product.manufacturer)
      .toBe("");

    expect(product.exclusivity)
      .toBe("");
  });

  it("preserva explore_tags sin convertirlos en categorías", () => {
    const product =
      ensureCatalogProduct({
        id: "HW-EXPLORE-001",
        title: "Nissan Skyline",
        description: "",

        category: "mainline",
        categories: [
          "mainline",
        ],

        price: 20,
        offer_price: null,
        stock: 1,

        img: "",
        images: [],

        priority: 0,
        status: "Publicado",

        badges: [],
        attributes: [],

        explore_tags: [
          "jdm",
        ],
      });

    expect(
      product.category,
    ).toBe(
      "mainline",
    );

    expect(
      product.categories,
    ).toEqual([
      "mainline",
    ]);

    expect(
      product.explore_tags,
    ).toEqual([
      "jdm",
    ]);
  });});
