import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/layout";
import Navbar from "@/components/nav-bar";
import { WalletProvider } from "@/lib/contexts/WalletContext";
import "./globals.css";
import PurchaseStamina from "@/components/stamina/purchase-stamina";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Softcore Games",
  description: "Softcore Games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <WalletProvider>
          <Navbar />
          <Layout>{children}</Layout>
          <PurchaseStamina />
        </WalletProvider>
      </body>
    </html>
  );
}
