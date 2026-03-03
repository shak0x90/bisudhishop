import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createAdmin({ container }: any) {
    const userModuleService = container.resolve(Modules.USER)
    const authModuleService = container.resolve(Modules.AUTH)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    const email = "admin@bishudhi.com"
    const password = "supersecret123"

    // Create the admin user record
    const user = await userModuleService.createUsers({
        email,
        first_name: "Admin",
        last_name: "Bishudhi",
    })
    logger.info(`Created user: ${user.id}`)

    // Register auth identity
    const { success, authIdentity, error } =
        await authModuleService.authenticate("emailpass", {
            authScope: "admin",
            body: { email, password },
            headers: {},
            query: {},
            // @ts-ignore
            action: "register",
        } as any)

    if (!success) {
        // Identity may already exist — just update password
        logger.warn(`Auth registration result: ${error}`)
    } else {
        // Link auth identity to user
        await authModuleService.updateAuthIdentities({
            id: authIdentity!.id,
            app_metadata: { user_id: user.id },
        })
        logger.info("✅ Admin user created and linked successfully!")
    }
}
