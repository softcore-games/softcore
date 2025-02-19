export interface Scene {
  id: string;
  sceneId: string;
  character: string;
  emotion: string;
  text: string;
  next: string | null;
  choices: any;
  context: string | null;
  requiresAI: boolean;
  background: string | null;
  characterImage: string | null;
  backgroundImage: string | null;
  type: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameState {
  scenes: Scene[];
  currentScene: Scene | null;
  isLoading: boolean;
  displayText: string;
  isDialogueComplete: boolean;
}

export interface SceneResponse {
  scene: Scene;
  images: {
    character: string | null;
    background: string | null;
  };
}
