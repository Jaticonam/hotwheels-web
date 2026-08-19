import "./HeaderBar.css";

import { SearchInput } from "@/modules/catalog/components/search/SearchInput";
import { BRAND_CONFIG } from "@/tenant/config/brand";
import type { Product } from "@/shared/types/product";

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products?: Product[];
}

export function HeaderBar({
  searchQuery,
  onSearchChange,
  products = [],
}: HeaderBarProps) {
  return (
    <div className="catalog-header-bar">
      <div className="catalog-header-bar-inner">
<div className="catalog-header-search">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            products={products}
            placeholder={BRAND_CONFIG.search.placeholder}
          />
        </div>
      </div>
    </div>
  );
}
