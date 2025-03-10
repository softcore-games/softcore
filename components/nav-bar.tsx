"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { FiPower } from "react-icons/fi";
import { RiMenu3Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { SocialIcons } from "./nav-bar/social-icons";
import { NavLinks } from "./nav-bar/nav-links";
import { CoreButton } from "./nav-bar/core-button";
import { WalletConnect } from "./wallet/WalletConnect";
import { BRAND } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const isStaticPage = ["/about", "/faq"].includes(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout, verifyAuth } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  // Add effect to verify auth state when component mounts
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await logout();
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 lg:px-12 py-2 pt-4 z-50">
        <div className="flex items-center">
          <Link href="/">
            <span className={`text-2xl font-bold  text-white`}>
              {BRAND.name}
            </span>
          </Link>
        </div>
      </nav>
    );
  }

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch("/api/connect-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: "0x..." }),
      });
      if (!response.ok) throw new Error("Wallet connection failed");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 lg:px-12 py-2 pt-4 z-50">
      {/* Logo and Social Icons */}
      <div className="flex items-center">
        <div className="flex items-center gap-1">
          <Link href="/">
            <span className={`text-2xl font-bold text-white`}>
              {BRAND.name}
            </span>
          </Link>
        </div>
        <SocialIcons className="hidden lg:flex items-center gap-2 relative lg:left-2 xl:left-10" />
      </div>

      {/* Mobile/Tablet Menu Button */}
      <button
        className="lg:hidden text-white text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <IoClose /> : <RiMenu3Line />}
      </button>

      {/* Trapezoid - visible only on large screens */}
      <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-2/4">
        <div className="w-full h-2 border-t-[60px] border-t-black border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent"></div>
      </div>
      <div className="hidden lg:block absolute -top-10 left-5 w-[150px] h-10 bg-black rounded-t-lg"></div>

      {/* Navigation Links - Desktop */}
      <NavLinks
        isLoggedIn={!!user}
        stamina={user?.stamina}
        className="hidden lg:flex"
      />

      {/* Connect/Login Buttons - Desktop */}
      <div className="hidden lg:flex items-center space-x-3">
        {user ? (
          <>
            <WalletConnect />
            <FiPower
              className="text-white text-3xl cursor-pointer"
              title="Logout"
              onClick={handleLogout}
            />
          </>
        ) : (
          <Link href="/">
            <CoreButton className="px-2" />
          </Link>
        )}
      </div>

      {/* Mobile/Tablet Menu */}
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } lg:hidden fixed top-[60px] left-0 right-0 bottom-0 bg-black/95 backdrop-blur-sm flex-col items-center py-6 space-y-6`}
      >
        <div className="w-full max-w-3xl mx-auto px-6 md:px-12">
          <SocialIcons className="flex justify-center mb-8" />
          <NavLinks
            isLoggedIn={!!user}
            stamina={user?.stamina}
            className="flex flex-col items-center space-y-6 md:space-y-8 text-center"
          />
          <div className="mt-8 flex flex-col items-center gap-6">
            {user ? (
              <div className="flex flex-col items-center gap-6">
                <WalletConnect />
                <FiPower
                  className="text-white text-3xl cursor-pointer"
                  title="Logout"
                  onClick={handleLogout}
                />
              </div>
            ) : (
              <Link href="/">
                <CoreButton className="px-8 py-3 w-full md:w-auto" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
