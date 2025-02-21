import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Key, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [currentProvider, setCurrentProvider] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const [activeProvider, setActiveProvider] = useState<string>("OPENAI");
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showDeepSeekKey, setShowDeepSeekKey] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load the active provider from localStorage
    const savedProvider = localStorage.getItem("ACTIVE_AI_PROVIDER");
    if (savedProvider) {
      setActiveProvider(savedProvider);
    } else {
      // Check which provider has an API key set
      const openaiKey = localStorage.getItem("OPENAI_API_KEY");
      const deepseekKey = localStorage.getItem("DEEPSEEK_API_KEY");

      if (openaiKey) {
        setActiveProvider("OPENAI");
        localStorage.setItem("ACTIVE_AI_PROVIDER", "OPENAI");
      } else if (deepseekKey) {
        setActiveProvider("DEEPSEEK");
        localStorage.setItem("ACTIVE_AI_PROVIDER", "DEEPSEEK");
      }
    }

    // Load saved API keys
    const openaiKey = localStorage.getItem("OPENAI_API_KEY") || "";
    const deepseekKey = localStorage.getItem("DEEPSEEK_API_KEY") || "";

    if (currentProvider === "OPENAI") {
      setApiKey(openaiKey);
    } else if (currentProvider === "DEEPSEEK") {
      setApiKey(deepseekKey);
    }
  }, [currentProvider]);

  const handleSwitchProvider = (provider: string) => {
    // Check if the provider has an API key set
    const hasKey = localStorage.getItem(`${provider}_API_KEY`);
    if (!hasKey) {
      toast({
        title: "API Key Required",
        description: `Please set an API key for ${provider} before switching to it.`,
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("ACTIVE_AI_PROVIDER", provider);
    setActiveProvider(provider);
    toast({
      title: "Provider Switched",
      description: `Now using ${provider} as the active AI provider.`,
    });
  };

  const handleSaveKey = (provider: string) => {
    if (apiKey.trim()) {
      localStorage.setItem(`${provider}_API_KEY`, apiKey.trim());
      localStorage.setItem("ACTIVE_AI_PROVIDER", provider);
      setActiveProvider(provider);
      toast({
        title: "API Key Updated",
        description: `Your ${provider} API key has been saved and set as active.`,
      });
    } else {
      localStorage.removeItem(`${provider}_API_KEY`);
      toast({
        title: "API Key Removed",
        description: `Your ${provider} API key has been removed.`,
      });

      // If removing the active provider, switch to the other one if available
      if (provider === activeProvider) {
        const otherProvider = provider === "OPENAI" ? "DEEPSEEK" : "OPENAI";
        if (localStorage.getItem(`${otherProvider}_API_KEY`)) {
          setActiveProvider(otherProvider);
          localStorage.setItem("ACTIVE_AI_PROVIDER", otherProvider);
        }
      }
    }
    setApiKey("");
    setCurrentProvider("");
  };

  const handleProviderInputChange = (provider: string, value: string) => {
    setApiKey(value);
    setCurrentProvider(provider);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-love-800 dark:text-love-200">
          Settings
        </h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-love-200 dark:border-love-800 text-love-800 dark:text-love-200"
        >
          Back
        </Button>
      </div>

      <Card className="mb-6 bg-white dark:bg-slate-900 border-love-200 dark:border-love-800">
        <CardHeader>
          <CardTitle className="text-love-800 dark:text-love-200">
            Active AI Provider
          </CardTitle>
          <CardDescription>Currently using: {activeProvider}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={() => handleSwitchProvider("OPENAI")}
              variant={activeProvider === "OPENAI" ? "default" : "outline"}
              className={
                activeProvider === "OPENAI"
                  ? "bg-love-500 hover:bg-love-600 text-white flex-1"
                  : "border-love-200 dark:border-love-800 text-love-800 dark:text-love-200 flex-1"
              }
              disabled={!localStorage.getItem("OPENAI_API_KEY")}
            >
              Switch to OpenAI
            </Button>
            <Button
              onClick={() => handleSwitchProvider("DEEPSEEK")}
              variant={activeProvider === "DEEPSEEK" ? "default" : "outline"}
              className={
                activeProvider === "DEEPSEEK"
                  ? "bg-love-500 hover:bg-love-600 text-white flex-1"
                  : "border-love-200 dark:border-love-800 text-love-800 dark:text-love-200 flex-1"
              }
              disabled={!localStorage.getItem("DEEPSEEK_API_KEY")}
            >
              Switch to DeepSeek
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-white dark:bg-slate-900 border-love-200 dark:border-love-800">
        <CardHeader>
          <CardTitle className="text-love-800 dark:text-love-200">
            OpenAI Settings
          </CardTitle>
          <CardDescription>Configure your OpenAI API key</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                type={showOpenAIKey ? "text" : "password"}
                placeholder="Enter OpenAI API key"
                value={
                  currentProvider === "OPENAI"
                    ? apiKey
                    : localStorage.getItem("OPENAI_API_KEY") || ""
                }
                onChange={(e) =>
                  handleProviderInputChange("OPENAI", e.target.value)
                }
                className="flex-1 bg-love-50 dark:bg-love-900 border-love-200 dark:border-love-800 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowOpenAIKey(!showOpenAIKey)}
              >
                {showOpenAIKey ? (
                  <EyeOff className="h-4 w-4 text-love-600" />
                ) : (
                  <Eye className="h-4 w-4 text-love-600" />
                )}
              </Button>
            </div>
            <Button
              onClick={() => handleSaveKey("OPENAI")}
              className="bg-love-500 hover:bg-love-600 text-white"
            >
              <Key className="mr-2 h-4 w-4" />
              Save Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900 border-love-200 dark:border-love-800">
        <CardHeader>
          <CardTitle className="text-love-800 dark:text-love-200">
            DeepSeek Settings
          </CardTitle>
          <CardDescription>Configure your DeepSeek API key</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                type={showDeepSeekKey ? "text" : "password"}
                placeholder="Enter DeepSeek API key"
                value={
                  currentProvider === "DEEPSEEK"
                    ? apiKey
                    : localStorage.getItem("DEEPSEEK_API_KEY") || ""
                }
                onChange={(e) =>
                  handleProviderInputChange("DEEPSEEK", e.target.value)
                }
                className="flex-1 bg-love-50 dark:bg-love-900 border-love-200 dark:border-love-800 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowDeepSeekKey(!showDeepSeekKey)}
              >
                {showDeepSeekKey ? (
                  <EyeOff className="h-4 w-4 text-love-600" />
                ) : (
                  <Eye className="h-4 w-4 text-love-600" />
                )}
              </Button>
            </div>
            <Button
              onClick={() => handleSaveKey("DEEPSEEK")}
              className="bg-love-500 hover:bg-love-600 text-white"
            >
              <Key className="mr-2 h-4 w-4" />
              Save Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
