import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  ExternalLink,
  Zap
} from 'lucide-react';
import { 
  PaymentClient, 
  Subscription, 
  PricingPlan,
  formatCurrency,
  formatDate,
  getSubscriptionStatus
} from '../../utils/paymentClient';

interface SubscriptionManagerProps {
  onSubscriptionChange?: (subscription: Subscription | null) => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  onSubscriptionChange
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const paymentClient = new PaymentClient();

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [subscriptionData, plansData] = await Promise.all([
        paymentClient.getSubscription(),
        paymentClient.getPricingPlans()
      ]);
      
      setSubscription(subscriptionData);
      setPlans(plansData);
      onSubscriptionChange?.(subscriptionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planType: string) => {
    setActionLoading(`upgrade-${planType}`);
    try {
      await paymentClient.upgradePlan(planType);
      await loadSubscriptionData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upgrade plan');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDowngrade = async (planType: string) => {
    setActionLoading(`downgrade-${planType}`);
    try {
      await paymentClient.downgradePlan(planType);
      await loadSubscriptionData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to downgrade plan');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (immediately = false) => {
    if (!subscription) return;
    
    setActionLoading('cancel');
    try {
      await paymentClient.cancelSubscription(subscription.id, immediately);
      await loadSubscriptionData();
      setShowCancelConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async () => {
    if (!subscription) return;
    
    setActionLoading('reactivate');
    try {
      await paymentClient.reactivateSubscription(subscription.id);
      await loadSubscriptionData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const openBillingPortal = async () => {
    setActionLoading('portal');
    try {
      const { url } = await paymentClient.createPortalSession();
      window.open(url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal');
    } finally {
      setActionLoading(null);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription) return plans.find(p => p.id === 'free');
    return plans.find(p => p.id === subscription.plan_type);
  };

  const getAvailableUpgrades = () => {
    if (!subscription) return plans.filter(p => p.id !== 'free');
    
    const planHierarchy = ['free', 'starter', 'professional', 'enterprise'];
    const currentIndex = planHierarchy.indexOf(subscription.plan_type);
    
    return plans.filter(p => {
      const planIndex = planHierarchy.indexOf(p.id);
      return planIndex > currentIndex;
    });
  };

  const getAvailableDowngrades = () => {
    if (!subscription || subscription.plan_type === 'free') return [];
    
    const planHierarchy = ['free', 'starter', 'professional', 'enterprise'];
    const currentIndex = planHierarchy.indexOf(subscription.plan_type);
    
    return plans.filter(p => {
      const planIndex = planHierarchy.indexOf(p.id);
      return planIndex < currentIndex;
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading subscription...</span>
        </div>
      </div>
    );
  }

  const currentPlan = getCurrentPlan();
  const statusInfo = subscription ? getSubscriptionStatus(subscription) : null;

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Current Subscription */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Current Subscription
          </h3>
          <button
            onClick={loadSubscriptionData}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {subscription ? (
          <div className="space-y-4">
            {/* Plan Info */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {currentPlan?.name || subscription.plan_type}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(subscription.amount, subscription.currency)} per {subscription.interval}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo?.bgColor} ${statusInfo?.color}`}>
                {statusInfo?.text}
              </div>
            </div>

            {/* Billing Period */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                Current period: {formatDate(new Date(subscription.current_period_start).getTime() / 1000)} - {formatDate(new Date(subscription.current_period_end).getTime() / 1000)}
              </span>
            </div>

            {/* Cancel at period end warning */}
            {subscription.cancel_at_period_end && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    Your subscription will be canceled at the end of the current billing period.
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={openBillingPortal}
                disabled={actionLoading === 'portal'}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {actionLoading === 'portal' ? 'Opening...' : 'Manage Billing'}
              </button>

              {subscription.cancel_at_period_end ? (
                <button
                  onClick={handleReactivate}
                  disabled={actionLoading === 'reactivate'}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {actionLoading === 'reactivate' ? 'Reactivating...' : 'Reactivate'}
                </button>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Active Subscription
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You're currently on the free plan. Upgrade to unlock more features.
            </p>
          </div>
        )}
      </div>

      {/* Available Upgrades */}
      {getAvailableUpgrades().length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Available Upgrades
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getAvailableUpgrades().map((plan) => (
              <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{plan.name}</h4>
                  {plan.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{plan.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(plan.price_monthly)} /month
                  </span>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={actionLoading === `upgrade-${plan.id}`}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {actionLoading === `upgrade-${plan.id}` ? 'Upgrading...' : 'Upgrade'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Cancel Subscription
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => handleCancel(false)}
                disabled={actionLoading === 'cancel'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === 'cancel' ? 'Canceling...' : 'Cancel at Period End'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 