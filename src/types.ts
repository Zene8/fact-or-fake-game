export type GameState = 'WELCOME' | 'START' | 'PLAYING' | 'ROUND_OVER' | 'GAMEOVER';

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
  username:string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'Verified' | 'Misinformation';
  reasoning: string;
  viralProgress?: number; 
  classified?: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'; // Added difficulty field
  media?: string[];
}

export interface GameStats {
  correct: number;
  incorrect: number;
  score: number;
  commentScore: number;
  phishingScore: number;
  tier: number;
  username: string;
  pfp: string;
  email: string;
  highScore: number;
  round: number;
}

export interface Comment {
  id: number;
  user: string;
  handle: string;
  text: string;
  isFake: boolean;
  reasoning: string;
  likes: number;
  replies: number;
}

export interface CommentThread {
  id: number;
  title: string;
  topic: string;
  comments: Comment[];
}