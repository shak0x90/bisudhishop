import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Categories = () => {
    const customCategories = [
        { title: "Fresh Vegetables", img: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=400&fit=crop", bg: "bg-[#DFF7F9]", link: "/categories/fresh-vegetables" },
        { title: "Local Fruits", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop", bg: "bg-[#FCF5EB]", link: "/categories/local-fruits" },
        { title: "Meat & Fish", img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop", bg: "bg-[#FCEDEF]", link: "/categories/meat-fish" },
        { title: "Dairy & Eggs", img: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop", bg: "bg-[#E8F5E9]", link: "/categories/dairy" },
        { title: "Spices", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop", bg: "bg-[#F5F5ED]", link: "/categories/spices" },
        { title: "Snacks", img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop", bg: "bg-[#F0F0FC]", link: "/categories/snacks" }
    ];

    return (
        <div className="content-container mx-auto px-8 py-16 font-nunito">
            <h2 className="text-3xl font-bold text-brand-dark mb-10 text-center md:text-left">Shop by Categories</h2>
            <div className="flex flex-nowrap overflow-x-auto gap-6 sm:grid sm:grid-cols-3 md:grid-cols-6 no-scrollbar pb-4 md:pb-0">
                {customCategories.map((cat, idx) => (
                    <LocalizedClientLink href={cat.link} key={idx} className="flex flex-col items-center group min-w-[140px]">
                        <div className={`w-full aspect-square relative rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:-translate-y-2 group-hover:shadow-lg mb-3 shadow-sm border-2 border-transparent group-hover:border-brand-green`}>
                            <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-brand-dark font-semibold text-sm text-center group-hover:text-brand-green transition-colors">{cat.title}</span>
                    </LocalizedClientLink>
                ))}
            </div>
        </div>
    )
}

export default Categories
