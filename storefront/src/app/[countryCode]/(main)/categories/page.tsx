import { Metadata } from "next"
import CategoriesTemplate from "@modules/categories-index/templates"

export const metadata: Metadata = {
    title: "Categories",
    description: "Browse all Organichub grocery categories.",
}

export default function CategoriesPage() {
    return <CategoriesTemplate />
}
