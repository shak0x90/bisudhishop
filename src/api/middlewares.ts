import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
    routes: [
        {
            matcher: "/store/slides*",
            middlewares: [
                (req, res, next) => {
                    // Allow Medusa to authenticate the request via the publishable key
                    next()
                }
            ],
        },
    ],
})
