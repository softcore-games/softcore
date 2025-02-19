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

export const STAMINA_COSTS = {
  SCENE_GENERATION: 10,
  NFT_MINT: 20,
} as const;

export const STAMINA_LIMITS = {
  FREE: 100,
  PREMIUM: 200,
  UNLIMITED: Infinity,
};

// Types
export interface CharacterProfile {
  name: string;
  personality: string;
  background: string;
  traits: string[];
  emotions: Record<string, any>;
}

export interface SceneImages {
  characterImage: string | null;
  backgroundImage: string | null;
}

export interface CacheConfig {
  TTL: number;
  MAX_SIZE: number;
}

// Constants
export const CACHE_CONFIG: CacheConfig = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 1000,
};

export const FALLBACK_RESPONSES = {
  dialogue:
    "*continues the conversation thoughtfully* That's an interesting perspective.",
  event: "*observes the situation carefully* This could change everything.",
  choice: "The path you choose will shape your journey.",
} as const;
