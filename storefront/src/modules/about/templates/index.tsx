import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BuildingStorefront, CheckCircleSolid, Heart, InformationCircleSolid } from "@medusajs/icons"

export default function AboutTemplate() {
    return (
        <div className="py-16 md:py-24 font-nunito">
            <div className="content-container mx-auto px-8">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">About Organichub</h1>
                    <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                        Welcome to Organichub, Bangladesh's trusted source for farm-fresh, authentic, and naturally grown groceries delivered straight to your door.
                    </p>
                </div>

                {/* Brand Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 bg-ui-bg-subtle rounded-3xl p-8 md:p-12 border border-gray-100">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">Our Mission</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            We started Organichub with a simple goal: to connect local Bangladeshi farmers directly with families in Dhaka and beyond.
                            In a world of highly processed foods, we want to bring back the authentic taste of Deshi vegetables, pure riveren fish, and unadulterated spices.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "100% Naturally Sourced & Chemical Free",
                                "Supporting Local Bangladeshi Farmers",
                                "Strict Quality Control & Freshness Guarantee",
                                "Fast & Reliable Home Delivery"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center text-gray-700 font-medium">
                                    <CheckCircleSolid className="text-brand-green mr-3 w-5 h-5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg h-64 md:h-full min-h-[300px] relative">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000"
                            alt="Fresh organic groceries"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-[#DFF7F9] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-8 h-8 text-brand-green" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Authenticity</h3>
                            <p className="text-gray-500">We believe in real food. No artificial preservatives, just the pure, authentic taste of Bangladesh.</p>
                        </div>

                        <div className="text-center p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-[#FCF5EB] rounded-full flex items-center justify-center mx-auto mb-6">
                                <BuildingStorefront className="w-8 h-8 text-[#E2A03F]" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Community First</h3>
                            <p className="text-gray-500">By purchasing from Organichub, you are directly supporting small-scale farmers and rural communities.</p>
                        </div>

                        <div className="text-center p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-[#FCEDEF] rounded-full flex items-center justify-center mx-auto mb-6">
                                <InformationCircleSolid className="w-8 h-8 text-[#E15A6B]" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Transparency</h3>
                            <p className="text-gray-500">We trace every product back to its farm. You always know exactly where your food comes from.</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-brand-green bg-opacity-10 rounded-3xl p-12 border border-brand-green border-opacity-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">Ready to eat fresh?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Experience the difference of organically sourced, chemical-free groceries today.
                    </p>
                    <LocalizedClientLink
                        href="/store"
                        className="inline-block bg-brand-green text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        Start Shopping
                    </LocalizedClientLink>
                </div>

            </div>
        </div>
    )
}
