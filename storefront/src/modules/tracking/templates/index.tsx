"use client"

import { useState } from "react"
import { Heading, Text, Button, Container } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import { retrieveOrder } from "@lib/data/orders"
import ErrorMessage from "@modules/checkout/components/error-message"
import { HttpTypes } from "@medusajs/types"

const TrackingTemplate = () => {
    const [orderId, setOrderId] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!orderId) {
            setError("Please enter an Order ID.")
            return
        }

        // Strip whitespace just in case
        const cleanOrderId = orderId.trim()

        // Validate that it looks like a Medusa Order ID.
        // Medusa Order IDs usually start with 'order_'
        if (!cleanOrderId.startsWith("order_") && cleanOrderId.length < 10) {
            setError("Please enter a valid Medusa Order ID. It should look like 'order_01...'. This is NOT your courier tracking number.")
            return
        }

        setLoading(true)
        setError(null)
        setOrder(null)

        try {
            // The id needs to start with 'order_'
            const formattedId = cleanOrderId.startsWith("order_") ? cleanOrderId : `order_${cleanOrderId}`
            const fetchedOrder = await retrieveOrder(formattedId)

            if (!fetchedOrder) {
                setError("Order not found. Please check your Order ID and try again.")
            } else {
                // Optional email verification layer
                if (email && fetchedOrder.email !== email) {
                    setError("The email provided does not match the order records.")
                } else {
                    setOrder(fetchedOrder as HttpTypes.StoreOrder)
                }
            }
        } catch (err: any) {
            setError("An error occurred while tracking the order. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Helper to format currency
    const formatAmount = (amount?: number, currencyCode?: string) => {
        if (amount === undefined || amount === null) return "N/A"
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode || "BDT",
        }).format(amount)
    }

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <div className="py-12 bg-ui-bg-subtle min-h-screen">
            <div className="content-container flex justify-center">
                <div className="max-w-2xl w-full flex flex-col gap-y-8">

                    <Container className="p-8">
                        <div className="mb-6 text-center text-brand-dark">
                            <Heading level="h1" className="text-3xl mb-2 text-brand-green font-nunito font-extrabold tracking-wide uppercase">Track Your Order</Heading>
                            <Text className="text-ui-fg-subtle">
                                Enter your Medusa <span className="font-semibold text-brand-dark">Order ID</span> to check your delivery status.
                            </Text>
                            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-left text-sm text-brand-dark">
                                <span className="font-semibold flex items-center gap-2 mb-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    Where to find your Order ID
                                </span>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Check your order confirmation email.</li>
                                    <li>If you are viewing your <strong>Order Details</strong> in your account, look at the web browser's URL address bar. It is the long text starting with <code className="bg-orange-100 px-1 py-0.5 rounded text-orange-800">order_</code> at the very end.</li>
                                </ul>
                                <p className="mt-2 text-red-600 font-semibold">⚠️ Do not enter the short "Order number" (e.g., 4) or your courier tracking number.</p>
                            </div>
                        </div>

                        <form onSubmit={handleTrack} className="flex flex-col gap-y-4 font-nunito font-semibold">
                            <Input
                                label="Order ID (e.g. order_01...)"
                                name="order_id"
                                required
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                            />
                            <Input
                                label="Email Address (Optional)"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {error && <ErrorMessage error={error} />}
                            <Button type="submit" isLoading={loading} className="w-full mt-4 h-12 bg-brand-green hover:bg-green-700 text-base">
                                Track Order Status
                            </Button>
                        </form>
                    </Container>

                    {order && (
                        <Container className="p-8 mt-8">
                            <Heading level="h2" className="text-2xl mb-6 font-nunito font-bold text-brand-dark uppercase">Order Details</Heading>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <Text className="text-ui-fg-subtle text-small-regular">Order Number</Text>
                                    <Text className="font-semibold">{order.display_id}</Text>
                                </div>
                                <div>
                                    <Text className="text-ui-fg-subtle text-small-regular">Date Placed</Text>
                                    <Text className="font-semibold">{formatDate(order.created_at)}</Text>
                                </div>
                                <div>
                                    <Text className="text-ui-fg-subtle text-small-regular">Order Status</Text>
                                    <div className="mt-1">
                                        <span className="bg-ui-bg-base border border-ui-border-base px-3 py-1 rounded-full text-small-semibold">
                                            {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : "Pending"}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Text className="text-ui-fg-subtle text-small-regular">Payment Status</Text>
                                    <div className="mt-1">
                                        <span className="bg-ui-bg-base border border-ui-border-base px-3 py-1 rounded-full text-small-semibold">
                                            {order.payment_status ? order.payment_status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Unpaid"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Fulfillments and Tracking */}
                            {order.fulfillments && order.fulfillments.length > 0 && (
                                <div className="border-t border-ui-border-base pt-6 mb-8">
                                    <Heading level="h3" className="text-lg mb-4 font-nunito font-bold text-brand-dark">Shipping Tracking Data</Heading>
                                    <div className="flex flex-col gap-y-4">
                                        {order.fulfillments.map((fulfillment: any, idx: number) => (
                                            <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                                <Text className="font-semibold text-brand-dark mb-2">Fulfillment #{idx + 1}</Text>
                                                <Text className="text-small-regular text-ui-fg-subtle mb-3">
                                                    Provider: {fulfillment.provider_id || "Manual"}
                                                </Text>
                                                {fulfillment.labels && fulfillment.labels.length > 0 ? (
                                                    <div className="flex flex-col gap-2">
                                                        {fulfillment.labels.map((label: any, labelIdx: number) => (
                                                            <div key={labelIdx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                <span className="text-sm font-semibold text-brand-green">Tracking Number:</span>
                                                                {label.tracking_url ? (
                                                                    <a href={label.tracking_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm break-all font-mono">
                                                                        {label.tracking_number}
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-sm font-mono bg-white px-2 py-1 border rounded">{label.tracking_number}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Text className="text-sm italic text-gray-500">No courier tracking number assigned yet.</Text>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-ui-border-base pt-6">
                                <Heading level="h3" className="text-lg mb-4 font-nunito font-bold text-brand-dark">Items</Heading>
                                <div className="flex flex-col gap-y-4">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-x-4">
                                                <div className="flex flex-col">
                                                    <Text className="font-semibold text-base-regular text-brand-dark">{item.product_title || item.title}</Text>
                                                    <Text className="text-ui-fg-subtle text-small-regular">Qty: {item.quantity}</Text>
                                                </div>
                                            </div>
                                            <Text className="font-semibold">
                                                {formatAmount(item.total, order.currency_code)}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-ui-border-base pt-6 mt-6 flex justify-between items-center">
                                <Text className="font-semibold text-large-regular uppercase">Total Amount</Text>
                                <Text className="font-bold text-2xl text-brand-green">
                                    {formatAmount(order.total, order.currency_code)}
                                </Text>
                            </div>

                        </Container>
                    )}

                </div>
            </div>
        </div>
    )
}

export default TrackingTemplate
