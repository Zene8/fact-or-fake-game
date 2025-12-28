export type GameState = 'START' | 'PLAYING' | 'GAMEOVER';

export interface User {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  isNewsOrg?: boolean;
}

export interface Post {
  id: number;
  instanceId: string; // New field for unique instance identification
  username: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'Verified' | 'Misinformation';
  reasoning: string;
  viralProgress: number; 
  classified?: boolean;
  difficulty: 'easy' | 'medium' | 'hard'; // Added difficulty field
}

export interface GameStats {
  correct: number;
  incorrect: number;
  score: number;
  tier: number;
  username: string; // New field
  email: string;    // New field
  highScore: number; // New field
}