import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import QuickAddToCart from "./quick-add"

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

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 font-nunito flex flex-col items-center p-3 sm:p-4 overflow-hidden">
      {/* Badges */}
      {isSale && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold uppercase rounded-full w-10 h-10 flex items-center justify-center z-20 shadow-sm">
          SALE!
        </div>
      )}

      {/* Image container */}
      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden mb-3 rounded-lg bg-gray-50">
        <LocalizedClientLink href={`/products/${product.handle}`} className="w-full h-full flex items-center justify-center">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </LocalizedClientLink>

        {/* Quick Add to Cart overlay */}
        {firstVariantId && !hasMultipleVariants ? (
          <QuickAddToCart variantId={firstVariantId} productHandle={product.handle!} productId={product.id} />
        ) : (
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="absolute bottom-0 left-0 w-full bg-brand-green translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 text-white py-3 opacity-0 group-hover:opacity-100 z-10 px-4 text-sm font-bold uppercase tracking-wider hover:bg-brand-green-dark"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            Select Options
          </LocalizedClientLink>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col items-center w-full mt-1 z-20 bg-white gap-1">
        <LocalizedClientLink href={`/products/${product.handle}`} className="text-center w-full">
          <h3 className="text-brand-dark font-semibold text-sm leading-tight line-clamp-2 hover:text-brand-green transition-colors" data-testid="product-title">
            {product.title}
          </h3>
        </LocalizedClientLink>
        {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
      </div>
    </div>
  )
}
