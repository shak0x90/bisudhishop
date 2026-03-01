import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MeetFarmers = () => {
    return (
        <section className="bg-brand-warm py-12 md:py-20 font-nunito">
            <div className="content-container mx-auto px-6 md:px-8">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

                    {/* Image side */}
                    <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-lg aspect-[4/3] relative flex-shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=900"
                            alt="A Bangladeshi farmer holding fresh vegetables in the field"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay badge */}
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md">
                            <p className="text-brand-green font-bold text-sm">🌿 Trusted Farmers Network</p>
                            <p className="text-gray-500 text-xs">Verified local growers, Dhaka & surroundings</p>
                        </div>
                    </div>

                    {/* Text side */}
                    <div className="w-full md:w-1/2">
                        <span className="font-caveat text-2xl text-brand-green block mb-2">Our Sourcing Story</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-5">
                            Meet the Farmers Behind Your Food
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Every product in your cart has a face behind it. We partner directly with small-scale Bangladeshi
                            farmers who grow without chemical pesticides — people who care deeply about what goes into the food
                            they grow for their own families.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            By buying from BisudhiShop, you're skipping the middlemen and putting your money directly into local
                            hands — supporting hundreds of farming families across Dhaka, Comilla, and Rajshahi districts.
                        </p>

                        {/* Trust stats */}
                        <div className="flex gap-6 mb-8">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-brand-green">50+</p>
                                <p className="text-xs text-gray-500">Local Farmers</p>
                            </div>
                            <div className="w-px bg-gray-200" />
                            <div className="text-center">
                                <p className="text-3xl font-bold text-brand-green">100%</p>
                                <p className="text-xs text-gray-500">Chemical-Free</p>
                            </div>
                            <div className="w-px bg-gray-200" />
                            <div className="text-center">
                                <p className="text-3xl font-bold text-brand-green">24h</p>
                                <p className="text-xs text-gray-500">Farm to Doorstep</p>
                            </div>
                        </div>

                        <LocalizedClientLink
                            href="/about"
                            className="inline-flex items-center gap-2 text-brand-green font-semibold hover:text-brand-green-dark transition-colors group"
                        >
                            Learn our story
                            <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </LocalizedClientLink>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default MeetFarmers
