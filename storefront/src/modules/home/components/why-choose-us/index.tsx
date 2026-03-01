const features = [
    {
        icon: (
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                <path d="M24 12c-4 2-8 8-6 14s8 10 6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 18c2 4 8 6 12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 28c4 2 10 0 12-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        title: "100% Organic",
        description: "Every spice & grain is organically grown, free from chemicals and pesticides.",
    },
    {
        icon: (
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="20" width="40" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M4 26h40" stroke="currentColor" strokeWidth="2" />
                <path d="M16 8l8 12 8-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="24" cy="33" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        title: "Farm Direct",
        description: "Sourced straight from trusted Bangladeshi farmers with zero middlemen.",
    },
    {
        icon: (
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4l5 10 11 1.5-8 7.5 2 11L24 29l-10 5 2-11-8-7.5L19 14l5-10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        ),
        title: "Premium Quality",
        description: "Stone-ground, sun-dried, and hand-selected for the best aroma and flavour.",
    },
    {
        icon: (
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="14" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="14" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
                <circle cx="28" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="M32 20h8l4 8v8h-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        ),
        title: "Fast Delivery",
        description: "Swift delivery across Dhaka. Your spices reach you fresh and on time.",
    },
]

const WhyChooseUs = () => {
    return (
        <div className="bg-gradient-to-b from-white to-[#f8faf5] py-14 font-nunito">
            <div className="content-container mx-auto px-6 md:px-8">
                <div className="text-center mb-10">
                    <span className="font-caveat text-2xl text-brand-green">Why BisudhiShop?</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mt-1">
                        The Bisudhi Promise
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-50"
                        >
                            <div className="text-brand-green mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-brand-dark font-bold text-base mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WhyChooseUs
