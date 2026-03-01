import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const DiscountBanners = () => {
    return (
        <div className="content-container mx-auto px-8 py-16 font-nunito flex flex-col md:flex-row gap-6">

            {/* Banner Left: 30% OFF */}
            <div className="flex-1 rounded-md overflow-hidden bg-gradient-to-r from-[#E9F3D3] to-[#F1F7E3] h-[300px] flex items-center p-12 relative group cursor-pointer transition-shadow hover:shadow-lg">
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-gray-600 font-bold tracking-widest text-sm uppercase">Everything with code:</span>
                        <span className="bg-[#E46B4E] text-white px-3 py-1 text-sm font-bold skew-x-[-10deg]">DESHI30</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="font-caveat text-5xl text-brand-green">Fresh<br />BAZAR</span>
                        <span className="text-6xl font-extrabold text-[#333]"> 30<span className="text-2xl font-bold">% OFF</span></span>
                    </div>
                    <LocalizedClientLink href="/store">
                        <Button className="bg-brand-green hover:bg-brand-green-dark text-white border-none rounded-sm px-8 py-3 text-xs font-bold uppercase tracking-wider">SHOP NOW</Button>
                    </LocalizedClientLink>
                </div>
            </div>

            {/* Banner Right: 20% OFF */}
            <div className="w-full md:w-[40%] rounded-md overflow-hidden bg-[#E5F1FC] h-[300px] flex flex-col justify-center p-10 relative group cursor-pointer transition-shadow hover:shadow-lg">
                <div className="relative z-10 max-w-[60%]">
                    <h3 className="text-2xl font-bold text-brand-dark mb-1">Healthy Family<br />Bazar Box</h3>
                    <div className="text-brand-red text-4xl font-extrabold mb-6">20<span className="text-xl font-bold text-brand-dark">% OFF</span></div>
                    <LocalizedClientLink href="/store">
                        <Button className="bg-brand-green hover:bg-brand-green-dark text-white border-none rounded-sm px-6 py-2 text-xs font-bold uppercase tracking-wider">SHOP NOW</Button>
                    </LocalizedClientLink>
                </div>
                <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-1/2">
                    <img src="https://placehold.co/400x300/E5F1FC/E5F1FC" alt="Healthy Box" className="object-cover mix-blend-multiply drop-shadow-lg" />
                </div>
            </div>

        </div>
    )
}

export default DiscountBanners
