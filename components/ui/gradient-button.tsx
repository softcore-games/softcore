'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const gradientButtonVariants = cva(
  "font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white",
        play: "bg-gradient-to-r from-pink-500/90 to-rose-600/90 hover:from-pink-600 hover:to-rose-700 text-white",
        settings: "bg-gradient-to-r from-purple-500/90 to-violet-600/90 hover:from-purple-600 hover:to-violet-700 text-white",
        logout: "bg-gradient-to-r from-red-500/90 to-orange-600/90 hover:from-red-600 hover:to-orange-700 text-white",
        login: "bg-gradient-to-r from-rose-500/90 to-pink-600/90 hover:from-rose-600 hover:to-pink-700 text-white",
        register: "bg-gradient-to-r from-violet-500/90 to-purple-600/90 hover:from-violet-600 hover:to-purple-700 text-white",
      },
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1 text-sm",
        lg: "px-8 py-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface GradientButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };