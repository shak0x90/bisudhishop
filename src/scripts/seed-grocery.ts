import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
    ProductStatus,
} from "@medusajs/framework/utils";
import {
    createWorkflow,
    transform,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
    createInventoryLevelsWorkflow,
    createProductCategoriesWorkflow,
    createProductsWorkflow,
    createRegionsWorkflow,
    createShippingOptionsWorkflow,
    createShippingProfilesWorkflow,
    createStockLocationsWorkflow,
    createTaxRegionsWorkflow,
    linkSalesChannelsToStockLocationWorkflow,
    updateStoresStep,
    updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

const updateStoreCurrencies = createWorkflow(
    "update-store-currencies-grocery",
    (input: {
        supported_currencies: { currency_code: string; is_default?: boolean }[];
        store_id: string;
    }) => {
        const normalizedInput = transform({ input }, (data) => {
            return {
                selector: { id: data.input.store_id },
                update: {
                    supported_currencies: data.input.supported_currencies.map(
                        (currency) => {
                            return {
                                currency_code: currency.currency_code,
                                is_default: currency.is_default ?? false,
                            };
                        }
                    ),
                },
            };
        });

        const stores = updateStoresStep(normalizedInput);

        return new WorkflowResponse(stores);
    }
);

export default async function seedGroceryData({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const link = container.resolve(ContainerRegistrationKeys.LINK);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const storeModuleService = container.resolve(Modules.STORE);

    logger.info("🇧🇩 Starting Organichub grocery data seeding...");

    // ──────────────────────────────────────────────
    // Step 1: Get store and sales channel
    // ──────────────────────────────────────────────
    const [store] = await storeModuleService.listStores();
    const defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });

    if (!defaultSalesChannel.length) {
        logger.error("No default sales channel found. Please run the base seed first.");
        return;
    }

    // ──────────────────────────────────────────────
    // Step 2: Add BDT currency to the store
    // ──────────────────────────────────────────────
    logger.info("Adding BDT currency to store...");
    await updateStoreCurrencies(container).run({
        input: {
            store_id: store.id,
            supported_currencies: [
                { currency_code: "bdt", is_default: true },
            ],
        },
    });

    // ──────────────────────────────────────────────
    // Step 3: Create BD region
    // ──────────────────────────────────────────────
    logger.info("Creating Bangladesh region...");
    const { result: regionResult } = await createRegionsWorkflow(container).run({
        input: {
            regions: [
                {
                    name: "Bangladesh",
                    currency_code: "bdt",
                    countries: ["bd"],
                    payment_providers: ["pp_system_default"],
                },
            ],
        },
    });
    const bdRegion = regionResult[0];
    logger.info("✅ Bangladesh region created.");

    // ──────────────────────────────────────────────
    // Step 4: Create tax region for BD
    // ──────────────────────────────────────────────
    logger.info("Creating tax region for BD...");
    await createTaxRegionsWorkflow(container).run({
        input: [
            {
                country_code: "bd",
                provider_id: "tp_system",
            },
        ],
    });

    // ──────────────────────────────────────────────
    // Step 5: Create stock location (Dhaka Warehouse)
    // ──────────────────────────────────────────────
    logger.info("Creating Dhaka warehouse...");
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
        container
    ).run({
        input: {
            locations: [
                {
                    name: "Dhaka Warehouse",
                    address: {
                        city: "Dhaka",
                        country_code: "BD",
                        address_1: "Banani, Dhaka 1213",
                    },
                },
            ],
        },
    });
    const stockLocation = stockLocationResult[0];

    await link.create({
        [Modules.STOCK_LOCATION]: {
            stock_location_id: stockLocation.id,
        },
        [Modules.FULFILLMENT]: {
            fulfillment_provider_id: "manual_manual",
        },
    });

    // ──────────────────────────────────────────────
    // Step 6: Set up fulfillment for BD
    // ──────────────────────────────────────────────
    logger.info("Setting up fulfillment for BD...");
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

    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "Dhaka Delivery",
        type: "shipping",
        service_zones: [
            {
                name: "Bangladesh",
                geo_zones: [
                    {
                        country_code: "bd",
                        type: "country",
                    },
                ],
            },
        ],
    });

    await link.create({
        [Modules.STOCK_LOCATION]: {
            stock_location_id: stockLocation.id,
        },
        [Modules.FULFILLMENT]: {
            fulfillment_set_id: fulfillmentSet.id,
        },
    });

    await createShippingOptionsWorkflow(container).run({
        input: [
            {
                name: "Inside Dhaka",
                price_type: "flat",
                provider_id: "manual_manual",
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: "Inside Dhaka",
                    description: "Delivery within 24 hours inside Dhaka.",
                    code: "inside-dhaka",
                },
                prices: [
                    {
                        currency_code: "bdt",
                        amount: 60,
                    },
                    {
                        region_id: bdRegion.id,
                        amount: 60,
                    },
                ],
                rules: [
                    {
                        attribute: "enabled_in_store",
                        value: "true",
                        operator: "eq",
                    },
                    {
                        attribute: "is_return",
                        value: "false",
                        operator: "eq",
                    },
                ],
            },
            {
                name: "Outside Dhaka",
                price_type: "flat",
                provider_id: "manual_manual",
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: "Outside Dhaka",
                    description: "Delivery within 2-3 days outside Dhaka.",
                    code: "outside-dhaka",
                },
                prices: [
                    {
                        currency_code: "bdt",
                        amount: 120,
                    },
                    {
                        region_id: bdRegion.id,
                        amount: 120,
                    },
                ],
                rules: [
                    {
                        attribute: "enabled_in_store",
                        value: "true",
                        operator: "eq",
                    },
                    {
                        attribute: "is_return",
                        value: "false",
                        operator: "eq",
                    },
                ],
            },
        ],
    });

    await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
            id: stockLocation.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info("✅ Fulfillment and shipping set up.");

    // ──────────────────────────────────────────────
    // Step 7: Create grocery categories
    // ──────────────────────────────────────────────
    logger.info("Creating grocery categories...");
    const { result: categoryResult } = await createProductCategoriesWorkflow(
        container
    ).run({
        input: {
            product_categories: [
                { name: "Fresh Vegetables", is_active: true },
                { name: "Local Fruits", is_active: true },
                { name: "Meat & Fish", is_active: true },
                { name: "Dairy & Eggs", is_active: true },
                { name: "Spices & Masala", is_active: true },
                { name: "Rice & Lentils", is_active: true },
                { name: "Snacks", is_active: true },
            ],
        },
    });
    logger.info("✅ 7 grocery categories created.");

    // Helper to find category id
    const catId = (name: string) =>
        categoryResult.find((c) => c.name === name)!.id;

    // ──────────────────────────────────────────────
    // Step 8: Seed grocery products
    // ──────────────────────────────────────────────
    logger.info("Creating grocery products...");

    // Simple product helper (groceries only need one "Default" variant)
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
                title: "Weight",
                values: ["Default"],
            },
        ],
        variants: [
            {
                title: "Default",
                sku: handle.toUpperCase(),
                options: { Weight: "Default" },
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
                // ── Fresh Vegetables ──
                makeProduct(
                    "Deshi Tomato (1kg)",
                    "deshi-tomato-1kg",
                    "Fresh Vegetables",
                    "Fresh, locally grown deshi tomatoes. Perfect for cooking curry, salads, and daily meals.",
                    60,
                    1000,
                    "https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Green Chili (250g)",
                    "green-chili-250g",
                    "Fresh Vegetables",
                    "Spicy green chilies, freshly harvested from local farms. Essential for Bangladeshi cooking.",
                    30,
                    250,
                    "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Potol — Pointed Gourd (500g)",
                    "potol-500g",
                    "Fresh Vegetables",
                    "Fresh pointed gourd (potol). A beloved deshi vegetable for traditional Bengali dishes.",
                    45,
                    500,
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop"
                ),

                // ── Local Fruits ──
                makeProduct(
                    "Deshi Aam — Mango (1kg)",
                    "deshi-mango-1kg",
                    "Local Fruits",
                    "Sweet, ripe deshi mangoes. The king of fruits, sourced from Rajshahi farms.",
                    120,
                    1000,
                    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Kola — Banana (1 dozen)",
                    "banana-1dz",
                    "Local Fruits",
                    "Fresh local bananas, naturally ripened. A healthy and affordable snack.",
                    50,
                    1200,
                    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop"
                ),

                // ── Meat & Fish ──
                makeProduct(
                    "Rui Mach — Rohu Fish (1kg)",
                    "rui-mach-1kg",
                    "Meat & Fish",
                    "Fresh Rohu fish (Rui Mach), a staple of Bangladeshi cuisine. Clean and ready to cook.",
                    350,
                    1000,
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Deshi Murgi — Chicken (1kg)",
                    "deshi-chicken-1kg",
                    "Meat & Fish",
                    "Free-range deshi chicken, locally sourced. Perfect for curry, roast, and biryani.",
                    280,
                    1000,
                    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=600&fit=crop"
                ),

                // ── Dairy & Eggs ──
                makeProduct(
                    "Farm Fresh Eggs (12pc)",
                    "farm-eggs-12",
                    "Dairy & Eggs",
                    "Farm-fresh organic eggs from free-range hens. Rich in protein and nutrients.",
                    150,
                    700,
                    "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Pure Ghee (500ml)",
                    "pure-ghee-500ml",
                    "Dairy & Eggs",
                    "Authentic pure cow ghee, handmade using traditional methods. Adds rich flavor to any dish.",
                    450,
                    500,
                    "https://images.unsplash.com/photo-1631209121750-a9f656d7742e?w=600&h=600&fit=crop"
                ),

                // ── Spices & Masala ──
                makeProduct(
                    "Holud — Turmeric Powder (200g)",
                    "turmeric-200g",
                    "Spices & Masala",
                    "Pure turmeric powder, ground from locally sourced holud. Essential for every Bengali kitchen.",
                    80,
                    200,
                    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Morich Gura — Chili Powder (200g)",
                    "chili-powder-200g",
                    "Spices & Masala",
                    "Premium quality chili powder. Adds perfect heat and color to curries and stews.",
                    60,
                    200,
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop"
                ),

                // ── Rice & Lentils ──
                makeProduct(
                    "Miniket Rice (5kg)",
                    "miniket-rice-5kg",
                    "Rice & Lentils",
                    "Premium Miniket rice, the most popular rice variety in Bangladesh. Fluffy, aromatic, and perfect for daily meals.",
                    420,
                    5000,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Masur Dal — Red Lentils (1kg)",
                    "masur-dal-1kg",
                    "Rice & Lentils",
                    "Premium quality red lentils (masur dal). A staple protein source in Bengali cuisine.",
                    130,
                    1000,
                    "https://images.unsplash.com/photo-1585996102614-22d510fb0ceb?w=600&h=600&fit=crop"
                ),

                // ── Snacks ──
                makeProduct(
                    "Chanachur (200g)",
                    "chanachur-200g",
                    "Snacks",
                    "Crunchy and spicy Bangladeshi chanachur mix. Perfect for chai-time snacking.",
                    50,
                    200,
                    "https://images.unsplash.com/photo-1599490659213-e2b9527b711e?w=600&h=600&fit=crop"
                ),
                makeProduct(
                    "Muri — Puffed Rice (500g)",
                    "muri-puffed-rice-500g",
                    "Snacks",
                    "Light and crispy puffed rice (muri). A beloved Bangladeshi snack, perfect with jhalmuri or as a side.",
                    40,
                    500,
                    "https://images.unsplash.com/photo-1530016559861-e0a05cef0be6?w=600&h=600&fit=crop"
                ),
            ],
        },
    });
    logger.info("✅ 15 grocery products created.");

    // ──────────────────────────────────────────────
    // Step 9: Set inventory levels
    // ──────────────────────────────────────────────
    logger.info("Setting inventory levels...");
    const { data: inventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id"],
    });

    const inventoryLevels: CreateInventoryLevelInput[] = [];
    for (const inventoryItem of inventoryItems) {
        inventoryLevels.push({
            location_id: stockLocation.id,
            stocked_quantity: 1000,
            inventory_item_id: inventoryItem.id,
        });
    }

    await createInventoryLevelsWorkflow(container).run({
        input: {
            inventory_levels: inventoryLevels,
        },
    });
    logger.info("✅ Inventory levels set.");

    logger.info("🎉 Organichub grocery data seeding complete!");
}
