import React from "react";
import Character from "@/components/character";
import ProtectedRoute from "@/components/auth/protected-route";
const CharacterPage = () => {
  return (
    <ProtectedRoute>
      <Character />
    </ProtectedRoute>
  );
};

export default CharacterPage;
