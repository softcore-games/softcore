import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scene } from "@/data/gameData";
import { ArrowLeft, ArrowRight, ChevronUp } from "lucide-react";

interface MobileDialogueBoxProps {
  currentScene: Scene;
  displayedText: string;
  isTyping: boolean;
  selectedChoice: number | null;
  onChoiceSelect: (index: number) => void;
  isNextSceneLoading: boolean;
  isReviewingPastScene: boolean;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export const MobileDialogueBox = ({
  currentScene,
  displayedText,
  isTyping,
  selectedChoice,
  onChoiceSelect,
  isNextSceneLoading,
  isReviewingPastScene,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
}: MobileDialogueBoxProps) => {
  const getFirstSentence = (text: string) => {
    if (!text) return "";
    const match = text.match(/^[^.!?]+[.!?]?/);
    return match ? match[0] : text;
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border border-love-200 dark:border-love-800 rounded-t-xl">
        <div className="p-4">
          <div className="flex justify-center mb-2">
            <ChevronUp className="w-6 h-6 text-love-400" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-love-900 dark:text-love-100 line-clamp-1">
                {getFirstSentence(currentScene.message)}
              </h2>
              {isTyping && (
                <span className="text-xs text-love-600 dark:text-love-300 animate-pulse whitespace-nowrap ml-2">
                  Tap to skip
                </span>
              )}
            </div>

            <div className="bg-love-50/50 dark:bg-love-900/30 backdrop-blur-sm rounded-lg p-4 max-h-[35vh] overflow-y-auto scrollbar-thin scrollbar-thumb-love-200 dark:scrollbar-thumb-love-800 scrollbar-track-transparent">
              <p className="text-base text-love-800 dark:text-love-200 leading-relaxed">
                {displayedText}
              </p>
            </div>

            <div className="space-y-2">
              {!isTyping &&
                currentScene.choices?.map((choice, index) => (
                  <Button
                    key={index}
                    variant={selectedChoice === index ? "default" : "secondary"}
                    className={`w-full text-sm py-3 transition-all duration-200 ${
                      selectedChoice === index
                        ? "bg-primary hover:bg-primary-hover text-primary-foreground dark:bg-love-400 dark:hover:bg-love-500"
                        : "bg-love-100 hover:bg-love-200 text-love-900 dark:bg-love-800/80 dark:hover:bg-love-700/90 dark:text-white"
                    } ${
                      isReviewingPastScene
                        ? "opacity-75 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => onChoiceSelect(index)}
                    disabled={isNextSceneLoading || isReviewingPastScene}
                  >
                    {choice.text}
                  </Button>
                ))}
            </div>

            {isReviewingPastScene && (
              <p className="text-sm text-love-500 dark:text-love-300 text-center">
                This is a past scene. Go to the latest scene to make new
                choices.
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                disabled={!canGoBack}
                className="text-love-600 hover:text-love-700 hover:bg-love-100 dark:text-love-400 dark:hover:text-love-200 dark:hover:bg-love-800/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onForward}
                disabled={!canGoForward}
                className="text-love-600 hover:text-love-700 hover:bg-love-100 dark:text-love-400 dark:hover:text-love-200 dark:hover:bg-love-800/50 transition-colors"
              >
                Forward
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
