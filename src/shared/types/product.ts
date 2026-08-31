export interface Product {
  id: string;
  title: string;
  description: string;

  /**
   * Clasificación legacy vigente durante la migración.
   *
   * CAT-3 migrará category hacia las cuatro categorías
   * canónicas de Hot Wheels Taxonomy 1.0.
   */
  category: string;
  categories: string[];

  price: number;
  offer_price: number | null;

  stock: number | null;

  img: string;
  images?: string[];

  priority: number;
  status: string;

  badges: string[];
  attributes: string[];

  /**
   * Datos coleccionables existentes.
   */
  year?: number | null;
  case_code?: string;
  card_number?: string;
  mini_series?: string;

  /**
   * Dimensiones canónicas preparadas para Taxonomy 1.0.
   *
   * Permanecen opcionales mientras migramos las fuentes
   * de datos legacy. El dominio validará sus valores antes
   * de convertirlos en HotWheelsTaxonomy.
   */
  series?: string;
  collection?: string;

  format?: string;
  rarity?: string;

  manufacturer?: string;
  franchise?: string;
  style?: string;
  exclusivity?: string;

  updated_at?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}
