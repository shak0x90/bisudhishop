import { Metadata } from "next"
import TrackingTemplate from "@modules/tracking/templates"

export const metadata: Metadata = {
    title: "Track Order",
    description: "Track the status of your Organichub order.",
}

export default function TrackingPage() {
    return <TrackingTemplate />
}
