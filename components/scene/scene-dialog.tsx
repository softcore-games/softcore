import React, { useState } from "react";
import { CgPlayPause } from "react-icons/cg";
import { TiBatteryMid } from "react-icons/ti";
import { FaHistory } from "react-icons/fa";
import Mint from "../mint";
import SceneHistoryDialog from "./scene-history-dialog";
import { Scene } from "@/types/game";

interface SceneDialogProps {
  scene: {
    id: string;
    title: string;
    content: string;
    nftMinted: boolean;
    imageUrl: string;
  };
  character: {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  stamina: number;
  allScenes: Scene[];
  onPrevious: () => void;
  onNext: () => void;
  onMint: () => Promise<void>;
  isFirstScene: boolean;
  isLastScene: boolean;
  disableNext?: boolean;
  onSceneSelect: (index: number) => void;
  currentIndex: number;
}

export default function SceneDialog({
  scene,
  character,
  stamina,
  allScenes,
  onPrevious,
  onNext,
  onMint,
  isFirstScene,
  isLastScene,
  disableNext = false,
  onSceneSelect,
  currentIndex,
}: SceneDialogProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Define constants for hearts display
  const MAX_HEARTS = 3;
  const currentHearts = Math.min(
    Math.max(Math.floor(stamina / 33), 0),
    MAX_HEARTS
  );

  const renderHearts = () => {
    return (
      <div className="flex">
        {[...Array(MAX_HEARTS)].map((_, index) => (
          <span
            key={index}
            className={`text-sm sm:text-base md:text-3xl ${
              index < currentHearts ? "text-pink-500" : "text-gray-400"
            }`}
          >
            ♡
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className=" bg-white rounded-xl p-3 sm:p-4 md:p-5 sm:pb-1 md:pb-1 relative bottom-1 sm:bottom-2 md:bottom-9 border-2 border-black z-10 shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-between">
      <div className="flex items-center space-x-3 mb-2">
        <span className="font-bold text-sm sm:text-base md:text-2xl text-black">
          {character?.name || "Unknown Character"}
        </span>
        <div className="flex space-x-1 mr-5">{renderHearts()}</div>
        <div className="flex items-center justify-center gap-1">
          <span className="font-bold text-sm sm:text-lg md:text-xl text-black justify-center items-center">
            {stamina || 0}
          </span>
          <TiBatteryMid className="text-black w-6 h-6 md:w-8 md:h-8" />
        </div>
      </div>
      <p className="md:w-3/4 text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed text-start">
        {scene.content}
      </p>
      <div className="grid grid-cols-4 items-center mt-2">
        <div className="justify-self-start">
          {/* Remove redundant stamina display */}
        </div>

        {/* Center buttons */}
        <div className="col-span-2 flex justify-center space-x-4">
          {/* <button className="p-1 sm:p-1.5 md:p-2.5 rounded-full hover:bg-gray-100 transition-colors">
            <CgPlayPause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
          </button> */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-1 sm:p-1.5 md:p-2.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaHistory className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        {/* Mint button */}
        <div className="justify-self-end">
          <Mint scene={scene} onMint={onMint} />
        </div>
      </div>

      {/* History Dialog */}
      <SceneHistoryDialog
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        scenes={allScenes}
        onMint={onMint}
        onSceneSelect={(index) => {
          onSceneSelect(index);
          setIsHistoryOpen(false);
        }}
        currentSceneIndex={currentIndex}
      />
    </div>
  );
}
