import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'

export default async function Footer() {
  return (
    <footer className="w-full bg-brand-light pt-24 pb-16 font-nunito border-t border-gray-100 relative overflow-hidden">
      {/* Decorative leaf/olive watermarks (using simple CSS shapes as placeholders for background images) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-no-repeat bg-contain opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 Z\' fill=\'%2361CE70\'/%3E%3C/svg%3E")' }}></div>

      <div className="content-container mx-auto px-8 relative z-10 w-full max-w-6xl">

        {/* 3-column footer links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[15px] text-gray-500 mb-12">

          {/* Col 1: Company */}
          <div className="flex flex-col gap-y-6 items-center">
            <h3 className="font-bold text-brand-dark tracking-widest text-sm mb-2">COMPANY</h3>
            <ul className="flex flex-col gap-y-4 text-center">
              <li><LocalizedClientLink href="/about" className="hover:text-brand-green transition-colors">About Us</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/contact" className="hover:text-brand-green transition-colors">Contact Us</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/privacy" className="hover:text-brand-green transition-colors">Privacy Policy</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/terms" className="hover:text-brand-green transition-colors">Terms &amp; Conditions</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Col 2: Shop */}
          <div className="flex flex-col gap-y-6 items-center">
            <h3 className="font-bold text-brand-dark tracking-widest text-sm mb-2">SHOP</h3>
            <ul className="flex flex-col gap-y-4 text-center">
              <li><LocalizedClientLink href="/categories/fresh-vegetables" className="hover:text-brand-green transition-colors">Fresh Vegetables</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/categories/local-fruits" className="hover:text-brand-green transition-colors">Local Fruits</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/categories/dairy" className="hover:text-brand-green transition-colors">Dairy</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/categories/meat-fish" className="hover:text-brand-green transition-colors">Meat &amp; Fish</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Col 3: Contact Us */}
          <div className="flex flex-col gap-y-6 items-center">
            <h3 className="font-bold text-brand-dark tracking-widest text-sm mb-2">CONTACT US</h3>
            <p className="text-center">Banani, Dhaka 1213, Bangladesh</p>
            <a href="mailto:hello@organichub.com.bd" className="hover:text-brand-green transition-colors">hello@organichub.com.bd</a>
            <a href="tel:+8801711000000" className="hover:text-brand-green transition-colors font-semibold">+880 1711-000000</a>

            {/* Social & Direct Contact Links */}
            <div className="flex flex-col items-center gap-3 mt-2">
              <span className="text-xs uppercase tracking-wider text-gray-400">Message Us On</span>
              <div className="flex items-center gap-6">
                <a
                  href="https://facebook.com/organichub"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-[#1877F2] transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://wa.me/8801711000000?text=Hello%20Organichub,%20I%20have%20a%20question"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-[#25D366] transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
