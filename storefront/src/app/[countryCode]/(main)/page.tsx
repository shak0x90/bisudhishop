import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import FreshThisWeek from "@modules/home/components/all-products"
import WhyChooseUs from "@modules/home/components/why-choose-us"
import Categories from "@modules/home/components/categories"
import MeetFarmers from "@modules/home/components/meet-farmers"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
      {/* 1️⃣ Hero — emotional */}
      <Hero slides={slides} />

      {/* 2️⃣ Farmer story */}
      <MeetFarmers />

      {/* 3️⃣ Fresh This Week — 6-8 products, curated feel */}
      <FreshThisWeek countryCode={countryCode} />

      {/* 4️⃣ Why Families Trust Us */}
      <WhyChooseUs />

      {/* 5️⃣ Categories */}
      <Categories />

      {/* 6️⃣ Final CTA */}
      <section className="bg-brand-green py-16 font-nunito text-center">
        <div className="content-container mx-auto px-6">
          <span className="font-caveat text-2xl text-brand-green-light block mb-2">Ready to order?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your weekly basket, delivered fresh.
          </h2>
          <p className="text-brand-green-light text-lg mb-8 max-w-xl mx-auto">
            Join Dhaka families eating cleaner, safer, and more delicious food every week.
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-block bg-white text-brand-green font-bold py-3 px-10 rounded-xl hover:bg-brand-cream transition-all shadow-lg text-sm uppercase tracking-wider"
          >
            Shop Fresh Groceries
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
