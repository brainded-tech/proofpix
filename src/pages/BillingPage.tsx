import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  Settings,
  TrendingUp,
  FileText,
  Clock,
  Zap,
  Receipt,
  ArrowLeft
} from 'lucide-react';
import { 
  billingRepository,
  subscriptionRepository,
  usageRepository
} from '../utils/repositories';
import { errorHandler } from '../utils/errorHandler';
import type { 
  BillingData, 
  PaymentMethodData, 
  SubscriptionData,
  UsageTrackingData,
  InvoiceData
} from '../utils/apiClient';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe, PaymentClient } from '../utils/paymentClient';
import { SubscriptionManager } from '../components/payment/SubscriptionManager';
import { UsageTracker } from '../components/payment/UsageTracker';
import { useTestAuth } from '../components/auth/TestAuthProvider';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge 
} from '../components/ui/EnterpriseComponents';

interface BillingPageState {
  paymentMethods: PaymentMethodData[];
  invoices: InvoiceData[];
  subscription: SubscriptionData | null;
  usage: UsageTrackingData | null;
  isLoading: boolean;
  error: string | null;
  showAddPaymentMethod: boolean;
  lastRefresh: Date | null;
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodData;
  onSetDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onSetDefault,
  onDelete,
  isLoading = false
}) => {
  const [actionLoading, setActionLoading] = useState<'default' | 'delete' | null>(null);

  const handleSetDefault = async () => {
    if (paymentMethod.isDefault) return;
    
    setActionLoading('default');
    try {
      await onSetDefault(paymentMethod.id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (paymentMethod.isDefault) return;
    
    setActionLoading('delete');
    try {
      await onDelete(paymentMethod.id);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className={`relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${
      paymentMethod.isDefault ? 'ring-2 ring-blue-500' : ''
    } ${isLoading ? 'opacity-50' : ''}`}>
      {paymentMethod.isDefault && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Default
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

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
              <span>Expires {paymentMethod.card.expMonth.toString().padStart(2, '0')}/{paymentMethod.card.expYear.toString().slice(-2)}</span>
            )}
            {paymentMethod.bankAccount && (
              <span>{paymentMethod.bankAccount.bankName} •••• {paymentMethod.bankAccount.last4}</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!paymentMethod.isDefault && (
            <button
              onClick={handleSetDefault}
              disabled={actionLoading === 'default'}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1 rounded"
            >
              {actionLoading === 'default' ? 'Setting...' : 'Set Default'}
            </button>
          )}
          {!paymentMethod.isDefault && (
            <button
              onClick={handleDelete}
              disabled={actionLoading === 'delete'}
              className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded"
            >
              {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<BillingPageState>({
    paymentMethods: [],
    invoices: [],
    subscription: null,
    usage: null,
    isLoading: true,
    error: null,
    showAddPaymentMethod: false,
    lastRefresh: null
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'subscription' | 'usage' | 'payment-methods' | 'invoices'>('overview');

  const paymentClient = new PaymentClient();
  const stripePromise = getStripe();

  const updateState = useCallback((updates: Partial<BillingPageState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadBillingData = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });

      // Load all billing data in parallel
      const [
        billingResult,
        subscriptionResult,
        usageResult,
        invoicesResult,
        paymentMethodsResult,
        upcomingInvoiceResult
      ] = await Promise.allSettled([
        billingRepository.getInfo(),
        subscriptionRepository.getCurrent().catch(() => null),
        usageRepository.getCurrent().catch(() => null),
        billingRepository.getInvoices({ limit: 20 }),
        billingRepository.getPaymentMethods(),
        billingRepository.getUpcomingInvoice().catch(() => null)
      ]);

      updateState({
        paymentMethods: paymentMethodsResult.status === 'fulfilled' ? paymentMethodsResult.value : [],
        invoices: invoicesResult.status === 'fulfilled' ? invoicesResult.value : [],
        subscription: subscriptionResult.status === 'fulfilled' ? subscriptionResult.value : null,
        usage: usageResult.status === 'fulfilled' ? usageResult.value : null,
        isLoading: false,
        lastRefresh: new Date()
      });

    } catch (error) {
      console.error('Billing loading error:', error);
      await errorHandler.handleError('billing_load', error as Error);
      updateState({ 
        error: 'Failed to load billing data', 
        isLoading: false 
      });
    }
  }, [updateState]);

  useEffect(() => {
    loadBillingData();
  }, [loadBillingData]);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex > 0 ? 2 : 0)} ${units[unitIndex]}`;
  };

  const getSubscriptionStatus = () => {
    if (!state.subscription) return { text: 'Free Plan', color: 'text-gray-600', icon: CreditCard };
    
    switch (state.subscription.status) {
      case 'active': return { text: 'Active', color: 'text-green-600', icon: CheckCircle };
      case 'past_due': return { text: 'Past Due', color: 'text-red-600', icon: XCircle };
      case 'canceled': return { text: 'Canceled', color: 'text-gray-600', icon: XCircle };
      case 'trialing': return { text: 'Trial', color: 'text-blue-600', icon: Clock };
      default: return { text: 'Unknown', color: 'text-gray-600', icon: AlertCircle };
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'open': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'void': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      case 'uncollectible': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const downloadData = await billingRepository.downloadInvoice(invoiceId);
      
      // Create download link
      const link = document.createElement('a');
      link.href = downloadData.downloadUrl;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download error:', error);
      await errorHandler.handleError('invoice_download', error as Error);
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      await billingRepository.deletePaymentMethod(paymentMethodId);
      await loadBillingData(); // Refresh data
    } catch (error) {
      console.error('Delete payment method error:', error);
      await errorHandler.handleError('payment_method_delete', error as Error);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await billingRepository.updatePaymentMethod(paymentMethodId, { isDefault: true });
      await loadBillingData(); // Refresh data
    } catch (error) {
      console.error('Set default payment method error:', error);
      await errorHandler.handleError('payment_method_update', error as Error);
    }
  };

  const getUsagePercentage = (current: number, limit: number): number => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await paymentClient.setDefaultPaymentMethod(paymentMethodId);
      await loadBillingData();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to set default payment method'
      }));
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await paymentClient.deletePaymentMethod(paymentMethodId);
      await loadBillingData();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete payment method'
      }));
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const downloadUrl = await paymentClient.downloadInvoice(invoiceId);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to download invoice'
      }));
    }
  };

  const handleUpgradeNeeded = () => {
    setActiveTab('subscription');
  };

  const formatInvoiceStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return { text: 'Paid', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'open':
        return { text: 'Open', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case 'draft':
        return { text: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' };
      case 'void':
        return { text: 'Void', color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'uncollectible':
        return { text: 'Uncollectible', color: 'text-red-600', bgColor: 'bg-red-100' };
      default:
        return { text: status, color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'usage', label: 'Usage & Quotas', icon: AlertCircle },
    { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
  ] as const;

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Billing & Subscription
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {state.error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-red-600 dark:text-red-400">{state.error}</p>
              <button
                onClick={() => setState(prev => ({ ...prev, error: null }))}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Quick Overview
                </h2>
                <SubscriptionManager onSubscriptionChange={() => loadBillingData()} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Usage Summary
                </h2>
                <UsageTracker onUpgradeNeeded={handleUpgradeNeeded} />
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <SubscriptionManager onSubscriptionChange={() => loadBillingData()} />
          )}

          {activeTab === 'usage' && (
            <UsageTracker onUpgradeNeeded={handleUpgradeNeeded} />
          )}

          {activeTab === 'payment-methods' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Payment Methods
                </h2>
                <button
                  onClick={() => setState(prev => ({ ...prev, showAddPaymentMethod: true }))}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </button>
              </div>

              {state.paymentMethods.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.paymentMethods.map((paymentMethod) => (
                    <PaymentMethodCard
                      key={paymentMethod.id}
                      paymentMethod={paymentMethod}
                      onSetDefault={handleSetDefaultPaymentMethod}
                      onDelete={handleDeletePaymentMethod}
                      isLoading={state.isLoading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No Payment Methods
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Add a payment method to manage your subscription.
                  </p>
                  <button
                    onClick={() => setState(prev => ({ ...prev, showAddPaymentMethod: true }))}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Billing History
              </h2>

              {state.invoices.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Invoice
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {state.invoices.map((invoice) => {
                          const statusInfo = formatInvoiceStatus(invoice.status);
                          return (
                            <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  #{invoice.id.slice(-8)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(invoice.period.start)} - {formatDate(invoice.period.end)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(invoice.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatCurrency(invoice.amount.total, invoice.amount.currency)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  {invoice.metadata.downloadUrl && (
                                    <button
                                      onClick={() => handleDownloadInvoice(invoice.id)}
                                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No Invoices
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your billing history will appear here once you have a subscription.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {state.showAddPaymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Add Payment Method
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This feature requires Stripe Elements integration. Please use the billing portal for now.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setState(prev => ({ ...prev, showAddPaymentMethod: false }))}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const { url } = await paymentClient.createPortalSession();
                    window.open(url, '_blank');
                    setState(prev => ({ ...prev, showAddPaymentMethod: false }));
                  } catch (error) {
                    setState(prev => ({
                      ...prev,
                      error: error instanceof Error ? error.message : 'Failed to open billing portal'
                    }));
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Billing Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 