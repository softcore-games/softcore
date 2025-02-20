"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGameStore } from "@/store/gameStore";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw, Volume2, Clock, Play, Zap } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

export default function SettingsPage() {
  const { settings, updateSettings, stamina, fetchStamina } = useGameStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchStamina();
  }, [fetchStamina]);

  const handleSave = () => {
    // Settings are automatically persisted by Zustand
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleReset = () => {
    updateSettings({
      volume: 100,
      textSpeed: "normal",
      autoplay: false,
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Game Settings
          </h1>
          <p className="text-gray-400">Customize your gameplay experience</p>
        </div>

        <div className="space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700 shadow-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xl font-semibold text-blue-400">
              <Zap className="w-5 h-5" />
              <h2>Stamina</h2>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Stamina</span>
                <span className="text-sm font-medium">
                  {stamina.subscription === "UNLIMITED"
                    ? "∞"
                    : `${stamina.current}/${stamina.max}`}
                </span>
              </div>
              <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    stamina.subscription === "UNLIMITED"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 w-full"
                      : `bg-gradient-to-r from-blue-500 to-purple-500 ${
                          typeof stamina.max === "number"
                            ? `w-[${(stamina.current / stamina.max) * 100}%]`
                            : "w-full"
                        }`
                  }`}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Subscription: {stamina.subscription}</span>
                <span>Resets daily</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xl font-semibold text-blue-400">
              <Volume2 className="w-5 h-5" />
              <h2>Audio</h2>
            </div>
            <div className="flex items-center gap-8 bg-gray-700/50 p-4 rounded-lg">
              <label className="text-sm font-medium min-w-[80px]">Volume</label>
              <div className="flex-1 flex items-center gap-4">
                <Slider
                  value={[settings.volume]}
                  onValueChange={([value]) => updateSettings({ volume: value })}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {settings.volume}%
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xl font-semibold text-blue-400">
              <Clock className="w-5 h-5" />
              <h2>Text</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-8 bg-gray-700/50 p-4 rounded-lg">
                <div className="space-y-1 min-w-[80px]">
                  <label className="text-sm font-medium">Text Speed</label>
                </div>
                <Select
                  value={settings.textSpeed}
                  onValueChange={(value) =>
                    updateSettings({
                      textSpeed: value as "slow" | "normal" | "fast",
                    })
                  }
                >
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-600 focus:ring-blue-400 focus:ring-offset-gray-900">
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem
                      value="slow"
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      Slow
                    </SelectItem>
                    <SelectItem
                      value="normal"
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      Normal
                    </SelectItem>
                    <SelectItem
                      value="fast"
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      Fast
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-400" />
                    <label className="text-sm font-medium">Auto-play</label>
                  </div>
                  <p className="text-xs text-gray-400">
                    Automatically advance dialogue
                  </p>
                </div>
                <Switch
                  checked={settings.autoplay}
                  onCheckedChange={(checked) =>
                    updateSettings({ autoplay: checked })
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-end gap-4">
          <GradientButton
            variant="settings"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </GradientButton>
          <GradientButton variant="play" onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </GradientButton>
        </div>
      </motion.div>
    </div>
  );
}
