import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { EnterpriseButton } from '../components/ui/EnterpriseComponents';
import { redirectToCheckout, PRICING_PLANS } from '../utils/stripe';
import { usePaymentStatus } from '../components/PaymentStatusProvider';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planDetails, setPlanDetails] = useState<any>(null);
  const { startPaymentTracking } = usePaymentStatus();

  const planId = searchParams.get('plan');
  const source = searchParams.get('source');
  const offer = searchParams.get('offer');
  const discount = searchParams.get('discount');

  useEffect(() => {
    if (planId) {
      // Find plan details
      const plan = Object.values(PRICING_PLANS).find(p => p.id === planId);
      if (plan) {
        setPlanDetails(plan);
      } else {
        setError(`Plan "${planId}" not found`);
      }
    } else {
      setError('No plan specified');
    }
  }, [planId]);

  const handleCheckout = async () => {
    if (!planDetails) return;

    setIsLoading(true);
    setError(null);

    try {
      // Start payment tracking before redirecting to Stripe
      const mockSessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      startPaymentTracking(mockSessionId, planDetails.name);
      
      await redirectToCheckout(planDetails.stripePriceId);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscountedPrice = () => {
    if (!planDetails || !discount) return planDetails?.price;
    const discountPercent = parseInt(discount) / 100;
    return Math.round(planDetails.price * (1 - discountPercent));
  };

  if (error) {
    return (
      <EnterpriseLayout
        title="Checkout Error"
        description="There was an issue with your checkout request"
        maxWidth="2xl"
        backgroundColor="dark"
      >
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Checkout Error</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <div className="space-y-4">
            <EnterpriseButton
              onClick={() => navigate('/pricing')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </EnterpriseButton>
            <EnterpriseButton
              onClick={() => navigate('/')}
              variant="secondary"
            >
              Go Home
            </EnterpriseButton>
          </div>
        </div>
      </EnterpriseLayout>
    );
  }

  if (!planDetails) {
    return (
      <EnterpriseLayout
        title="Loading Checkout"
        description="Preparing your checkout session"
        maxWidth="2xl"
        backgroundColor="dark"
      >
        <div className="text-center py-12">
          <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
          <p className="text-slate-400">Preparing your checkout session</p>
        </div>
      </EnterpriseLayout>
    );
  }

  const discountedPrice = calculateDiscountedPrice();
  const savings = discount ? planDetails.price - discountedPrice : 0;

  return (
    <EnterpriseLayout
      title={`Checkout - ${planDetails.name} Plan`}
      description={`Complete your purchase for the ${planDetails.name} plan`}
      maxWidth="2xl"
      backgroundColor="dark"
    >
      <div className="max-w-md mx-auto py-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Complete Your Purchase</h2>
            <p className="text-slate-400">You're about to upgrade to the {planDetails.name} plan</p>
          </div>

          {/* Plan Details */}
          <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">{planDetails.name} Plan</h3>
            
            <div className="space-y-3 text-sm">
              {planDetails.features.slice(0, 5).map((feature: string, index: number) => (
                <div key={index} className="flex items-center text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
              {planDetails.features.length > 5 && (
                <div className="text-slate-400 text-xs">
                  +{planDetails.features.length - 5} more features
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">Plan Price:</span>
              <span className={`text-white font-semibold ${discount ? 'line-through text-slate-500' : ''}`}>
                ${planDetails.price}/{planDetails.interval}
              </span>
            </div>
            
            {discount && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400">Discount ({discount}%):</span>
                  <span className="text-green-400 font-semibold">-${savings}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-slate-600 pt-2">
                  <span className="text-white">Total:</span>
                  <span className="text-green-400">${discountedPrice}/{planDetails.interval}</span>
                </div>
              </>
            )}

            {offer && offer !== 'discount' && (
              <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  {offer === 'trial' ? '14-day free trial included' : 'Special offer applied'}
                </p>
              </div>
            )}
          </div>

          {/* Source Info */}
          {source && (
            <div className="text-xs text-slate-500 mb-6 text-center">
              Source: {source.replace(/_/g, ' ')}
            </div>
          )}

          {/* Checkout Button */}
          <EnterpriseButton
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Complete Purchase - $${discountedPrice}/${planDetails.interval}`
            )}
          </EnterpriseButton>

          <div className="mt-6 space-y-3">
            <EnterpriseButton
              onClick={() => navigate('/pricing')}
              variant="secondary"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </EnterpriseButton>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-xs text-slate-500 text-center">
            <p>🔒 Secure checkout powered by Stripe</p>
            <p>Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default CheckoutPage; 