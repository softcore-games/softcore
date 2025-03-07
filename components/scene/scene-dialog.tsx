import React from "react";
import { CgPlayPause } from "react-icons/cg";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext } from "react-icons/md";
import { TiBatteryMid } from "react-icons/ti";
import Mint from "../mint";

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
  lives?: number;
  maxLives?: number;
  onPrevious: () => void;
  onNext: () => void;
  onMint: () => Promise<void>;
  isFirstScene: boolean;
  isLastScene: boolean;
  disableNext?: boolean;
}

export default function SceneDialog({
  scene,
  character,
  stamina = 0, // Add default value
  lives = 3,
  maxLives = 4,
  onPrevious,
  onNext,
  onMint,
  isFirstScene,
  isLastScene,
  disableNext = false, // Add this line with a default value
}: SceneDialogProps) {
  const renderHearts = () => {
    return (
      <div className="flex">
        {[...Array(maxLives)].map((_, index) => (
          <span
            key={index}
            className={`text-sm sm:text-base md:text-3xl ${
              index < lives ? "text-pink-500" : "text-gray-400"
            }`}
          >
            ♡
          </span>
        ))}
      </div>
    );
  };

  // console.log("Character name:", character.name);
  // console.log("Current stamina:", stamina);

  return (
    <div className="h-full bg-white rounded-xl p-3 sm:p-4 md:p-5 relative bottom-1 sm:bottom-2 md:bottom-9 border-2 border-black z-10 shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-between">
      <div className="flex items-center space-x-2 sm:space-x-1 mb-1">
        <span className="font-bold text-sm sm:text-base md:text-2xl">
          {character?.name || "Unknown Character"}
        </span>
        {renderHearts()}
        <div className="flex items-center ml-auto">
          <span className="font-bold text-sm sm:text-base md:text-sm">
            {stamina || 0}
          </span>
          <span className="w-6 h-6 flex items-center justify-center font-bold text-sm sm:text-base md:text-3xl">
            <TiBatteryMid className="text-black w-5 h-5 text-sm sm:text-base md:text-3xl" />
          </span>
        </div>
      </div>
      <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed text-start">
        {scene.content}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 items-center">
        <div className="justify-self-center">
          <button
            onClick={onPrevious}
            disabled={isFirstScene}
            className={`p-1.5 sm:p-2 md:p-2.5 rounded-full hover:bg-gray-100 transition-colors ${
              isFirstScene ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <GrFormPrevious className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
          </button>
        </div>
        <div className="justify-self-center">
          <button className="p-1.5 sm:p-2 md:p-2.5 rounded-full hover:bg-gray-100 transition-colors">
            <CgPlayPause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
          </button>
        </div>
        <div className="justify-self-center">
          <button
            onClick={onNext}
            disabled={isLastScene || disableNext || stamina <= 0}
            className={`p-1.5 sm:p-2 md:p-2.5 rounded-full hover:bg-gray-100 transition-colors ${
              isLastScene || disableNext || stamina <= 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <MdOutlineNavigateNext className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
          </button>
        </div>
        <div className="justify-self-center">
          <Mint scene={scene} onMint={onMint} />
        </div>
      </div>
    </div>
  );
}
