import React from "react";
import { Scene } from "@/types/game";
import { IoMdClose } from "react-icons/io";
import Mint from "../mint";
import Image from "next/image";

interface SceneHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
  onMint: () => Promise<void>;
  onSceneSelect: (sceneIndex: number) => void;
  currentSceneIndex: number;
}

export default function SceneHistoryDialog({
  isOpen,
  onClose,
  scenes,
  onMint,
  onSceneSelect,
  currentSceneIndex,
}: SceneHistoryDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-11/12 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Story History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          {scenes.map((scene, index) => (
            <div
              key={`${scene.id}-${scene._updateKey || 0}`}
              className={`border-b border-gray-200 pb-6 last:border-0 ${
                currentSceneIndex === index ? "bg-yellow-50 p-4 rounded-lg" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{scene.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Scene {index + 1}
                      </span>
                      <button
                        onClick={() => onSceneSelect(index)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        disabled={currentSceneIndex === index}
                      >
                        {currentSceneIndex === index ? "Current" : "View"}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{scene.content}</p>
                  {scene.userChoices && scene.userChoices.length > 0 && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-md mb-2">
                      <div className="font-semibold mb-1">Your choice:</div>
                      <div>{scene.userChoices[0].choiceText}</div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Mint scene={scene} onMint={onMint} />
                  </div>
                </div>
                {scene.imageUrl && (
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <Image
                      src={scene.imageUrl}
                      alt={scene.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
