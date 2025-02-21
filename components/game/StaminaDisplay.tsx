import { Button } from "@/components/ui/button";
import { Battery, BatteryCharging } from "lucide-react";

interface StaminaDisplayProps {
  stamina: number;
  onPurchase: () => void;
}

export const StaminaDisplay = ({
  stamina,
  onPurchase,
}: StaminaDisplayProps) => {
  return (
    <div className="flex items-center gap-4 mr-4">
      <div className="flex items-center gap-2 bg-white/10 dark:bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <Battery
          className={`w-5 h-5 ${
            stamina > 0 ? "text-green-500" : "text-red-500"
          }`}
        />
        <span className="text-sm font-medium">{stamina} prompts left</span>
      </div>
      <Button
        variant="default"
        size="sm"
        onClick={onPurchase}
        className="bg-love-500 hover:bg-love-600"
      >
        <BatteryCharging className="w-4 h-4 mr-2" />
        Purchase 5 Prompts
      </Button>
    </div>
  );
};
