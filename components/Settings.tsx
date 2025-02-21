"use client";
import { useTheme } from "next-themes";
import { Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Settings = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-love-100 dark:hover:bg-love-800"
        >
          <SettingsIcon className="h-5 w-5 text-love-800 dark:text-love-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-slate-900 border border-love-200 dark:border-love-800 shadow-lg"
      >
        <DropdownMenuLabel className="text-love-800 dark:text-love-200 font-semibold">
          Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-love-200 dark:bg-love-800" />
        <DropdownMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hover:bg-love-50 dark:hover:bg-love-900 cursor-pointer text-love-700 dark:text-love-300"
        >
          {theme === "dark" ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="hover:bg-love-50 dark:hover:bg-love-900 cursor-pointer text-love-700 dark:text-love-300"
        >
          <SettingsIcon className="mr-2 h-4 w-4" />
          <span>API Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
