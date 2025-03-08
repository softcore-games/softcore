import React from "react";

interface SceneDialogSelectionProps {
  choices: string[];
  onChoiceSelect: (choice: string, index: number) => void;
  selectedChoice?: number;
  previousChoice?: number;
  isProcessing: boolean;
  isHistoricalScene?: boolean;
}

export default function SceneDialogSelection({
  choices,
  onChoiceSelect,
  selectedChoice,
  previousChoice,
  isProcessing,
  isHistoricalScene = false,
}: SceneDialogSelectionProps) {
  return (
    <div className="grid justify-center md:justify-start items-center gap-2 md:gap-7 bg-opacity-50 pb-2 md:pb-9 rounded-lg mb-2 md:mb-10">
      {choices.map((choice, index) => {
        const isSelected = selectedChoice === index || previousChoice === index;
        const isDisabled =
          isHistoricalScene || previousChoice !== undefined || isProcessing;

        return (
          <button
            key={`${choice}-${index}`}
            onClick={() => !isDisabled && onChoiceSelect(choice, index)}
            disabled={isDisabled}
            className={`cursor-pointer text-left px-2 sm:px-4 md:px-10 md:pr-72 py-2 border-b-2 border-black shadow-lg font-semibold text-xs sm:text-sm md:text-base max-w-[300px] sm:max-w-[400px] md:max-w-none mx-auto md:mx-0 transition-colors ${
              isSelected
                ? "bg-pink-300 text-black ring-2 ring-pink-500"
                : isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-300 text-black hover:bg-yellow-400"
            }`}
          >
            {isProcessing && selectedChoice === index ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                &quot;{choice}&quot;
              </span>
            ) : (
              <>
                &quot;{choice}&quot;
                {isSelected && <span className="ml-2 text-pink-600">✓</span>}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
