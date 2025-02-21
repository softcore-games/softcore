import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { characters, scenes, type Scene } from "@/data/gameData";

const defaultCharacter = characters[0];

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  imageURL?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: scenes.intro.message,
      sender: "ai",
      timestamp: new Date(),
      imageURL: scenes.intro.imageURL,
    },
  ]);

  const [currentScene, setCurrentScene] = useState<Scene>(scenes.intro);
  const [input, setInput] = useState("");
  const [relationshipLevel, setRelationshipLevel] = useState(0);

  const handleAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch("http://localhost:54321/functions/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            personality: defaultCharacter.personality,
            relationshipLevel,
          },
        }),
      });

      const data = await response.json();
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    }
  };

  const handleChoice = async (
    choiceText: string,
    impact: number = 0,
    nextSceneId: string
  ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: choiceText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setRelationshipLevel((prev) => prev + impact);

    const nextScene = scenes[nextSceneId];
    if (nextScene) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: nextScene.message,
        sender: "ai",
        timestamp: new Date(),
        imageURL: nextScene.imageURL,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setCurrentScene(nextScene);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    await handleAIResponse(input);
  };

  return (
    <div className="flex flex-col h-screen bg-love-50">
      <header className="p-4 bg-white border-b border-love-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-10 h-10">
            <img
              src={defaultCharacter.avatar}
              alt={defaultCharacter.name}
              className="rounded-full"
            />
          </Avatar>
          <div>
            <h2 className="font-display text-xl text-love-800">
              {defaultCharacter.name}
            </h2>
            <p className="text-sm text-love-600">
              Connection Level: {relationshipLevel}
            </p>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-white"
                }`}
              >
                {message.imageURL && (
                  <img
                    src={message.imageURL}
                    alt="Scene"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <p>{message.text}</p>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 bg-white border-t border-love-100">
        <div className="mb-4 flex flex-wrap gap-2">
          {currentScene.choices.map((choice) => (
            <Button
              key={choice.id}
              variant="outline"
              className="bg-love-50 hover:bg-love-100 text-love-700"
              onClick={() => {
                handleChoice(
                  choice.text,
                  choice.relationshipImpact,
                  choice.nextSceneId
                );
              }}
            >
              {choice.text}
            </Button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
