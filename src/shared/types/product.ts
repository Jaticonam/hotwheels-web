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
   * Datos coleccionables esenciales del Nivel 1.
   */
  year?: number | null;
  case_code?: string;
  card_number?: string;
  mini_series?: string;

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