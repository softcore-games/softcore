import React from 'react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';

export default function SettingsPage() {
  const { settings, updateSettings } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8">Game Settings</h1>

        <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Audio</h2>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Volume</label>
              <div className="w-64">
                <Slider
                  value={[settings.volume]}
                  onValueChange={([value]) => updateSettings({ volume: value })}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Text</h2>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Text Speed</label>
              <Select
                value={settings.textSpeed}
                onValueChange={(value) =>
                  updateSettings({
                    textSpeed: value as 'slow' | 'normal' | 'fast',
                  })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-play</label>
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(checked) =>
                  updateSettings({ autoplay: checked })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              // Reset to defaults
              updateSettings({
                volume: 100,
                textSpeed: 'normal',
                autoplay: false,
              });
            }}
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={() => {
              // Save settings
              // This is handled automatically by Zustand persist
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}