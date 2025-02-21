export interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  background?: string;
  expressions?: {
    happy: string;
    flirty: string;
    thoughtful: string;
    surprised: string;
    sad: string;
  };
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  relationshipImpact?: number;
}

export interface Scene {
  id: string;
  message: string;
  choices: Choice[];
  imageURL?: string;
  mood?: 'happy' | 'flirty' | 'thoughtful' | 'surprised' | 'sad';
  music?: string;
}

export const characters: Character[] = [
  {
    id: "aria",
    name: "Aria",
    avatar: "https://im.runware.ai/image/ii/19e11dea-5d83-43c8-a43b-460b6636e0fb.WEBP",
    personality: "Playful and flirtatious, yet intellectual and deep",
    background: "A literature professor with a passion for poetry and romance",
    expressions: {
      happy: "https://im.runware.ai/image/ii/19e11dea-5d83-43c8-a43b-460b6636e0fb.WEBP",
      flirty: "https://im.runware.ai/image/ii/ff928944-142c-4433-9f58-2897f8ac10cf.WEBP",
      thoughtful: "https://im.runware.ai/image/ii/3d599a2f-5063-4f95-8a14-83cea8e9c507.WEBP",
      surprised: "https://im.runware.ai/image/ii/a7c2433b-86ea-43c4-827d-428501d09786.WEBP",
      sad: "https://im.runware.ai/image/ii/ffc8388b-0981-45e4-ad36-0a40dd88c55b.WEBP"
    }
  },
  {
    id: "luna",
    name: "Luna",
    avatar: "https://im.runware.ai/image/ii/b7662c98-dd8b-4d32-aa1e-ae10842248fb.WEBP",
    personality: "Mysterious and ethereal, with a gentle soul",
    background: "An artist who finds beauty in the night sky",
    expressions: {
      happy: "https://im.runware.ai/image/ii/b7662c98-dd8b-4d32-aa1e-ae10842248fb.WEBP",
      flirty: "https://im.runware.ai/image/ii/ff928944-142c-4433-9f58-2897f8ac10cf.WEBP",
      thoughtful: "https://im.runware.ai/image/ii/3d599a2f-5063-4f95-8a14-83cea8e9c507.WEBP",
      surprised: "https://im.runware.ai/image/ii/a7c2433b-86ea-43c4-827d-428501d09786.WEBP",
      sad: "https://im.runware.ai/image/ii/ffc8388b-0981-45e4-ad36-0a40dd88c55b.WEBP"
    }
  },
  {
    id: "jade",
    name: "Jade",
    avatar: "https://im.runware.ai/image/ii/bc1e653b-633d-484a-942c-a634eb0b705f.WEBP",
    personality: "Confident and adventurous, with a warm heart",
    background: "A travel photographer who loves exploring new cultures",
    expressions: {
      happy: "https://im.runware.ai/image/ii/bc1e653b-633d-484a-942c-a634eb0b705f.WEBP",
      flirty: "https://im.runware.ai/image/ii/ff928944-142c-4433-9f58-2897f8ac10cf.WEBP",
      thoughtful: "https://im.runware.ai/image/ii/3d599a2f-5063-4f95-8a14-83cea8e9c507.WEBP",
      surprised: "https://im.runware.ai/image/ii/a7c2433b-86ea-43c4-827d-428501d09786.WEBP",
      sad: "https://im.runware.ai/image/ii/ffc8388b-0981-45e4-ad36-0a40dd88c55b.WEBP"
    }
  }
];

