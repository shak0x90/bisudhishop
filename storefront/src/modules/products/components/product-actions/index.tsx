"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa"
import { useTranslation } from "@lib/providers/intl-provider"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  // Handle direct WhatsApp ordering
  const handleWhatsAppOrder = () => {
    const phoneNumber = "8801711000000" // Replace with actual number if different
    const productUrl = typeof window !== "undefined" ? window.location.href : ""
    const message = `Hello Organichub, I would like to order:\n\n*${product.title}*\nQuantity: ${quantity}\n${selectedVariant ? `Variant: ${selectedVariant.title}\n` : ""}\nLink: ${productUrl}`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">{t("product.quantity")}:</span>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isAdding}
              className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 transition-colors text-xl font-medium"
            >
              −
            </button>
            <span className="w-12 h-11 flex items-center justify-center text-base font-bold text-brand-dark border-x border-gray-200 bg-gray-50">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isAdding}
              className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 transition-colors text-xl font-medium"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          className="w-full h-12 rounded-lg bg-brand-green hover:bg-brand-green-dark text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          data-testid="add-product-button"
        >
          {isAdding ? (
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          )}
          {!selectedVariant && !options
            ? t("product.selectVariant")
            : !inStock || !isValidVariant
              ? t("product.outOfStock")
              : t("product.addToCart")}
        </button>

        {/* Trust badges */}
        <div className="flex flex-col gap-1.5 py-3 px-1 border-t border-gray-100">
          {[
            { icon: "🌿", label: "Chemical-free sourcing" },
            { icon: "👨‍🌾", label: "Direct from farmers" },
            { icon: "📦", label: "Hygienically packed in Dhaka" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Direct WhatsApp Order Button — secondary outline */}
        <button
          onClick={handleWhatsAppOrder}
          disabled={!isValidVariant || !!disabled || isAdding}
          className="w-full h-11 rounded-lg border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="whatsapp-order-button"
        >
          <FaWhatsapp size={18} />
          {t("product.orderViaWhatsApp")}
        </button>

        {/* Direct Messenger Order Button */}
        <button
          onClick={() => {
            const pageId = "100000000000000"
            const productUrl = typeof window !== "undefined" ? window.location.href : ""
            const message = `Hello Organichub, I would like to order:\n\n*${product.title}*\nQuantity: ${quantity}\n${selectedVariant ? `Variant: ${selectedVariant.title}\n` : ""}\nLink: ${productUrl}`
            const messengerUrl = `https://m.me/${pageId}?text=${encodeURIComponent(message)}`
            window.open(messengerUrl, "_blank", "noopener,noreferrer")
          }}
          disabled={!isValidVariant || !!disabled || isAdding}
          className="w-full h-11 mt-2 rounded-lg border border-[#0084FF] text-[#0084FF] hover:bg-[#0084FF] hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="messenger-order-button"
        >
          <FaFacebookMessenger size={18} />
          Order via Messenger
        </button>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </>
  )
}
