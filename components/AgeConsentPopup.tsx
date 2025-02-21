import { useState, useEffect } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface AgeConsentPopupProps {
  onConsent: () => void;
}

export const AgeConsentPopup = ({ onConsent }: AgeConsentPopupProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("age-consent");
    if (!hasConsented) {
      setOpen(true);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem("age-consent", "true");
    setOpen(false);
    onConsent();
    toast({
      title: "Welcome to SoftCORE Games",
      description: "You can now explore our content.",
    });
  };

  const handleReject = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-love-600" />
            Age Verification Required
          </DialogTitle>
          <DialogDescription>
            You must be at least 18 years old to access this content.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-love-50 dark:bg-love-950/50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-love-600 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-love-900 dark:text-love-100">
                By continuing, you confirm that:
              </p>
              <ul className="text-sm text-love-700 dark:text-love-300 list-disc list-inside space-y-1">
                <li>You are at least 18 years old</li>
                <li>You agree to view adult content</li>
                <li>You accept our terms of service</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleReject}
            className="sm:order-1"
          >
            I'm Under 18
          </Button>
          <Button
            onClick={handleConsent}
            className="bg-love-600 hover:bg-love-700 text-white"
          >
            I'm 18 or Older
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
