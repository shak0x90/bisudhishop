import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Caveat, Nunito } from "next/font/google"
import { WishlistProvider } from "@lib/context/wishlist-context"

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${caveat.variable} ${nunito.variable}`}>
      <body className="font-sans text-brand-dark">
        <WishlistProvider>
          <main className="relative">{props.children}</main>
        </WishlistProvider>
      </body>
    </html>
  )
}
