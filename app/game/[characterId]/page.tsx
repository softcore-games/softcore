import React from "react";
import Scene from "@/components/scene/scene";
import ProtectedRoute from "@/components/auth/protected-route";

const Page = () => {
  return (
    <ProtectedRoute>
      <Scene />
    </ProtectedRoute>
  );
};

export default Page;
