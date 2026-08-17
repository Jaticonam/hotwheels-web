export interface CatalogNavItem {
  id: string;
  name: string;
  icon?: string;
}

export interface CatalogTopNavProps {
  categoryItems: CatalogNavItem[];

  activeCategory?: string;

  categoryCounts?: Record<string, number>;

  onCategorySelect?: (
    id: string,
  ) => void;

  exploreOpen?: boolean;

  onExploreOpenChange?: (
    open: boolean,
  ) => void;

  searchSlot?: React.ReactNode;
  logoSlot?: React.ReactNode;
}