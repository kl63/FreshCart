'use client'

import React from 'react'
import { SavedPaymentMethod } from '@/lib/stripe'
import { RadioGroup } from '@headlessui/react'
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  PlusCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface SavedPaymentMethodsProps {
  savedMethods: SavedPaymentMethod[]
  selectedMethodId: string | null
  onSelect: (method: SavedPaymentMethod | null) => void
  onDelete?: (method: SavedPaymentMethod) => void
  onSetDefault?: (method: SavedPaymentMethod) => void
  isLoading?: boolean
}

export const SavedPaymentMethods: React.FC<SavedPaymentMethodsProps> = ({
  savedMethods,
  selectedMethodId,
  onSelect,
  onDelete,
  onSetDefault,
  isLoading = false
}) => {
  // Check if there are any saved methods
  if (savedMethods.length === 0 && !isLoading) {
    return null
  }

  // Get card brand icon and display name
  const getCardBrandInfo = (brand: string) => {
    const brandLower = brand?.toLowerCase() || 'unknown'
    let displayName = brand

    switch (brandLower) {
      case 'visa':
        displayName = 'Visa'
        break
      case 'mastercard':
        displayName = 'Mastercard'
        break
      case 'amex':
        displayName = 'American Express'
        break
      case 'discover':
        displayName = 'Discover'
        break
      default:
        displayName = brand || 'Card'
    }

    return { displayName }
  }

  // Get expiration date display
  const getExpiryDisplay = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
  }

  return (
    <div className="space-y-4">
      <div className="font-medium text-gray-700">Saved payment methods</div>
      
      {isLoading ? (
        <div className="p-4 border border-gray-200 rounded-md animate-pulse bg-gray-50">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <RadioGroup value={selectedMethodId} onChange={(id) => {
          const method = id === 'new' ? null : savedMethods.find(m => m.id === id)
          onSelect(method || null)
        }}>
          <div className="space-y-2">
            {savedMethods.map((method) => (
              <RadioGroup.Option
                key={method.id}
                value={method.id}
                className={({ checked }) => `
                  relative p-4 border ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} 
                  rounded-md flex justify-between cursor-pointer hover:border-blue-200 transition
                `}
              >
                {({ checked }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="h-6 w-6 text-gray-500" />
                      <div>
                        <div className="font-medium">
                          {method.card && getCardBrandInfo(method.card.brand).displayName} •••• {method.card?.last4}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expires {method.card && getExpiryDisplay(method.card.exp_month, method.card.exp_year)}
                          {method.is_default && <span className="ml-2 text-green-600 text-xs font-medium">Default</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Show Set Default button only if the method is not already default */}
                      {onSetDefault && !method.is_default && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            onSetDefault(method)
                          }}
                          className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50"
                        >
                          Set Default
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            onDelete(method)
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                      {checked && <CheckCircleIcon className="h-5 w-5 text-blue-600" />}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
            
            {/* Option to use a new card */}
            <RadioGroup.Option
              value="new"
              className={({ checked }) => `
                relative p-4 border ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} 
                rounded-md flex items-center gap-3 cursor-pointer hover:border-blue-200 transition
              `}
            >
              {({ checked }) => (
                <>
                  <PlusCircleIcon className="h-6 w-6 text-gray-500" />
                  <div className="font-medium">Use a new card</div>
                  {checked && <CheckCircleIcon className="h-5 w-5 text-blue-600 ml-auto" />}
                </>
              )}
            </RadioGroup.Option>
          </div>
        </RadioGroup>
      )}
    </div>
  )
}

export default SavedPaymentMethods
