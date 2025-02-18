'use client';

import { SceneMintTest } from '@/components/SceneMintTest';

// Test scene data
const testScene = {
  id: '1',
  sceneId: 'test_scene_1',
  character: 'mei',
  emotion: 'happy',
  text: '*smiles warmly* Welcome to our first test scene! Let\'s create something special together.',
  background: 'classroom',
};

export default function TestMintPage() {
  return <SceneMintTest scene={testScene} />;
}