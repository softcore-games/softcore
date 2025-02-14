export interface GameState {
  currentScene: string;
  inventory: string[];
  relationships: Record<string, number>;
  choices: string[];
  nfts: string[];
  isPremium: boolean;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  nftAddress?: string;
}

export interface Scene {
  id: string;
  background: string;
  character?: Character;
  dialogue: string;
  choices: Choice[];
  requirements?: Requirements;
}

export interface Choice {
  text: string;
  nextScene: string;
  requiresTokens?: boolean;
  tokenCost?: number;
  requiresNft?: string;
  relationshipEffect?: Record<string, number>;
}

export interface Requirements {
  nft?: string;
  tokens?: number;
  relationship?: Record<string, number>;
}