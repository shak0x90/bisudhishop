import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import PromoBanners from "@modules/home/components/promo-banners"
import Categories from "@modules/home/components/categories"
import DiscountBanners from "@modules/home/components/discount-banners"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Organichub — Fresh Deshi Groceries & Organic Foods",
  description:
    "Shop fresh, locally sourced organic groceries delivered to your doorstep in Dhaka. Vegetables, fruits, meat, fish, dairy and more.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  // Fetch Slides on the server side to bypass Client-Cache
  let slides = []
  try {
    // Ping the backend Medusa URL directly from Server Component
    const backendRes = await fetch(`${process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/slides`, {
      method: "GET",
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_37f92240d57a09b0836cefe27e2280eed9116abc1c312d34f0013757c2f4111c"
      },
      next: { revalidate: 0 },
      cache: 'no-store'
    })

    if (backendRes.ok) {
      const data = await backendRes.json()
      if (data.slides) {
        slides = data.slides
      }
    }
  } catch (err) {
    console.error("Failed to fetch slides on server", err)
  }

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero slides={slides} />
      <PromoBanners />
      <Categories />
      <div className="py-2">
        <FeaturedProducts collections={collections} region={region} />
      </div>
      <DiscountBanners />
    </>
  )
}
