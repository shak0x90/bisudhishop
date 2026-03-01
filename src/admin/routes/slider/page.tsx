import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Table, Input, Label } from "@medusajs/ui"
import { PhotoSolid } from "@medusajs/icons"
import { useState, useEffect } from "react"

const SliderPage = () => {
    const [slides, setSlides] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form state
    const [title, setTitle] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [badgeText, setBadgeText] = useState("")

    const fetchSlides = async () => {
        setLoading(true)
        try {
            const res = await fetch("/admin/slides")
            const data = await res.json()
            if (data.slides) {
                setSlides(data.slides)
            }
        } catch (err) {
            console.error("Failed to fetch slides", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSlides()
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await fetch("/admin/slides", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title, subtitle, image_url: imageUrl, badge_text: badgeText, order: slides.length
                })
            })
            setTitle("")
            setSubtitle("")
            setImageUrl("")
            setBadgeText("")
            fetchSlides()
        } catch (err) {
            console.error("Failed to create slide", err)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this slide?")) return;
        try {
            await fetch(`/admin/slides/${id}`, { method: "DELETE" })
            fetchSlides()
        } catch (err) {
            console.error("Failed to delete slide", err)
        }
    }

    return (
        <Container>
            <Heading className="mb-4">Hero Slider Management</Heading>
            <Text className="text-ui-fg-subtle mb-8">
                Manage the dynamic slides shown on the storefront homepage.
            </Text>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <form onSubmit={handleCreate} className="bg-ui-bg-subtle p-6 rounded-lg flex flex-col gap-4">
                    <Heading level="h3">Add New Slide</Heading>

                    <div className="flex flex-col gap-2">
                        <Label>Title</Label>
                        <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Fresh Deshi Groceries" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Subtitle</Label>
                        <Input required value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Farm to Table." />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Image URL</Label>
                        <Input required value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Badge Text</Label>
                        <Input value={badgeText} onChange={e => setBadgeText(e.target.value)} placeholder="100% DESHI" />
                    </div>

                    <Button type="submit" variant="primary" className="mt-4">
                        Create Slide
                    </Button>
                </form>

                <div className="lg:col-span-2">
                    {loading ? <Text>Loading slides...</Text> : (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Image</Table.HeaderCell>
                                    <Table.HeaderCell>Title</Table.HeaderCell>
                                    <Table.HeaderCell>Badge</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {slides?.map((slide) => (
                                    <Table.Row key={slide.id}>
                                        <Table.Cell>
                                            <img src={slide.image_url} alt="" className="w-16 h-16 object-cover rounded-md" />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="font-medium">{slide.title}</div>
                                            <div className="text-xs text-ui-fg-subtle">{slide.subtitle}</div>
                                        </Table.Cell>
                                        <Table.Cell>{slide.badge_text}</Table.Cell>
                                        <Table.Cell>
                                            <Button variant="danger" onClick={() => handleDelete(slide.id)}>Delete</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}

                                {slides.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell className="text-center text-ui-fg-subtle">
                                            No slides created yet.
                                        </Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    )}
                </div>
            </div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Slider",
    icon: PhotoSolid,
})

export default SliderPage
