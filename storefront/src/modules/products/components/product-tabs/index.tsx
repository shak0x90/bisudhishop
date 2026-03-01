"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "@lib/providers/intl-provider"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const { t } = useTranslation()

  const tabs = [
    {
      label: t("product.productInformation"),
      component: <ProductInfoTab product={product} />,
    },
    {
      label: t("product.shipping"),
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  // Filter out empty fields to avoid ugly "-" placeholders for grocery products
  const hasDescription = !!product.description
  const hasOrigin = !!product.origin_country
  const hasMaterial = !!product.material
  const hasType = !!product.type?.value
  const hasWeight = !!product.weight
  const hasDimensions = !!(product.length && product.width && product.height)

  const hasAnyMeta = hasOrigin || hasMaterial || hasType || hasWeight || hasDimensions

  return (
    <div className="text-small-regular py-8">
      {hasDescription && (
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-gray-700 leading-relaxed font-nunito">{product.description}</p>
        </div>
      )}

      {hasAnyMeta && (
        <div className="grid grid-cols-2 gap-x-8">
          <div className="flex flex-col gap-y-4">
            {hasMaterial && (
              <div>
                <span className="font-semibold">Material</span>
                <p>{product.material}</p>
              </div>
            )}
            {hasOrigin && (
              <div>
                <span className="font-semibold">Country of origin</span>
                <p>{product.origin_country}</p>
              </div>
            )}
            {hasType && (
              <div>
                <span className="font-semibold">Type</span>
                <p>{product.type!.value}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-4">
            {hasWeight && (
              <div>
                <span className="font-semibold">Weight</span>
                <p>{product.weight} g</p>
              </div>
            )}
            {hasDimensions && (
              <div>
                <span className="font-semibold">Dimensions</span>
                <p>{product.length}L x {product.width}W x {product.height}H</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!hasDescription && !hasAnyMeta && (
        <p className="text-gray-400 italic text-sm">No additional product information available.</p>
      )}
    </div>
  )
}

const ShippingInfoTab = () => {
  const { t } = useTranslation()

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">{t("product.fastDelivery")}</span>
            <p className="max-w-sm">
              {t("product.deliveryDesc")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">{t("product.simpleExchanges")}</span>
            <p className="max-w-sm">
              {t("product.exchangesDesc")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">{t("product.easyReturns")}</span>
            <p className="max-w-sm">
              {t("product.returnsDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
