import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, CartItem, Product } from '@/types'

interface CartStore {
  cart: Cart
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  applyDiscountCode: (code: string) => void
  removeDiscountCode: () => void
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  total: 0,
}

const TAX_RATE = 0.08 // 8% tax
const DELIVERY_FEE = 4.99
const FREE_DELIVERY_THRESHOLD = 35

const calculateTotals = (items: CartItem[], discountAmount: number = 0): Omit<Cart, 'items' | 'discountCode' | 'discountAmount'> => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.price
    return sum + (price * item.quantity)
  }, 0)

  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  const tax = discountedSubtotal * TAX_RATE
  const deliveryFee = discountedSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = discountedSubtotal + tax + deliveryFee

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,

      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItemIndex = state.cart.items.findIndex(
            item => item.product.id === product.id
          )

          let newItems: CartItem[]
          
          if (existingItemIndex >= 0) {
            // Update existing item
            newItems = state.cart.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            // Add new item
            newItems = [...state.cart.items, { product, quantity }]
          }

          const totals = calculateTotals(newItems, state.cart.discountAmount || 0)

          return {
            cart: {
              ...state.cart,
              items: newItems,
              ...totals,
            }
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.cart.items.filter(item => item.product.id !== productId)
          const totals = calculateTotals(newItems, state.cart.discountAmount || 0)

          return {
            cart: {
              ...state.cart,
              items: newItems,
              ...totals,
            }
          }
        })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => {
          const newItems = state.cart.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )

          const totals = calculateTotals(newItems, state.cart.discountAmount || 0)

          return {
            cart: {
              ...state.cart,
              items: newItems,
              ...totals,
            }
          }
        })
      },

      clearCart: () => {
        set({ cart: initialCart })
      },

      getItemCount: () => {
        return get().cart.items.reduce((sum, item) => sum + item.quantity, 0)
      },

      applyDiscountCode: (code: string) => {
        // Mock discount logic - in real app, this would call an API
        const discountCodes: Record<string, number> = {
          'FRESH10': 10,
          'SAVE20': 20,
          'WELCOME5': 5,
        }

        const discountAmount = discountCodes[code.toUpperCase()] || 0

        if (discountAmount > 0) {
          set((state) => {
            const totals = calculateTotals(state.cart.items, discountAmount)
            
            return {
              cart: {
                ...state.cart,
                discountCode: code.toUpperCase(),
                discountAmount,
                ...totals,
              }
            }
          })
        }
      },

      removeDiscountCode: () => {
        set((state) => {
          const totals = calculateTotals(state.cart.items, 0)
          
          return {
            cart: {
              ...state.cart,
              discountCode: undefined,
              discountAmount: undefined,
              ...totals,
            }
          }
        })
      },
    }),
    {
      name: 'freshcart-cart',
    }
  )
)
