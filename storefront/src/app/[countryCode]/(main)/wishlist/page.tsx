import { Metadata } from "next"
import WishlistTemplate from "@modules/wishlist/templates"

export const metadata: Metadata = {
    title: "Wishlist | Organichub",
    description: "View and manage your saved products.",
}

type Props = {
    params: Promise<{
        countryCode: string
    }>
}

export default async function WishlistPage(props: Props) {
    const params = await props.params

    return (
        <WishlistTemplate countryCode={params.countryCode} />
    )
}
