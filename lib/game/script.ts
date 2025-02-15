import { z } from 'zod';

export const SceneType = z.object({
  id: z.string(),
  character: z.string(),
  emotion: z.string(),
  text: z.string(),
  next: z.string().optional(),
  choices: z.array(z.object({
    text: z.string(),
    next: z.string(),
  })).optional(),
  context: z.string().optional(),
  requiresAI: z.boolean().optional(),
  background: z.string().optional(),
  codeChallenge: z.object({
    code: z.string(),
    task: z.string(),
    solution: z.string(),
  }).optional(),
});

export type Scene = z.infer<typeof SceneType>;

export const gameScript: Scene[] = [
  {
    id: 'intro',
    character: 'mei',
    emotion: 'happy',
    background: 'classroom',
    text: 'Welcome to Softcore! I\'m Mei, and I\'ll be your programming mentor.',
    next: 'intro-2',
    context: 'Initial greeting from Mei, the mentor character.',
  },
  {
    id: 'intro-2',
    character: 'mei',
    emotion: 'curious',
    background: 'classroom',
    text: 'Before we dive into coding, I\'d love to know more about you. What interests you about programming?',
    requiresAI: true,
    choices: [
      {
        text: 'I want to build websites and apps!',
        next: 'web-dev',
      },
      {
        text: 'I\'m interested in AI and machine learning.',
        next: 'ai-ml',
      },
      {
        text: 'I want to make games!',
        next: 'game-dev',
      },
    ],
  },
  {
    id: 'web-dev',
    character: 'mei',
    emotion: 'excited',
    background: 'office',
    requiresAI: true,
    text: '[AI Response based on web development interest]',
    context: 'Student expressed interest in web development. Mei should be encouraging and mention HTML, CSS, and JavaScript basics.',
    next: 'first-lesson',
  },
  {
    id: 'ai-ml',
    character: 'mei',
    emotion: 'thoughtful',
    background: 'lab',
    requiresAI: true,
    text: '[AI Response based on AI/ML interest]',
    context: 'Student expressed interest in AI/ML. Mei should mention Python and basic math concepts.',
    next: 'first-lesson',
  },
  {
    id: 'game-dev',
    character: 'mei',
    emotion: 'excited',
    background: 'gaming_room',
    requiresAI: true,
    text: '[AI Response based on game development interest]',
    context: 'Student expressed interest in game development. Mei should mention game engines and programming basics.',
    next: 'first-lesson',
  },
  {
    id: 'first-lesson',
    character: 'mei',
    emotion: 'teaching',
    background: 'classroom',
    text: 'Let\'s start with something fundamental to all programming: variables!',
    next: 'variable-intro',
  },
  {
    id: 'variable-intro',
    character: 'mei',
    emotion: 'teaching',
    background: 'classroom',
    requiresAI: true,
    text: '[AI Response explaining variables]',
    context: 'Teaching about variables in programming. Use a simple, real-world analogy.',
    codeChallenge: {
      code: 'let message = "Hello, World!";',
      task: 'Try changing the message variable to store your name instead.',
      solution: 'let message = "YourName";',
    },
    choices: [
      {
        text: 'That makes sense! Can you give me an example?',
        next: 'variable-example',
      },
      {
        text: 'I\'m a bit confused. Can you explain it differently?',
        next: 'variable-alternative',
      },
    ],
  },
  {
    id: 'variable-example',
    character: 'mei',
    emotion: 'happy',
    requiresAI: true,
    text: '[AI Response with variable example]',
    context: 'Provide a practical example of using variables in code, using the student\'s expressed interest area.',
    next: 'variable-practice',
  },
  {
    id: 'variable-alternative',
    character: 'mei',
    emotion: 'happy',
    requiresAI: true,
    text: '[AI Response with alternative explanation]',
    context: 'Provide an alternative explanation of variables using different analogies and simpler terms.',
    next: 'variable-practice',
  },
  {
    id: 'variable-practice',
    character: 'mei',
    emotion: 'happy',
    requiresAI: true,
    text: '[AI Response with practice question]',
    context: 'Present a simple coding challenge involving variables, tailored to the student\'s interest area.',
    choices: [
      {
        text: 'I\'ll try it!',
        next: 'practice-feedback',
      },
      {
        text: 'Can we review variables one more time?',
        next: 'variable-review',
      },
    ],
  },
  {
    id: 'functions-intro',
    character: 'mei',
    emotion: 'teaching',
    background: 'classroom',
    requiresAI: true,
    text: '[AI Response introducing functions]',
    context: 'Introducing the concept of functions as reusable blocks of code.',
    codeChallenge: {
      code: `function greet(name) {
  return "Hello, " + name + "!";
}`,
      task: 'Try calling the greet function with your name.',
      solution: 'greet("YourName");',
    },
    choices: [
      {
        text: 'Can you show me more examples?',
        next: 'function-examples',
      },
      {
        text: 'Let\'s practice writing functions!',
        next: 'function-practice',
      },
    ],
  },
  {
    id: 'function-examples',
    character: 'mei',
    emotion: 'excited',
    background: 'office',
    requiresAI: true,
    text: '[AI Response with function examples]',
    context: 'Show practical examples of functions in real-world programming scenarios.',
    next: 'function-practice',
  },
  {
    id: 'function-practice',
    character: 'mei',
    emotion: 'encouraging',
    background: 'classroom',
    requiresAI: true,
    text: '[AI Response with function challenge]',
    context: 'Present a coding challenge involving functions.',
    codeChallenge: {
      code: `// Write a function that adds two numbers
function add(a, b) {
  // Your code here
}`,
      task: 'Complete the add function to return the sum of a and b.',
      solution: `function add(a, b) {
  return a + b;
}`,
    },
    choices: [
      {
        text: 'I\'ve completed the challenge!',
        next: 'function-success',
      },
      {
        text: 'I need a hint.',
        next: 'function-hint',
      },
    ],
  },
];