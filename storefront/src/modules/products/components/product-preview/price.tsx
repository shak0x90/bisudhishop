import { Text } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-x-2 w-full text-sm mt-1">
      {price.price_type === "sale" && (
        <span
          className="line-through text-gray-400"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className="text-brand-green font-bold"
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </div>
  )
}
