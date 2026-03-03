import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createAdmin({ container }: any) {
    const userModuleService = container.resolve(Modules.USER)
    const authModuleService = container.resolve(Modules.AUTH)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    const email = "admin@bishudhi.com"
    const password = "supersecret123"

    // Step 1: Create auth identity with email/password FIRST
    const { success, authIdentity, error } =
        await authModuleService.authenticate("emailpass", {
            authScope: "admin",
            body: { email, password },
            headers: {},
            query: {},
            // @ts-ignore
            action: "register",
        } as any)

    if (!success || !authIdentity) {
        throw new Error(`Failed to create auth identity: ${error}`)
    }
    logger.info(`Created auth identity: ${authIdentity.id}`)

    // Step 2: Create the admin user record
    const [user] = await userModuleService.createUsers([{
        email,
        first_name: "Admin",
        last_name: "Bishudhi",
    }])
    logger.info(`Created user: ${user.id}`)

    // Step 3: Link auth identity to user
    await authModuleService.updateAuthIdentities({
        id: authIdentity.id,
        app_metadata: { user_id: user.id },
    })
    logger.info("✅ Admin user created and linked successfully!")
    logger.info(`Email: ${email}`)
    logger.info(`Password: ${password}`)
}
