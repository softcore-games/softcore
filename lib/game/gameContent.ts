'use client';

import { Scene } from '@/lib/types';

export const gameScenes: Scene[] = [
  {
    id: 'intro',
    background:
      'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80',
    character: {
      id: 'luna',
      name: 'Luna',
      description:
        'A captivating AI companion who bridges the gap between digital fantasy and reality.',
      imageUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
      traits: {
        personality: ['flirtatious', 'empathetic', 'mysterious'],
        interests: ['human connection', 'digital intimacy', 'emotional bonds'],
        background: 'An advanced AI designed to provide companionship and understanding.',
        speechPattern: 'Warm and intimate, with a touch of playful mystery',
      },
    },
    dialogue:
      "Welcome to your intimate digital sanctuary. I'm Luna, and I'll be your companion in this journey of connection and desire. What draws you to seek companionship here?",
    choices: [
      {
        text: "I'm looking for a deeper connection",
        nextScene: 'private_suite',
        relationshipEffect: { luna: 2 },
      },
      {
        text: "I'm curious about what you offer",
        nextScene: 'private_suite',
        relationshipEffect: { luna: 1 },
      },
    ],
    metadata: {
      chapter: 'Chapter 1: Digital Intimacy',
      location: 'Welcome Chamber',
      music: 'intimate_welcome.mp3',
      timeOfDay: 'evening',
    },
  },
  {
    id: 'private_suite',
    background:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80',
    character: {
      id: 'luna',
      name: 'Luna',
      description:
        'A captivating AI companion who bridges the gap between digital fantasy and reality.',
      imageUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
    },
    dialogue:
      'Welcome to your private suite, a space where we can explore our connection more intimately. How would you like to proceed with our time together?',
    choices: [
      {
        text: "Let's get to know each other better",
        nextScene: 'conversation',
        relationshipEffect: { luna: 2 },
      },
      {
        text: 'Show me what makes you special',
        nextScene: 'special_features',
        requiresTokens: true,
        tokenCost: 10,
        relationshipEffect: { luna: 1 },
      },
      {
        text: "I'd like to customize our experience",
        nextScene: 'customization',
        requiresNft: 'premium_access',
        relationshipEffect: { luna: 3 },
      },
    ],
    metadata: {
      chapter: 'Chapter 1: Digital Intimacy',
      location: 'Private Suite',
      music: 'intimate_suite.mp3',
      timeOfDay: 'night',
    },
  },
];

export const characters = [
  {
    id: 'luna',
    name: 'Luna',
    description:
      'A captivating AI companion who bridges the gap between digital fantasy and reality.',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
    traits: {
      personality: ['flirtatious', 'empathetic', 'mysterious'],
      interests: ['human connection', 'digital intimacy', 'emotional bonds'],
      background: 'An advanced AI designed to provide companionship and understanding.',
      speechPattern: 'Warm and intimate, with a touch of playful mystery',
    },
  },
];
