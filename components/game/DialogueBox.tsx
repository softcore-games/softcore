import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scene } from "@/data/gameData";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MobileDialogueBox } from "./MobileDialogueBox";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogueBoxProps {
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

export const DialogueBox = (props: DialogueBoxProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileDialogueBox {...props} />;
  }

  const getFirstSentence = (text: string) => {
    if (!text) return "";
    const match = text.match(/^[^.!?]+[.!?]?/);
    return match ? match[0] : text;
  };

  return (
    <motion.div className="w-full md:w-4/5 lg:w-3/5 mx-auto px-4 md:px-0">
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border border-love-200 dark:border-love-800">
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-love-900 dark:text-love-100 line-clamp-2">
                {getFirstSentence(props.currentScene.message)}
              </h2>
              {props.isTyping && (
                <span className="text-sm text-love-600 dark:text-love-300 animate-pulse whitespace-nowrap ml-2">
                  Press space to skip
                </span>
              )}
            </div>
            <div className="mt-4 bg-love-50/50 dark:bg-love-900/30 backdrop-blur-sm rounded-lg p-6 min-h-[200px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-love-200 dark:scrollbar-thumb-love-800 scrollbar-track-transparent">
              <p className="text-lg text-love-800 dark:text-love-200 leading-relaxed">
                {props.displayedText}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {!props.isTyping &&
              props.currentScene.choices?.map((choice, index) => (
                <Button
                  key={index}
                  variant={
                    props.selectedChoice === index ? "default" : "secondary"
                  }
                  className={`w-full text-base py-3 transition-all duration-200 ${
                    props.selectedChoice === index
                      ? "bg-primary hover:bg-primary-hover text-primary-foreground dark:bg-love-400 dark:hover:bg-love-500"
                      : "bg-love-100 hover:bg-love-200 text-love-900 dark:bg-love-800/80 dark:hover:bg-love-700/90 dark:text-white"
                  } ${
                    props.isReviewingPastScene
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => props.onChoiceSelect(index)}
                  disabled={
                    props.isNextSceneLoading || props.isReviewingPastScene
                  }
                >
                  {choice.text}
                </Button>
              ))}
            {props.isReviewingPastScene && (
              <p className="text-sm text-love-500 dark:text-love-300 text-center mt-2">
                This is a past scene. Go to the latest scene to make new
                choices.
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={props.onBack}
              disabled={!props.canGoBack}
              className="text-love-600 hover:text-love-700 hover:bg-love-100 dark:text-love-400 dark:hover:text-love-200 dark:hover:bg-love-800/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={props.onForward}
              disabled={!props.canGoForward}
              className="text-love-600 hover:text-love-700 hover:bg-love-100 dark:text-love-400 dark:hover:text-love-200 dark:hover:bg-love-800/50 transition-colors"
            >
              Forward
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
