"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user?.isAdmin) {
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
        }

        toast({
          title: "Access Denied",
          description: "You do not have admin privileges",
          variant: "destructive",
        });
        router.push("/");
      } catch (error) {
        console.error("Admin check error:", error);
        router.push("/");
      }
    };

    checkAdminStatus();
  }, [router, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return children;
}
