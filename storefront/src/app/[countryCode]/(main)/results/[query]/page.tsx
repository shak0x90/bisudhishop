import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
    params: Promise<{
        countryCode: string
        query: string
    }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    return {
        title: `Search: ${decodeURIComponent(params.query)} | Organichub`,
    }
}

export default async function SearchResultsPage(props: Props) {
    const params = await props.params
    const query = decodeURIComponent(params.query)
    const region = await getRegion(params.countryCode)

    if (!region) {
        return <div className="content-container py-12 text-center">Region not found</div>
    }

    // Fetch products matching the search query
    const { response } = await listProducts({
        countryCode: params.countryCode,
        queryParams: {
            q: query,
            limit: 50,
        },
    })

    const { products, count } = response

    return (
        <div className="content-container py-8 px-4 md:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <LocalizedClientLink href="/" className="hover:text-brand-green transition-colors">
                    Home
                </LocalizedClientLink>
                <span>/</span>
                <span className="text-brand-dark font-medium">Search Results</span>
            </div>

            {/* Search header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
                    Search results for &ldquo;<span className="text-brand-green">{query}</span>&rdquo;
                </h1>
                <p className="text-gray-500 mt-2">
                    {count} {count === 1 ? "product" : "products"} found
                </p>
            </div>

            {/* Results grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductPreview
                            key={product.id}
                            product={product}
                            region={region}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">No products found</h2>
                    <p className="text-gray-400 mb-6">
                        Try searching with different keywords
                    </p>
                    <LocalizedClientLink
                        href="/store"
                        className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-brand-green-dark transition-colors font-bold text-sm"
                    >
                        Browse All Products
                    </LocalizedClientLink>
                </div>
            )}
        </div>
    )
}
