"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SceneProvider, useScene } from "@/lib/contexts/SceneContext";
import { STATIC_PAGES } from "@/lib/constants";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutRender = ({ children }: LayoutProps) => {
  const { currentScene } = useScene();
  const pathname = usePathname();

  // Check if current page is About or FAQ using the constant
  const isStaticPage = STATIC_PAGES.includes(
    pathname as (typeof STATIC_PAGES)[number]
  );

  return (
    <div
      className={`flex justify-center items-center h-[150vh] ${
        isStaticPage ? "bg-white" : "bg-black"
      }`}
    >
      <div
        className={`w-screen h-full ${
          isStaticPage
            ? "bg-white"
            : "bg-cover bg-center border-8 border-black rounded-2xl shadow-lg relative"
        } z-10`}
        style={
          isStaticPage
            ? {}
            : {
                backgroundColor: "#0000006e",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: currentScene
                  ? `url('${currentScene?.imageUrl}')`
                  : "url('/images/view.png')",
              }
        }
      >
        {!isStaticPage && (
          /* Dark overlay for background image - only show for non-static pages */
          <div className="absolute inset-0 bg-black/50 rounded-xl" />
        )}

        {/* Content Container */}
        <div className={`${isStaticPage ? "" : "pt-20"} relative z-10`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SceneProvider>
      <LayoutRender>{children}</LayoutRender>
    </SceneProvider>
  );
};

export default Layout;
