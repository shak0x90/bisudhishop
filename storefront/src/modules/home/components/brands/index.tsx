const Brands = () => {
    // Placeholder images for the brand logos
    const brandLogos = [
        "https://placehold.co/150x100/FFF/333?text=OrganicFarm",
        "https://placehold.co/150x100/FFF/F9A174?text=JuiceDrop",
        "https://placehold.co/150x100/FFF/61CE70?text=OrganicPure",
        "https://placehold.co/150x100/FFF/333?text=ProjectJuice",
        "https://placehold.co/150x100/FFF/4A90E2?text=FreshMilk",
        "https://placehold.co/150x100/FFF/333?text=Organic+Co"
    ];

    return (
        <div className="content-container mx-auto px-8 py-16 font-nunito">
            <h2 className="text-2xl font-bold text-brand-dark mb-12">Shop by brands</h2>
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-8 opacity-70">
                {brandLogos.map((logo, index) => (
                    <img
                        key={index}
                        src={logo}
                        alt={`Brand ${index + 1}`}
                        className="h-16 md:h-20 object-contain hover:opacity-100 transition-opacity cursor-pointer mx-auto"
                    />
                ))}
            </div>
        </div>
    )
}

export default Brands