export const scenes: { [key: string]: Scene } = {
  intro: {
    id: "intro",
    message: "Hi! I'm Aria. What brings you here today?",
    imageURL: "photo-1649972904349-6e44c42644a7",
    mood: "happy",
    music: "/music/intro.mp3",
    choices: [
      {
        id: "1",
        text: "I'd like to get to know you",
        nextSceneId: "interests",
        relationshipImpact: 2
      },
      {
        id: "2",
        text: "Your profile caught my eye",
        nextSceneId: "profile",
        relationshipImpact: 1
      },
      {
        id: "3",
        text: "Just browsing around",
        nextSceneId: "casual",
        relationshipImpact: 0
      }
    ]
  },
  interests: {
    id: "interests",
    message: "I love having interesting conversations. What would you like to talk about?",
    mood: "flirty",
    imageURL: "photo-1581091226825-a6a2a5aee158",
    music: "/music/romantic.mp3",
    choices: [
      {
        id: "4",
        text: "Philosophy and deep topics",
        nextSceneId: "philosophy",
        relationshipImpact: 3
      },
      {
        id: "5",
        text: "Art and culture",
        nextSceneId: "arts",
        relationshipImpact: 2
      },
      {
        id: "6",
        text: "Light and fun topics",
        nextSceneId: "casual_chat",
        relationshipImpact: 1
      }
    ]
  },
  profile: {
    id: "profile",
    message: "Oh? *smiles* What caught your attention?",
    imageURL: "photo-1582562124811-c09040d0a901",
    mood: "flirty",
    music: "/music/flirty.mp3",
    choices: [
      {
        id: "7",
        text: "Your intelligence",
        nextSceneId: "intellectual",
        relationshipImpact: 3
      },
      {
        id: "8",
        text: "Your friendly personality",
        nextSceneId: "friendly",
        relationshipImpact: 2
      },
      {
        id: "9",
        text: "Just a feeling",
        nextSceneId: "chemistry",
        relationshipImpact: 1
      }
    ]
  },
  casual: {
    id: "casual",
    message: "That's cool. How do you usually like to get to know someone?",
    imageURL: "photo-1535268647677-300dbf3d78d1",
    mood: "thoughtful",
    music: "/music/casual.mp3",
    choices: [
      {
        id: "10",
        text: "Through conversations",
        nextSceneId: "deep_talk",
        relationshipImpact: 2
      },
      {
        id: "11",
        text: "Shared activities",
        nextSceneId: "activities",
        relationshipImpact: 2
      },
      {
        id: "12",
        text: "Taking it slow",
        nextSceneId: "slow_pace",
        relationshipImpact: 1
      }
    ]
  },
  intellectual: {
    id: "intellectual",
    message: "Intelligence is attractive. What interests you most about the mind?",
    imageURL: "photo-1581091226825-a6a2a5aee158",
    mood: "thoughtful",
    music: "/music/deep.mp3",
    choices: [
      {
        id: "13",
        text: "How thoughts work",
        nextSceneId: "science_mind",
        relationshipImpact: 3
      },
      {
        id: "14",
        text: "The mysteries of consciousness",
        nextSceneId: "spiritual_mind",
        relationshipImpact: 2
      },
      {
        id: "15",
        text: "I prefer simpler topics",
        nextSceneId: "practical_mind",
        relationshipImpact: 1
      }
    ]
  },
  arts: {
    id: "arts",
    message: "I love art! What's your favorite type? *eyes light up with interest*",
    imageURL: "photo-1649972904349-6e44c42644a7",
    mood: "happy",
    music: "/music/artistic.mp3",
    choices: [
      {
        id: "16",
        text: "Visual arts",
        nextSceneId: "visual_arts",
        relationshipImpact: 2
      },
      {
        id: "17",
        text: "Music",
        nextSceneId: "performing_arts",
        relationshipImpact: 2
      },
      {
        id: "18",
        text: "Literature",
        nextSceneId: "literature",
        relationshipImpact: 3
      }
    ]
  }
};

export const generateInitialScene = (character: Character): Scene => ({
  id: "initial",
  message: `Hi! I'm ${character.name}. It's nice to meet you!`,
  choices: [
    {
      id: "greet",
      text: "Nice to meet you too!",
      nextSceneId: "next",
      relationshipImpact: 1
    },
    {
      id: "casual",
      text: "Hey there!",
      nextSceneId: "next",
      relationshipImpact: 0
    }
  ],
  mood: "happy"
});
