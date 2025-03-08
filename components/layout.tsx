"use client";
import React from "react";
import { SceneProvider, useScene } from "@/lib/contexts/SceneContext";
interface LayoutProps {
  children: React.ReactNode;
}

const LayoutRender = ({ children }: LayoutProps) => {
  const { currentScene } = useScene();

  return (
    <div className="flex justify-center items-center h-[150vh] bg-black">
      <div
        className="w-screen h-full bg-cover bg-center border-8 border-black rounded-2xl shadow-lg relative z-10"
        style={{
          backgroundColor: "#0000006e",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundImage: currentScene
            ? `url('${currentScene?.imageUrl}')`
            : "url('/images/view.png')",
        }}
      >
        {/* Dark overlay for background image */}
        <div className="absolute inset-0 bg-black/50 rounded-xl" />

        {/* Content Container */}
        <div className="pt-20 relative z-10">{children}</div>
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
