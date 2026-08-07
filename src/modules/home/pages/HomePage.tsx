import HeroSlider from "../sections/HeroSlider/HeroSlider";
import BenefitsSection from "../sections/BenefitsSection/BenefitsSection";
import CategoriesSection from "../sections/CategoriesSection/CategoriesSection";
import HowToBuySection from "../sections/HowToBuySection/HowToBuySection";

import HomeNav from "../components/HomeNav/HomeNav";
import HomeFooter from "../components/HomeFooter/HomeFooter";
import HomeFloatingButtons from "../components/HomeFloatingButtons/HomeFloatingButtons";

import { useCart } from "@/modules/cart/hooks/useCart";

export default function HomePage() {
  const { totalItems } = useCart();

  const handleCartClick = () => {
    window.location.href = "/catalogo";
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-950 font-sans text-white">
      <HomeNav
        cartCount={totalItems}
        onCartClick={handleCartClick}
      />

      <main>
        <HeroSlider />
        <BenefitsSection />
        <CategoriesSection />
        <HowToBuySection />
      </main>

      <HomeFooter />
      <HomeFloatingButtons />
    </div>
  );
}