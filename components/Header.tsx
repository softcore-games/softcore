'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginDialog } from '@/components/LoginDialog';
import { RegisterDialog } from '@/components/RegisterDialog';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Settings, Play, User } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

export function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for authentication cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/profile', {
          credentials: 'include',
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return null;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 
              onClick={() => router.push('/')}
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer"
            >
              Softcore
            </h1>
          </div>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <GradientButton
                  variant="play"
                  onClick={() => router.push('/game')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </GradientButton>
                <GradientButton
                  variant="settings"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </GradientButton>
                <GradientButton
                  variant="profile"
                  onClick={() => router.push('/profile')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </GradientButton>
                <GradientButton
                  variant="logout"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </GradientButton>
              </>
            ) : (
              <>
                <GradientButton
                  variant="login"
                  onClick={() => setShowLoginDialog(true)}
                >
                  Login
                </GradientButton>
                <GradientButton
                  variant="register"
                  onClick={() => setShowRegisterDialog(true)}
                >
                  Register
                </GradientButton>
              </>
            )}
          </nav>
        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={() => {
          setIsAuthenticated(true);
          setShowLoginDialog(false);
        }}
      />

      <RegisterDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        onSuccess={() => {
          setShowLoginDialog(true);
          setShowRegisterDialog(false);
        }}
      />
    </header>
  );
}