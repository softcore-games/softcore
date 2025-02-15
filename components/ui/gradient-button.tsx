import { forwardRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'settings' | 'play' | 'logout' | 'login' | 'register' | 'profile';
  children?: ReactNode;
  className?: string;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
      settings: 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      play: 'from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700',
      logout: 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700',
      login: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      register: 'from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700',
      profile: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'bg-gradient-to-r transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GradientButton.displayName = 'GradientButton';