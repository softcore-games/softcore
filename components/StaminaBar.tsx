'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Battery, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StaminaBarProps {
  currentStamina: number;
  maxStamina: number;
  subscription?: string;
}

export function StaminaBar({ currentStamina, maxStamina, subscription }: StaminaBarProps) {
  const router = useRouter();
  const [staminaPercent, setStaminaPercent] = useState(0);

  useEffect(() => {
    setStaminaPercent((currentStamina / maxStamina) * 100);
  }, [currentStamina, maxStamina]);

  const getStaminaColor = () => {
    if (staminaPercent > 60) return 'bg-green-500';
    if (staminaPercent > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed top-20 right-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-gray-700 shadow-lg">
      <div className="flex items-center gap-4 mb-2">
        <Battery className="w-5 h-5 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">
          Stamina: {currentStamina}/{maxStamina}
        </span>
        {subscription === 'PREMIUM' && (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-400">
            <Crown className="w-3 h-3" />
            Premium
          </span>
        )}
      </div>
      
      <Progress
        value={staminaPercent}
        className="w-48 h-2 bg-gray-700"
        indicatorClassName={getStaminaColor()}
      />

      {currentStamina < 20 && (
        <div className="mt-3">
          <Button
            onClick={() => router.push('/subscription')}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-xs"
          >
            <Crown className="w-4 h-4 mr-1" />
            Upgrade for Unlimited Stamina
          </Button>
        </div>
      )}
    </div>
  );
}