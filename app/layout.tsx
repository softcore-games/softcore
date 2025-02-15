import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

// Metadata must be exported from server component
export const metadata: Metadata = {
  title: 'Softcore - Visual Novel Game',
  description: 'A programming-themed visual novel game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}