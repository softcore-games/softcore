export interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  nftAddress?: string;
}

export interface GameScene {
  id: string;
  background: string;
  character?: Character;
  text: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  nextScene: string;
  requiresToken?: boolean;
  tokenCost?: number;
}

export interface GameState {
  currentScene: string;
  inventory: string[];
  relationships: Record<string, number>;
  choices: string[];
}