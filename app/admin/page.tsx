'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ScenesList } from '@/components/admin/ScenesList';
import { CharactersList } from '@/components/admin/CharactersList';
import { AssetsList } from '@/components/admin/AssetsList';
import { FileText, Users, Image } from 'lucide-react';

interface Scene {
  id: string;
  sceneId: string;
  character: string;
  emotion: string;
  text: string;
  next?: string;
  choices?: { text: string; next: string }[];
  context?: string;
  requiresAI: boolean;
  background?: string;
  type: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface Character {
  id: string;
  characterId: string;
  name: string;
  personality: string;
  background: string;
  traits: string[];
  relationships?: Record<string, any>;
  emotions: Record<string, string>;
  images: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface Asset {
  id: string;
  type: 'background' | 'character';
  name: string;
  url: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assetFilter, setAssetFilter] = useState<'all' | 'background' | 'character'>('all');

  useEffect(() => {
    fetchData();
  }, [assetFilter]);

  const fetchData = async () => {
    try {
      // Fetch scenes
      const scenesResponse = await fetch('/api/admin/scenes');
      if (scenesResponse.ok) {
        const data = await scenesResponse.json();
        setScenes(data.scenes);
      }

      // Fetch characters
      const charactersResponse = await fetch('/api/admin/characters');
      if (charactersResponse.ok) {
        const data = await charactersResponse.json();
        setCharacters(data.characters);
      }

      // Fetch assets
      const assetUrl = assetFilter === 'all' 
        ? '/api/admin/assets'
        : `/api/admin/assets?type=${assetFilter}`;
      const assetsResponse = await fetch(assetUrl);
      if (assetsResponse.ok) {
        const data = await assetsResponse.json();
        setAssets(data.assets);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (type: 'scenes' | 'characters') => {
    const data = type === 'scenes' ? scenes : characters;
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${type}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>, type: 'scenes' | 'characters') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);

      const response = await fetch(`/api/admin/${type}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `${type} imported successfully`,
        });
        fetchData();
      } else {
        toast({
          title: 'Error',
          description: `Failed to import ${type}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid file format',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse text-xl text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
          Admin Dashboard
        </h1>

        <Tabs defaultValue="scenes" className="space-y-6">
          <TabsList className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-1">
            <TabsTrigger 
              value="scenes" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:border-blue-500/50 data-[state=active]:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2">
                <FileText className="w-4 h-4" />
                <span>Scenes</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-700 rounded-full">
                  {scenes.length}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="characters"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:border-blue-500/50 data-[state=active]:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2">
                <Users className="w-4 h-4" />
                <span>Characters</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-700 rounded-full">
                  {characters.length}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="assets"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:border-blue-500/50 data-[state=active]:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2">
                <Image className="w-4 h-4" />
                <span>Assets</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-700 rounded-full">
                  {assets.length}
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scenes">
            <ScenesList
              scenes={scenes}
              onExport={() => handleExport('scenes')}
              onImport={(e) => handleImport(e, 'scenes')}
            />
          </TabsContent>

          <TabsContent value="characters">
            <CharactersList
              characters={characters}
              onExport={() => handleExport('characters')}
              onImport={(e) => handleImport(e, 'characters')}
            />
          </TabsContent>

          <TabsContent value="assets">
            <AssetsList
              assets={assets}
              filter={assetFilter}
              onFilterChange={setAssetFilter}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}