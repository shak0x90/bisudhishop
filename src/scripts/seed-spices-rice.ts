import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
    ProductStatus,
} from "@medusajs/framework/utils";
import {
    createInventoryLevelsWorkflow,
    createProductsWorkflow,
    createShippingProfilesWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedSpicesAndRice({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const productModuleService = container.resolve(Modules.PRODUCT);

    logger.info("🌶️ Starting Spices & Rice product seeding...");

    // ── Get existing sales channel ──
    const defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });

    if (!defaultSalesChannel.length) {
        logger.error("No default sales channel found. Run the base seed first.");
        return;
    }

    // ── Get existing shipping profile ──
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
        type: "default",
    });
    let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

    if (!shippingProfile) {
        const { result: shippingProfileResult } =
            await createShippingProfilesWorkflow(container).run({
                input: {
                    data: [
                        {
                            name: "Default Shipping Profile",
                            type: "default",
                        },
                    ],
                },
            });
        shippingProfile = shippingProfileResult[0];
    }

    // ── Get existing stock location ──
    const { data: stockLocations } = await query.graph({
        entity: "stock_location",
        fields: ["id"],
    });

    if (!stockLocations.length) {
        logger.error("No stock location found. Run the grocery seed first.");
        return;
    }
    const stockLocation = stockLocations[0];

    // ──────────────────────────────────────────────
    // Step 1: Create categories directly via module service
    // ──────────────────────────────────────────────
    logger.info("Setting up categories...");

    const desiredCategories = [
        "Whole Spices",
        "Ground Spices",
        "Spice Blends",
        "Premium Rice",
        "Organic Rice",
        "Gift Boxes",
    ];

    const existingCats = await productModuleService.listProductCategories(
        {},
        { take: 100 }
    );
    const catMap = new Map<string, string>();
    for (const cat of existingCats) {
        catMap.set(cat.name, cat.id);
    }

    for (const name of desiredCategories) {
        if (!catMap.has(name)) {
            try {
                const created = await productModuleService.createProductCategories({
                    name,
                    is_active: true,
                });
                catMap.set(name, created.id);
                logger.info(`  Created category: ${name}`);
            } catch (e: any) {
                // Category might already exist with this handle from a prior run
                logger.info(`  Category "${name}" already exists (handle conflict), looking up...`);
                const retry = await productModuleService.listProductCategories(
                    { handle: [name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")] },
                    { take: 1 }
                );
                if (retry.length) {
                    catMap.set(name, retry[0].id);
                    logger.info(`  Found existing category: ${retry[0].name} -> ${retry[0].id}`);
                }
            }
        } else {
            logger.info(`  Category exists: ${name}`);
        }
    }
    logger.info("✅ Categories ready.");

    const catId = (name: string) => catMap.get(name)!;

    // ──────────────────────────────────────────────
    // Step 2: Seed Spice & Rice products
    // ──────────────────────────────────────────────
    logger.info("Creating spice & rice products...");

    const makeProduct = (
        title: string,
        handle: string,
        category: string,
        description: string,
        priceBDT: number,
        weight: number,
        thumbnail: string
    ) => ({
        title,
        handle,
        description,
        weight,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile!.id,
        category_ids: [catId(category)],
        thumbnail,
        images: [{ url: thumbnail }],
        options: [
            {
                title: "Size",
                values: ["Default"],
            },
        ],
        variants: [
            {
                title: "Default",
                sku: handle.toUpperCase().replace(/-/g, "_"),
                options: { Size: "Default" },
                manage_inventory: true,
                prices: [
                    { amount: priceBDT, currency_code: "bdt" },
                ],
            },
        ],
        sales_channels: [{ id: defaultSalesChannel[0].id }],
    });

    await createProductsWorkflow(container).run({
        input: {
            products: [
                // ── Whole Spices ──
                makeProduct(
                    "Whole Cumin Seeds (200g)",
                    "whole-cumin-seeds-200g",
                    "Whole Spices",
                    "Premium quality whole cumin seeds (jeera). Sun-dried and handpicked for the finest aroma. Essential for tempering dals and curries.",
                    95,
                    200,
                    "https://images.unsplash.com/photo-1599909533601-4c1baa65b5e8?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Whole Coriander Seeds (200g)",
                    "whole-coriander-seeds-200g",
                    "Whole Spices",
                    "Aromatic whole coriander seeds (dhonia). Freshly harvested and naturally dried. Perfect for grinding fresh masala at home.",
                    70,
                    200,
                    "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Whole Black Pepper (100g)",
                    "whole-black-pepper-100g",
                    "Whole Spices",
                    "Premium whole black peppercorns (gol morich). Strong, pungent flavor that enhances any dish.",
                    120,
                    100,
                    "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Cinnamon Sticks (100g)",
                    "cinnamon-sticks-100g",
                    "Whole Spices",
                    "Premium Ceylon cinnamon sticks (daruchini). Sweet, warm aroma perfect for biryanis, desserts, and chai.",
                    150,
                    100,
                    "https://images.unsplash.com/photo-1612539342538-2dedb852d0f7?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Cardamom Pods (50g)",
                    "cardamom-pods-50g",
                    "Whole Spices",
                    "Green cardamom pods (elaichi). Intensely aromatic — perfect for biryanis, sweets, and masala chai.",
                    180,
                    50,
                    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=600&fit=crop"
                ),

                // ── Ground Spices ──
                makeProduct(
                    "Turmeric Powder (250g)",
                    "turmeric-powder-250g",
                    "Ground Spices",
                    "100% pure organic turmeric powder (holud). Vibrant golden color with earthy flavor. No artificial additives.",
                    85,
                    250,
                    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Red Chili Powder (250g)",
                    "red-chili-powder-250g",
                    "Ground Spices",
                    "Premium red chili powder (morich gura). Made from sun-dried red chilies. Adds perfect heat and rich color.",
                    75,
                    250,
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Cumin Powder (200g)",
                    "cumin-powder-200g",
                    "Ground Spices",
                    "Freshly ground cumin powder (jeera gura). Roasted and ground for max flavor. A must-have for curries and dals.",
                    110,
                    200,
                    "https://images.unsplash.com/photo-1599909533601-4c1baa65b5e8?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Coriander Powder (250g)",
                    "coriander-powder-250g",
                    "Ground Spices",
                    "Fine coriander powder (dhonia gura). Stone-ground from premium seeds. Mild, nutty flavor for curries and marinades.",
                    65,
                    250,
                    "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=600&fit=crop"
                ),

                // ── Spice Blends ──
                makeProduct(
                    "Garam Masala (150g)",
                    "garam-masala-150g",
                    "Spice Blends",
                    "Traditional garam masala — cinnamon, cardamom, cloves, cumin, and black pepper. Perfect finishing spice for curries.",
                    130,
                    150,
                    "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Biryani Masala (100g)",
                    "biryani-masala-100g",
                    "Spice Blends",
                    "Special biryani masala for authentic Kacchi and Tehari. Aromatic and full-bodied flavor.",
                    140,
                    100,
                    "https://images.unsplash.com/photo-1505253668822-42074d58a7c6?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Fish Curry Masala (100g)",
                    "fish-curry-masala-100g",
                    "Spice Blends",
                    "Bengali fish curry masala blend. Perfectly balanced for macher jhol, fish curry, and shorshey mach.",
                    120,
                    100,
                    "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&h=600&fit=crop"
                ),

                // ── Premium Rice ──
                makeProduct(
                    "Miniket Rice (5kg)",
                    "miniket-rice-5kg-premium",
                    "Premium Rice",
                    "Premium Miniket rice. Long grain, fluffy texture, the most popular rice variety in Bangladesh.",
                    480,
                    5000,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Nazirshail Rice (5kg)",
                    "nazirshail-rice-5kg",
                    "Premium Rice",
                    "Aromatic Nazirshail rice. Fragrant smell and soft texture. Perfect for polao, biryani, and everyday cooking.",
                    520,
                    5000,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Chinigura Rice (2kg)",
                    "chinigura-rice-2kg",
                    "Premium Rice",
                    "Authentic Chinigura aromatic rice — Bangladesh's answer to Basmati. Intensely fragrant, ideal for polao.",
                    350,
                    2000,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Kataribhog Rice (2kg)",
                    "kataribhog-rice-2kg",
                    "Premium Rice",
                    "Traditional Kataribhog aromatic rice. Legendary variety with sweet fragrance. Perfect for payesh and festivals.",
                    380,
                    2000,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
                ),

                // ── Organic Rice ──
                makeProduct(
                    "Organic Brown Rice (2kg)",
                    "organic-brown-rice-2kg",
                    "Organic Rice",
                    "100% organic brown rice. Unpolished and nutrient-rich with natural bran layer. High in fiber and minerals.",
                    320,
                    2000,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Organic Red Rice (2kg)",
                    "organic-red-rice-2kg",
                    "Organic Rice",
                    "Organic red rice (lal chal). Naturally colored, rich in antioxidants. A healthier alternative packed with iron.",
                    350,
                    2000,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
                ),

                // ── Gift Boxes ──
                makeProduct(
                    "Spice Starter Kit (6-Pack)",
                    "spice-starter-kit-6pack",
                    "Gift Boxes",
                    "Essential spice collection: Turmeric, Chili, Cumin, Coriander, Garam Masala, and Black Pepper. Perfect gift.",
                    599,
                    800,
                    "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Premium Rice Sampler Box",
                    "premium-rice-sampler-box",
                    "Gift Boxes",
                    "Taste the best of Bangladesh — Chinigura, Kataribhog, Nazirshail, and Miniket (500g each). Perfect gift.",
                    699,
                    2000,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
                ),
            ],
        },
    });
    logger.info("✅ 20 spice & rice products created.");

    // ──────────────────────────────────────────────
    // Step 3: Set inventory levels for new products
    // ──────────────────────────────────────────────
    logger.info("Setting inventory levels...");
    const { data: inventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id"],
    });

    const { data: existingLevels } = await query.graph({
        entity: "inventory_level",
        fields: ["inventory_item_id"],
        filters: {
            location_id: stockLocation.id,
        },
    });

    const existingItemIds = new Set(existingLevels.map((l: any) => l.inventory_item_id));

    const inventoryLevels: CreateInventoryLevelInput[] = [];
    for (const inventoryItem of inventoryItems) {
        if (!existingItemIds.has(inventoryItem.id)) {
            inventoryLevels.push({
                location_id: stockLocation.id,
                stocked_quantity: 500,
                inventory_item_id: inventoryItem.id,
            });
        }
    }

    if (inventoryLevels.length > 0) {
        await createInventoryLevelsWorkflow(container).run({
            input: {
                inventory_levels: inventoryLevels,
            },
        });
    }
    logger.info("✅ Inventory levels set.");

    logger.info("🎉 Spices & Rice seeding complete! 20 products across 6 categories.");
}
