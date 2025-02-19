"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CharactersList } from "@/components/admin/CharactersList";
import { Users } from "lucide-react";
import { Character } from "@/lib/types/game";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const charactersResponse = await fetch("/api/admin/characters");
      if (charactersResponse.ok) {
        const data = await charactersResponse.json();
        setCharacters(data.characters);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (type: "characters") => {
    const data = characters;
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${type}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "scenes" | "characters"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);

      const response = await fetch(`/api/admin/${type}/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type} imported successfully`,
        });
        fetchData();
      } else {
        toast({
          title: "Error",
          description: `Failed to import ${type}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid file format",
        variant: "destructive",
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
          </TabsList>
          <TabsContent value="characters">
            <CharactersList
              characters={characters}
              onExport={() => handleExport("characters")}
              onImport={(e) => handleImport(e, "characters")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
