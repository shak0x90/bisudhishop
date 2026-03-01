import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "./price"
import QuickAddToCart from "./quick-add"
import ProductImage from "./product-image"
import WishlistButton from "./wishlist-button"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Simulated badge logic based on price type or arbitrary logic setup
  const isSale = cheapestPrice?.price_type === "sale"

  // Get the first variant ID for quick add-to-cart
  const firstVariantId = product.variants?.[0]?.id
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  // Trust line: use category name or fallback
  const categoryName = product.categories?.[0]?.name?.toLowerCase() ?? ""
  const trustLineMap: Record<string, string> = {
    "spices": "Freshly ground & sourced",
    "rice": "Direct from paddy fields",
    "vegetables": "Seasonal harvest",
    "fish": "Fresh catch, hygienically packed",
    "lentils": "Local farmer selection",
    "oils": "Cold-pressed, natural",
  }
  const trustLine = Object.entries(trustLineMap).find(([key]) => categoryName.includes(key))?.[1]
    ?? "Freshly packed in Dhaka"

  // Badge logic
  const badge = isSale ? "SALE" : null

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 font-nunito flex flex-col items-center p-3 sm:p-4 overflow-hidden">
      {/* Badges */}
      {isSale && (
        <div className="absolute top-3 right-3 bg-brand-red text-white text-[10px] font-bold uppercase rounded-full w-10 h-10 flex items-center justify-center z-20 shadow-sm">
          SALE!
        </div>
      )}

      {/* Image container — fixed square, consistent across all products */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <div className="absolute inset-0 bg-gray-50 rounded-lg overflow-hidden">
          <LocalizedClientLink href={`/products/${product.handle}`} className="w-full h-full block">
            <ProductImage
              src={product.thumbnail || product.images?.[0]?.url}
              alt={product.title}
            />
          </LocalizedClientLink>

          {/* Desktop overlay (hover-triggered) — hidden on mobile */}
          <div className="hidden md:block">
            {firstVariantId && !hasMultipleVariants ? (
              <QuickAddToCart variant="overlay" variantId={firstVariantId} productHandle={product.handle!} productId={product.id} />
            ) : (
              <LocalizedClientLink
                href={`/products/${product.handle}`}
                className="absolute bottom-0 left-0 w-full bg-brand-green translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 text-white py-2.5 opacity-0 group-hover:opacity-100 z-10 px-4 text-xs font-bold uppercase tracking-wider hover:bg-brand-green-dark"
              >
                Select Options
              </LocalizedClientLink>
            )}
          </div>

          {/* Wishlist ♡ — mobile only (md:hidden). Desktop overlay already includes it */}
          <div className="md:hidden">
            {firstVariantId && !hasMultipleVariants && (
              <WishlistButton productId={product.id} />
            )}
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-col items-center w-full mt-2 z-20 bg-white gap-0.5">
        <LocalizedClientLink href={`/products/${product.handle}`} className="text-center w-full">
          <h3 className="text-brand-dark font-semibold text-sm leading-tight line-clamp-2 hover:text-brand-green transition-colors" data-testid="product-title">
            {product.title}
          </h3>
        </LocalizedClientLink>
        <p className="text-xs text-brand-sage font-medium">{trustLine}</p>
        {cheapestPrice && <PreviewPrice price={cheapestPrice} />}

        {/* Mobile CTA — always visible, hidden on md+ where hover overlay takes over */}
        <div className="w-full md:hidden">
          {firstVariantId && !hasMultipleVariants ? (
            <QuickAddToCart variant="inline" variantId={firstVariantId} productHandle={product.handle!} productId={product.id} />
          ) : (
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="w-full mt-2 flex items-center justify-center py-2 rounded-lg bg-brand-green text-white text-xs font-bold uppercase tracking-wider active:bg-brand-green-dark transition-colors"
            >
              Select Options
            </LocalizedClientLink>
          )}
        </div>
      </div>
    </div>
  )
}
