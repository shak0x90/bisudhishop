import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
  quantity: number
  setQuantity: (val: number) => void
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
  quantity,
  setQuantity,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-white flex flex-col gap-y-3 justify-center items-center text-large-regular p-4 px-5 pb-6 lg:pb-4 h-full w-full border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
            data-testid="mobile-actions"
          >
            {/* Title and Price Row */}
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-base line-clamp-1 flex-1 pr-2 text-brand-dark" data-testid="mobile-title">{product.title}</span>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2 text-ui-fg-base shrink-0 font-bold">
                  {selectedPrice.price_type === "sale" && (
                    <span className="line-through text-small-regular text-gray-400 font-normal">
                      {selectedPrice.original_price}
                    </span>
                  )}
                  <span className={clx({ "text-brand-green": selectedPrice.price_type === "sale", "text-brand-dark": selectedPrice.price_type !== "sale" })}>
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Actions Row */}
            <div className="flex flex-col gap-y-3 w-full">
              {!isSimple && (
                <button
                  onClick={open}
                  className="w-full h-10 flex items-center justify-between px-4 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  data-testid="mobile-actions-button"
                >
                  <span className="text-gray-700">
                    {variant ? Object.values(options).join(" / ") : "Select Options"}
                  </span>
                  <ChevronDown />
                </button>
              )}

              <div className="flex items-center gap-x-3 w-full">
                {/* Quantity Pill */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0 h-11 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isAdding}
                    className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 transition-colors text-xl font-medium"
                  >
                    −
                  </button>
                  <span className="w-10 h-full flex items-center justify-center text-sm font-bold text-brand-dark border-x border-gray-200 bg-gray-50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isAdding}
                    className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 transition-colors text-xl font-medium"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || !variant}
                  className="flex-1 h-11 rounded-lg bg-brand-green hover:bg-brand-green-dark text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  data-testid="mobile-cart-button"
                >
                  {isAdding ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : null}
                  {!variant ? "Select variant" : !inStock ? "Out of stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-12">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
