import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  const homePageCollection = collections.find(c => c.handle === "home-page")

  if (!homePageCollection) {
    return null
  }

  // Fetch up to 10 products to display in the grid
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: [homePageCollection.id],
      fields: "*variants.calculated_price",
      limit: 10,
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <div className="content-container mx-auto px-4 lg:px-8 py-8 md:py-12 font-nunito w-full">

      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-8 md:mb-10 text-center md:text-left">Featured Products</h2>

      {/* Product Grid */}
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>

    </div>
  )
}
