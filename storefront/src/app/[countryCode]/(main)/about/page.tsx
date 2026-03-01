import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"

export const metadata: Metadata = {
    title: "About Us | Organichub",
    description: "Learn more about Organichub, your trusted source for authentic Deshi groceries.",
}

export default function AboutPage() {
    return <AboutTemplate />
}
