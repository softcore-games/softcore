import React from "react";
import { Scene } from "@/lib/types/game";
import { DialogueBox } from "./DialogueBox";
import { CharacterSprite } from "./CharacterSprite";
import { ChoiceMenu } from "./ChoiceMenu";
import { Background } from "./Background";
import { LoadingView } from "./LoadingView";

interface GameViewProps {
  currentScene: Scene | null;
  isLoading: boolean;
  displayText: string;
  isDialogueComplete: boolean;
  onChoice: (choice: { text: string; next: string }) => void;
  onContinue: () => void;
  onDialogueComplete: () => void;
}

export function GameView({
  currentScene,
  isLoading,
  displayText,
  isDialogueComplete,
  onChoice,
  onContinue,
  onDialogueComplete,
}: GameViewProps) {
  if (isLoading || !currentScene) {
    return <LoadingView isError={!currentScene && !isLoading} />;
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Background
        imageUrl={currentScene.backgroundImage}
        fallback={currentScene.background}
      />

      <CharacterSprite
        name={currentScene.character}
        emotion={currentScene.emotion}
        imageUrl={currentScene.characterImage}
        speaking={!isDialogueComplete}
      />

      <DialogueBox
        speaker={currentScene.character}
        text={displayText}
        onComplete={onDialogueComplete}
      />

      {isDialogueComplete && currentScene.choices && (
        <ChoiceMenu
          choices={currentScene.choices.map(
            (choice: { text: string; next: string }) => ({
              text: choice.text,
              action: () => onChoice(choice),
            })
          )}
          isProcessingChoice={isLoading}
        />
      )}

      {isDialogueComplete && !currentScene.choices && (
        <div className="absolute inset-0 cursor-pointer" onClick={onContinue} />
      )}
    </main>
  );
}
