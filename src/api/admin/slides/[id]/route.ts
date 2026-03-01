import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDER_MODULE } from "../../../../modules/slider"
import { SliderModuleService } from "../../../../modules/slider/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const sliderModuleService: SliderModuleService = req.scope.resolve(SLIDER_MODULE)

    const slide = await sliderModuleService.retrieveSlide(req.params.id)

    res.json({ slide })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const sliderModuleService: SliderModuleService = req.scope.resolve(SLIDER_MODULE)

    const slide = await sliderModuleService.updateSlides({
        id: req.params.id,
        ...(req.body as any)
    })

    res.json({ slide })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    const sliderModuleService: SliderModuleService = req.scope.resolve(SLIDER_MODULE)

    await sliderModuleService.deleteSlides(req.params.id)

    res.json({
        id: req.params.id,
        object: "slide",
        deleted: true,
    })
}
