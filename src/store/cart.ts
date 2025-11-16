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
  syncFromBackend: () => Promise<void>
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

          // Sync with backend cart
          const syncWithBackend = async () => {
            const token = localStorage.getItem('token')
            if (token) {
              try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
                const requestBody = {
                  product_id: product.id.toString(),  // Backend expects string, not int
                  quantity: quantity
                }
                console.log('🔄 Syncing cart item to backend:', requestBody)
                
                const response = await fetch(`${apiUrl}/cart/items`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(requestBody)
                })
                
                if (!response.ok) {
                  const errorText = await response.text()
                  console.error('❌ Cart sync failed:', response.status, errorText)
                  throw new Error(`Cart sync failed: ${response.status}`)
                }
                
                const data = await response.json()
                console.log('✅ Cart synced with backend:', product.name, data)
              } catch (error) {
                console.error('⚠️ Failed to sync cart with backend:', error)
                // Don't fail the operation if backend sync fails
              }
            }
          }
          
          // Fire and forget - don't wait for backend
          syncWithBackend()

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

      syncFromBackend: async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
          console.log('🔄 Syncing cart from backend...')
          
          const response = await fetch(`${apiUrl}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            console.log('⚠️ Could not fetch backend cart:', response.status)
            return
          }

          const backendCart = await response.json()
          console.log('📦 Backend cart response:', backendCart)

          // Backend returns array of cart items directly
          const backendItems = Array.isArray(backendCart) ? backendCart : (backendCart.items || [])
          
          // If backend cart has items, sync to frontend
          if (backendItems.length > 0) {
            console.log('📦 Backend cart items:', backendItems)
            
            // Map backend cart items to frontend format
            // Backend structure: { id, user_id, product_id, quantity, price_at_time, product: {...} }
            const items: CartItem[] = backendItems
              .filter((item: any) => item.product) // Only include items with valid products
              .map((item: any) => ({
                product: {
                  ...item.product,
                  // Ensure price is set
                  price: item.product.price || item.price_at_time || 0
                },
                quantity: item.quantity
              }))

            if (items.length > 0) {
              const totals = calculateTotals(items, 0)
              
              set({
                cart: {
                  items,
                  ...totals,
                }
              })
              
              console.log('✅ Cart synced from backend:', items.length, 'items')
            } else {
              console.log('📭 Backend cart has items but no valid products')
              // Clear frontend cart if backend has no valid products
              set({ cart: initialCart })
            }
          } else {
            console.log('📭 Backend cart is empty - keeping frontend cart (manual clear on success page)')
            // Don't auto-clear frontend cart when backend is empty
            // Cart will be cleared explicitly on payment success page
            // This prevents clearing cart when backend empties but user has local items
          }
        } catch (error) {
          console.error('⚠️ Failed to sync cart from backend:', error)
        }
      },
    }),
    {
      name: 'freshcart-cart',
    }
  )
)
