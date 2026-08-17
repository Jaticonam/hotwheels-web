export function ProductSkeleton() {
  return (
    <div
      className="product-detail-page"
      aria-hidden="true"
      aria-label="Cargando producto"
    >
      <main className="product-detail-skeleton-page">
        <div className="product-detail-skeleton-grid">
          <div className="product-detail-skeleton-gallery">
            <div className="catalog-skeleton h-full w-full" />
          </div>

          <section className="product-detail-skeleton-panel">
            <div className="catalog-skeleton h-3 w-24 rounded-full" />

            <div className="catalog-skeleton h-10 w-4/5 rounded-xl" />

            <div className="product-detail-skeleton-badges">
              <div className="catalog-skeleton h-7 w-20 rounded-full" />
              <div className="catalog-skeleton h-7 w-24 rounded-full" />
            </div>

            <div className="space-y-2">
              <div className="catalog-skeleton h-3 w-full rounded-full" />
              <div className="catalog-skeleton h-3 w-5/6 rounded-full" />
            </div>

            <div className="product-detail-skeleton-facts">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-xl border border-border p-3"
                >
                  <div className="catalog-skeleton h-2 w-10 rounded-full" />
                  <div className="catalog-skeleton h-4 w-14 rounded-full" />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="catalog-skeleton h-8 w-24 rounded-full" />
              <div className="catalog-skeleton h-8 w-20 rounded-full" />
            </div>

            <div className="border-t border-border pt-4">
              <div className="catalog-skeleton h-3 w-20 rounded-full" />

              <div className="mt-2 catalog-skeleton h-10 w-36 rounded-xl" />
            </div>

            <div className="catalog-skeleton h-16 w-full rounded-2xl" />

            <div className="product-detail-skeleton-actions">
              <div className="catalog-skeleton h-12 w-full rounded-xl" />
              <div className="catalog-skeleton h-12 w-full rounded-xl" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
