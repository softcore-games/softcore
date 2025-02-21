"use client";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Save, Upload, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onLogout?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  children?: React.ReactNode;
}

export const Header = ({ onLogout, onSave, onLoad, children }: HeaderProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear local storage
      localStorage.removeItem("token");
      // localStorage.removeItem("gameState");
      // localStorage.removeItem("selectedCharacterData");
      // localStorage.removeItem("selectedCharacterId");

      // Call the parent's onLogout handler if provided
      if (onLogout) {
        onLogout();
      }

      // Redirect to login page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-love-900 dark:text-love-100 truncate">
              SoftCORE
            </h1>
            <div className="hidden sm:block">
              <ModeToggle />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {children}
              {onSave && (
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:size-default"
                  onClick={onSave}
                >
                  <Save className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
              )}
              {onLoad && (
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:size-default"
                  onClick={onLoad}
                >
                  <Upload className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Load</span>
                </Button>
              )}
              {onLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 sm:size-default"
                  onClick={handleLogout}
                >
                  <span>Logout</span>
                </Button>
              )}
            </div>

            <div className="sm:hidden flex items-center gap-2">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {children}
                  {onSave && (
                    <DropdownMenuItem onClick={onSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </DropdownMenuItem>
                  )}
                  {onLoad && (
                    <DropdownMenuItem onClick={onLoad}>
                      <Upload className="w-4 h-4 mr-2" />
                      Load
                    </DropdownMenuItem>
                  )}
                  {onLogout && (
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-600 focus:text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
