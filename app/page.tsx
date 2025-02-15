'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoginDialog } from '@/components/LoginDialog';
import { Play } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleStartClick = () => {
    if (isAuthenticated) {
      router.push('/game');
    } else {
      setShowLoginDialog(true);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to Softcore
          </h1>
          <p className="text-xl text-gray-300">
            Embark on a journey through the world of programming and relationships
          </p>

          <GradientButton
            size="lg"
            onClick={handleStartClick}
          >
            <Play className="w-6 h-6 mr-2" />
            Start Your Journey
          </GradientButton>
        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={() => {
          setIsAuthenticated(true);
          setShowLoginDialog(false);
          router.push('/game');
        }}
      />
    </main>
  );
}