export function ProductCardSkeleton() {
  return (
    <article
      className="product-card product-card-skeleton"
      aria-hidden="true"
    >
      <div className="product-card-skeleton-media">
        <div className="catalog-skeleton product-card-skeleton-image" />

        <div className="product-card-skeleton-badges">
          <div className="catalog-skeleton product-card-skeleton-badge" />
          <div className="catalog-skeleton product-card-skeleton-badge" />
        </div>
      </div>

      <div className="product-card-skeleton-body">
        <div className="catalog-skeleton product-card-skeleton-title" />

        <div className="catalog-skeleton product-card-skeleton-series" />

        <div className="catalog-skeleton product-card-skeleton-meta" />

        <div className="product-card-skeleton-commerce">
          <div className="catalog-skeleton product-card-skeleton-price" />
          <div className="catalog-skeleton product-card-skeleton-stock" />
        </div>

        <div className="catalog-skeleton product-card-skeleton-cta" />
      </div>
    </article>
  );
}

export function CatalogSkeleton() {
  return (
    <div
      className="catalog-grid"
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
