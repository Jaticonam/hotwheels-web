export interface Product {
  id: string;
  title: string;
  description: string;

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
   * Metadata propia del dominio de autos coleccionables.
   * Es opcional para conservar compatibilidad con fuentes MVP antiguas.
   */
  brand?: string;
  line?: string;
  series?: string;

  year?: number | null;
  scale?: string;

  mattel_code?: string;
  case_code?: string;

  rarity?: string;
  card_condition?: string;
  vehicle_condition?: string;

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