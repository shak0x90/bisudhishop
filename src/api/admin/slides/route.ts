import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDER_MODULE } from "../../../modules/slider"
import { SliderModuleService } from "../../../modules/slider/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const sliderModuleService: SliderModuleService = req.scope.resolve(SLIDER_MODULE)

    const slides = await sliderModuleService.listSlides({}, {
        order: { order: "ASC" }
    })

    res.json({ slides })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const sliderModuleService: SliderModuleService = req.scope.resolve(SLIDER_MODULE)

    const slide = await sliderModuleService.createSlides(req.body as any)

    res.json({ slide })
}
