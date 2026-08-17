import {
  useState,
} from "react";

import HeroSlider from "../sections/HeroSlider/HeroSlider";
import CategoriesSection from "../sections/CategoriesSection/CategoriesSection";
import HowToBuySection from "../sections/HowToBuySection/HowToBuySection";

import HomeNav from "../components/HomeNav/HomeNav";
import HomeFooter from "../components/HomeFooter/HomeFooter";

import {
  CartSidebar,
} from "@/modules/cart/components/CartSidebar";

import {
  useCart,
} from "@/modules/cart/hooks/useCart";

export default function HomePage() {
  const cart =
    useCart();

  const [
    cartOpen,
    setCartOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-950 font-sans text-white">
      <HomeNav
        cartCount={cart.totalItems}
        onCartClick={() =>
          setCartOpen(true)
        }
      />

      <main>
        <HeroSlider />
        <CategoriesSection />
        <HowToBuySection />
      </main>

      <HomeFooter />

      <CartSidebar
        isOpen={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
        onContinueShopping={() =>
          setCartOpen(false)
        }
        cart={cart.cart}
        totalItems={cart.totalItems}
        totalPrice={cart.totalPrice}
        savings={cart.savings}
        onRemove={cart.removeFromCart}
        onChangeQty={cart.changeQty}
        onSetQty={cart.setExactQty}
      />
    </div>
  );
}