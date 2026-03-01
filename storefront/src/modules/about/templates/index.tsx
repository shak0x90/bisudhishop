import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CheckCircleSolid, Heart, BuildingStorefront } from "@medusajs/icons"

export default function AboutTemplate() {
    return (
        <div className="py-16 md:py-24 font-nunito">
            <div className="content-container mx-auto px-8">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="font-caveat text-2xl text-brand-green block mb-2">Our Story</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">About BisudhiShop</h1>
                    <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                        We started with one simple belief — every family in Dhaka deserves to eat food they can trust.
                        Food that's grown with care, free from chemicals, and delivered fresh to your door.
                    </p>
                </div>

                {/* Why We Started */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 bg-brand-warm rounded-3xl p-8 md:p-12 border border-amber-100">
                    <div className="order-2 md:order-1">
                        <span className="font-caveat text-xl text-brand-green block mb-2">Why we started</span>
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">A Dhaka Family's Problem</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Like many families in Dhaka, our founders grew up worrying about the food on the table.
                            Vegetables doused in formalin. Rice mixed with chemicals. Fish preserved with harmful agents.
                            The more we looked, the more we realized — the real, safe food was out there in the farms,
                            but there was no trustworthy way to get it to the city.
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            So we built one. BisudhiShop connects you directly to the farmers growing clean, honest food —
                            skipping the middlemen and the chemicals along the way.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "100% Naturally Sourced & Chemical Free",
                                "Supporting Local Bangladeshi Farmers",
                                "Strict Quality Control & Freshness Guarantee",
                                "Fast & Reliable Home Delivery in Dhaka"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center text-gray-700 font-medium">
                                    <CheckCircleSolid className="text-brand-green mr-3 w-5 h-5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg h-64 md:h-full min-h-[300px] relative">
                        <img
                            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000"
                            alt="Bangladeshi farmer with fresh produce in the field"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* How We Source */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <span className="font-caveat text-xl text-brand-green block mb-2">How we source</span>
                        <h2 className="text-3xl font-bold text-brand-dark">Community-First Sourcing</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-8 h-8 text-brand-green" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Authentic & Clean</h3>
                            <p className="text-gray-500 leading-relaxed">We work only with farmers who commit to growing without chemical fertilizers or pesticides. We verify this through farm visits and tested samples.</p>
                        </div>

                        <div className="text-center p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-[#FCF5EB] rounded-full flex items-center justify-center mx-auto mb-6">
                                <BuildingStorefront className="w-8 h-8 text-brand-peach" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Community First</h3>
                            <p className="text-gray-500 leading-relaxed">Every purchase directly supports small-scale farming families across Bangladesh. Fair prices, no exploitation — just honest trade that lifts real people.</p>
                        </div>

                        <div className="text-center p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-[#E9F5DB] rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">📦</span>
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">What You Can Expect</h3>
                            <p className="text-gray-500 leading-relaxed">Every order is packed hygienically in Dhaka and delivered within 24 hours of packing. If you're ever unhappy, we make it right — no long forms, no long waits.</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-brand-green bg-opacity-10 rounded-3xl p-12 border border-brand-green border-opacity-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">Ready to eat food you can trust?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of Dhaka families who've switched to cleaner, safer, naturally grown groceries.
                    </p>
                    <LocalizedClientLink
                        href="/store"
                        className="inline-block bg-brand-green text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-green-dark transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        Shop Fresh Groceries
                    </LocalizedClientLink>
                </div>

            </div>
        </div>
    )
}
