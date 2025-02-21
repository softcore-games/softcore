"use client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/contexts/WalletContext";
import { ThemeProvider } from "next-themes";
const queryClient = new QueryClient();
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WalletProvider>
            <Toaster />
            <Sonner />
            {children}
          </WalletProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
