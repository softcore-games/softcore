'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';

interface AgeVerificationDialogProps {
  open: boolean;
  onVerify: () => void;
}

export function AgeVerificationDialog({ open, onVerify }: AgeVerificationDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = () => {
    setIsSubmitting(true);
    try {
      // Set age verification cookie that expires in 1 year
      Cookies.set('age_verified', 'true', { expires: 365 });
      
      toast({
        title: 'Success',
        description: 'Age verification successful',
      });
      onVerify();
    } catch (error) {
      console.error('Age verification error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during age verification',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = () => {
    router.push('https://www.google.com');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            Age Verification Required
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            This content is intended for adults aged 18 and older.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-300">
              By continuing, you confirm that:
            </p>
            <ul className="mt-2 space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                • You are at least 18 years old
              </li>
              <li className="flex items-center gap-2">
                • You understand this content contains adult themes
              </li>
              <li className="flex items-center gap-2">
                • You accept our terms of service and content guidelines
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={handleDecline}
              className="hover:bg-gray-700"
            >
              Decline & Exit
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              {isSubmitting ? 'Verifying...' : 'I am 18 or older'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}