import {
  ProductCardSkeleton,
} from "./CatalogSkeleton";

export function CategorySkeleton() {
  return (
    <div
      className="category-page-grid"
      data-aos="fade-up"
      data-aos-delay="150"
      aria-hidden="true"
      aria-label="Cargando productos"
    >
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <ProductCardSkeleton
          key={index}
        />
      ))}
    </div>
  );
}
