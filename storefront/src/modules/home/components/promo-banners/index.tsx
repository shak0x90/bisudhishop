import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PromoBanners = () => {
    return (
        <div className="content-container mx-auto px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Banner 1 */}
                <div className="relative rounded-md overflow-hidden bg-[#E2F0D9] h-56 flex items-center p-8 group cursor-pointer transition-shadow hover:shadow-lg">
                    <div className="relative z-10 w-2/3">
                        <h3 className="text-2xl text-brand-dark font-bold mb-2">Deshi Vegetables</h3>
                        <p className="text-brand-green mb-4 font-semibold text-lg">Up to 20% off</p>
                        <LocalizedClientLink href="/categories/fresh-vegetables">
                            <Button className="bg-brand-green hover:bg-brand-green-dark text-white border-none rounded-sm px-6 py-2 text-xs font-bold uppercase tracking-wider">SHOP NOW</Button>
                        </LocalizedClientLink>
                    </div>
                </div>

                {/* Banner 2 */}
                <div className="relative rounded-md overflow-hidden bg-[#FBF0E4] h-56 flex items-center p-8 group cursor-pointer transition-shadow hover:shadow-lg">
                    <div className="relative z-10 w-2/3">
                        <h3 className="text-2xl text-brand-dark font-bold mb-2">Daily Bazar</h3>
                        <p className="text-brand-orange mb-4 font-semibold text-lg">Fresh &amp; Local</p>
                        <LocalizedClientLink href="/store">
                            <Button className="bg-brand-green hover:bg-brand-green-dark text-white border-none rounded-sm px-6 py-2 text-xs font-bold uppercase tracking-wider">SHOP NOW</Button>
                        </LocalizedClientLink>
                    </div>
                </div>

                {/* Banner 3 */}
                <div className="relative rounded-md overflow-hidden bg-[#A3D9E9] h-56 flex items-center p-8 group cursor-pointer transition-shadow hover:shadow-lg">
                    <div className="relative z-10 w-2/3">
                        <h3 className="text-2xl text-brand-dark font-bold mb-2">100% Organic</h3>
                        <p className="text-white mb-4 font-semibold text-lg">Daily Essentials</p>
                        <LocalizedClientLink href="/store">
                            <Button className="bg-brand-green hover:bg-brand-green-dark text-white border-none rounded-sm px-6 py-2 text-xs font-bold uppercase tracking-wider">SHOP NOW</Button>
                        </LocalizedClientLink>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PromoBanners
