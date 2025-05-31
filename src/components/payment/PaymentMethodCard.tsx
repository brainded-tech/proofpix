import React, { useState } from 'react';
import { CreditCard, Trash2, Star, MoreVertical } from 'lucide-react';
import { PaymentMethod } from '../../utils/paymentClient';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onSetDefault,
  onDelete,
  isLoading = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [actionLoading, setActionLoading] = useState<'default' | 'delete' | null>(null);

  const handleSetDefault = async () => {
    if (paymentMethod.is_default) return;
    
    setActionLoading('default');
    try {
      await onSetDefault(paymentMethod.id);
    } finally {
      setActionLoading(null);
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    if (paymentMethod.is_default) return; // Can't delete default payment method
    
    setActionLoading('delete');
    try {
      await onDelete(paymentMethod.id);
    } finally {
      setActionLoading(null);
      setShowMenu(false);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
  };

  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  return (
    <div className={`relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${
      paymentMethod.is_default ? 'ring-2 ring-blue-500' : ''
    } ${isLoading ? 'opacity-50' : ''}`}>
      {/* Default Badge */}
      {paymentMethod.is_default && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Default
          </div>
        </div>
      )}

      {/* Menu Button */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          disabled={isLoading}
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]">
            {!paymentMethod.is_default && (
              <button
                onClick={handleSetDefault}
                disabled={actionLoading === 'default'}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {actionLoading === 'default' ? 'Setting...' : 'Set as Default'}
              </button>
            )}
            {!paymentMethod.is_default && (
              <button
                onClick={handleDelete}
                disabled={actionLoading === 'delete'}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex items-center space-x-4">
        {/* Card Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-lg">
            {paymentMethod.card ? getCardBrandIcon(paymentMethod.card.brand) : <CreditCard className="h-5 w-5" />}
          </div>
        </div>

        {/* Card Details */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {paymentMethod.card ? paymentMethod.card.brand.toUpperCase() : paymentMethod.type.toUpperCase()}
            </span>
            {paymentMethod.card && (
              <span className="text-gray-600 dark:text-gray-400">
                •••• {paymentMethod.card.last4}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {paymentMethod.card && (
              <span>Expires {formatExpiryDate(paymentMethod.card.exp_month, paymentMethod.card.exp_year)}</span>
            )}
            {paymentMethod.billing_details.name && (
              <span className="ml-2">• {paymentMethod.billing_details.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* Click overlay to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}; 