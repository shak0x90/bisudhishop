"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  customer?: HttpTypes.StoreCustomer | null
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

import { useTranslation } from "@lib/providers/intl-provider"

const Summary = ({ cart }: SummaryProps) => {
  const { t } = useTranslation()
  const step = getCheckoutStep(cart)

  // Allow both guests and logged-in customers to proceed to checkout
  const checkoutHref = "/checkout?step=" + step

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        {t("cart.title")}
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      {/* Reassurance line */}
      <p className="text-xs text-brand-sage flex items-center gap-1.5">
        <span>📦</span>
        <span>{t("cart.reassurance")}</span>
      </p>
      <LocalizedClientLink
        href={checkoutHref}
        data-testid="checkout-button"
      >
        <Button className="w-full h-10">{t("cart.goToCheckout")}</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
