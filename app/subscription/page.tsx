'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Crown, Zap, Infinity, Check, Loader2 } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Zap,
    features: [
      'Daily stamina limit: 100',
      '5 scene generations per day',
      '2 NFT mints per day',
      'Basic support',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    icon: Crown,
    features: [
      'Daily stamina limit: 200',
      '15 scene generations per day',
      '5 NFT mints per day',
      'Priority support',
      'Exclusive scenes',
    ],
    color: 'from-yellow-500 to-yellow-600',
    recommended: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 19.99,
    icon: Infinity,
    features: [
      'Unlimited stamina',
      'Unlimited scene generations',
      'Unlimited NFT mints',
      'Premium support',
      'Exclusive scenes',
      'Early access to new features',
    ],
    color: 'from-purple-500 to-purple-600',
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentPlan(data.type || 'free');
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(planId);
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planId }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Subscription updated successfully',
        });
        setCurrentPlan(planId);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update subscription',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock unlimited possibilities with our premium features. Choose the plan that best fits your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 ${
                plan.recommended ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl">
                  Recommended
                </div>
              )}

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <plan.icon className={`w-6 h-6 ${
                    plan.recommended ? 'text-yellow-500' : 'text-blue-400'
                  }`} />
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing === plan.id || currentPlan === plan.id}
                  className={`w-full bg-gradient-to-r ${plan.color}`}
                >
                  {isProcessing === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentPlan === plan.id ? (
                    'Current Plan'
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}