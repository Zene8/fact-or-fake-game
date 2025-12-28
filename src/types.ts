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
}