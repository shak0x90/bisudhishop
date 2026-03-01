import { model } from "@medusajs/framework/utils"

export const Slide = model.define("slide", {
    id: model.id().primaryKey(),
    title: model.text(),
    subtitle: model.text(),
    image_url: model.text(),
    badge_text: model.text(),
    order: model.number().default(0),
})
