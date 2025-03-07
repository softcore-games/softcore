import React from 'react';
import { CgPlayPause } from 'react-icons/cg';
import { GrFormPrevious } from 'react-icons/gr';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { TiBatteryMid } from 'react-icons/ti';
import Mint from '../mint';

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
const ArrowRight = () => (
  <svg
    width="15"
    height="15"
    className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]"
    viewBox="0 0 43 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M35.8333 17.9167L37.1 19.1834L38.3667 17.9167L37.1 16.65L35.8333 17.9167ZM5.37495 32.25C5.37495 32.7252 5.56371 33.1809 5.89972 33.5169C6.23572 33.8529 6.69144 34.0417 7.16662 34.0417C7.6418 34.0417 8.09752 33.8529 8.43352 33.5169C8.76952 33.1809 8.95828 32.7252 8.95828 32.25H5.37495ZM28.1417 28.1417L37.1 19.1834L34.5666 16.65L25.6082 25.6083L28.1417 28.1417ZM37.1 16.65L28.1417 7.69165L25.6082 10.2251L34.5666 19.1834L37.1 16.65ZM35.8333 16.125H17.9166V19.7084H35.8333V16.125ZM5.37495 28.6667V32.25H8.95828V28.6667H5.37495ZM17.9166 16.125C14.5904 16.125 11.4003 17.4464 9.04832 19.7984C6.6963 22.1504 5.37495 25.3404 5.37495 28.6667H8.95828C8.95828 26.2908 9.90211 24.0122 11.5821 22.3322C13.2621 20.6522 15.5407 19.7084 17.9166 19.7084V16.125Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowLeft = () => (
  <svg
    width="15"
    height="15"
    className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]"
    viewBox="0 0 43 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M35.8333 17.9167L37.1 19.1834L38.3667 17.9167L37.1 16.65L35.8333 17.9167ZM5.37495 32.25C5.37495 32.7252 5.56371 33.1809 5.89972 33.5169C6.23572 33.8529 6.69144 34.0417 7.16662 34.0417C7.6418 34.0417 8.09752 33.8529 8.43352 33.5169C8.76952 33.1809 8.95828 32.7252 8.95828 32.25H5.37495ZM28.1417 28.1417L37.1 19.1834L34.5666 16.65L25.6082 25.6083L28.1417 28.1417ZM37.1 16.65L28.1417 7.69165L25.6082 10.2251L34.5666 19.1834L37.1 16.65ZM35.8333 16.125H17.9166V19.7084H35.8333V16.125ZM5.37495 28.6667V32.25H8.95828V28.6667H5.37495ZM17.9166 16.125C14.5904 16.125 11.4003 17.4464 9.04832 19.7984C6.6963 22.1504 5.37495 25.3404 5.37495 28.6667H8.95828C8.95828 26.2908 9.90211 24.0122 11.5821 22.3322C13.2621 20.6522 15.5407 19.7084 17.9166 19.7084V16.125Z"
      fill="currentColor"
      transform="scale(-1, 1) translate(-43, 0)"
    />
  </svg>
);

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
              index < lives ? 'text-pink-500' : 'text-gray-400'
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
    <div className="h-[280px] sm:h-[400px] md:h-full bg-white rounded-xl p-3 sm:p-4 md:p-5 sm:pb-1 md:pb-1 relative bottom-1 sm:bottom-2 md:bottom-9 border-2 border-black z-10 shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-between">
      <div className="flex items-center space-x-3 mb-2">
        <span className="font-bold text-sm sm:text-base md:text-2xl text-black">
          {character?.name || 'Unknown Character'}
        </span>
        <div className="flex space-x-1 mr-5 ">
          {/* Assuming you have a hearts array where filled=true means pink heart */}
          {renderHearts()}
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="font-bold text-sm sm:text-lg md:text-xl text-black justify-center items-center ">
            {stamina || 0}
          </span>
          <TiBatteryMid className="text-black w-6 h-6 md:w-8 md:h-8" />
        </div>
      </div>
      <p className="md:w-3/4 text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed text-start">
        {scene.content}
      </p>
      <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 items-center justify-center pb-0">
        <div className="justify-self-start">
          <button
            onClick={onPrevious}
            disabled={isFirstScene}
            className={`p-1 sm:p-1.5 md:p-2.5 rounded-full hover:bg-gray-100 text-black transition-colors ${
              isFirstScene ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeft />
          </button>
        </div>
        <div className="justify-self-center px-4 sm:px-6 md:px-8">
          <button className="p-1 sm:p-1.5 md:p-2.5 rounded-full hover:bg-gray-100 transition-colors">
            <CgPlayPause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 hover:text-gray-900" />
          </button>
        </div>
        <div className="justify-self-end ">
          <button
            onClick={onNext}
            disabled={isLastScene || disableNext || stamina <= 0}
            className={`p-1 sm:p-1.5 md:p-2.5 rounded-full hover:bg-gray-100 text-black transition-colors ${
              isLastScene || disableNext || stamina <= 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <ArrowRight />
          </button>
        </div>
        <div className="justify-self-center">
          <Mint scene={scene} onMint={onMint} />
        </div>
      </div>
    </div>
  );
}
