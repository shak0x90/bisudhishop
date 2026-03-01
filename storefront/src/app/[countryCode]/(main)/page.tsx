import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import AllProducts from "@modules/home/components/all-products"
import WhyChooseUs from "@modules/home/components/why-choose-us"
import Categories from "@modules/home/components/categories"

export const metadata: Metadata = {
  title: "BisudhiShop — Premium Organic Spices & Rice",
  description:
    "Shop premium organic spices, aromatic rice, and curated gift boxes. 100% natural, farm-direct from Bangladesh.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  // Fetch Slides on the server side
  let slides: any[] = []
  try {
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

  return (
    <>
      <Hero slides={slides} />
      <AllProducts countryCode={countryCode} />
      <WhyChooseUs />
      <Categories />
    </>
  )
}
