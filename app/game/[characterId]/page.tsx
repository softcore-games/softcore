import React from "react";
import Scene from "@/components/scene/scene";
import ProtectedRoute from "@/components/auth/protected-route";
import { SceneProvider } from "@/lib/contexts/SceneContext";

const Page = () => {
  return (
    <ProtectedRoute>
      <SceneProvider>
        <Scene />
      </SceneProvider>
    </ProtectedRoute>
  );
};

export default Page;
