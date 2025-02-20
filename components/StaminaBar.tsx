"use client";

import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Battery, Crown, Infinity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

export function StaminaBar() {
  const router = useRouter();
  const { stamina, fetchStamina } = useGameStore();

  useEffect(() => {
    fetchStamina();
  }, [fetchStamina]);

  const getStaminaPercent = () => {
    if (stamina.subscription === "UNLIMITED") return 100;
    if (typeof stamina.max === "number") {
      return (stamina.current / stamina.max) * 100;
    }
    return 0;
  };

  const getStaminaColor = () => {
    if (stamina.subscription === "UNLIMITED") return "bg-purple-500";
    const percent = getStaminaPercent();
    if (percent > 60) return "bg-green-500";
    if (percent > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="fixed top-20 right-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-gray-700 shadow-lg">
      <div className="flex items-center gap-4 mb-2">
        {stamina.subscription === "UNLIMITED" ? (
          <Infinity className="w-5 h-5 text-purple-400" />
        ) : (
          <Battery className="w-5 h-5 text-blue-400" />
        )}
        <span className="text-sm font-medium text-gray-300">
          Stamina:{" "}
          {stamina.subscription === "UNLIMITED"
            ? "∞"
            : `${stamina.current}/${stamina.max}`}
        </span>
        {stamina.subscription && stamina.subscription !== "FREE" && (
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              stamina.subscription === "UNLIMITED"
                ? "bg-purple-500/20 text-purple-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            <Crown className="w-3 h-3" />
            {stamina.subscription.charAt(0) +
              stamina.subscription.slice(1).toLowerCase()}
          </span>
        )}
      </div>

      <Progress
        value={getStaminaPercent()}
        className="w-48 h-2 bg-gray-700"
        indicatorClassName={getStaminaColor()}
      />

      {stamina.current < 20 && stamina.subscription !== "UNLIMITED" && (
        <div className="mt-3">
          <Button
            onClick={() => router.push("/subscription")}
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
