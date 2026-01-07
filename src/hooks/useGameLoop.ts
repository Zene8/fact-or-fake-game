import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Post, GameState, GameStats } from '../types';
import postsData from '../data/posts.json';
import { useUserProfile } from './useUserProfile';

// Function to shuffle an array
const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Pre-process posts
let instanceIdCounter = 0;
const allPosts: Post[] = postsData.map(post => ({
  ...post,
  type: post.type as 'Verified' | 'Misinformation',
  difficulty: post.difficulty as 'easy' | 'medium' | 'hard',
  instanceId: `${post.id}-${instanceIdCounter++}`,
  classified: false,
  viralProgress: 0,
}));

const ROUND_DURATIONS = [60, 45, 30, 30]; // in seconds
const POSTS_PER_ROUND = 50;

export function useGameLoop() {
  const { score, setScore, round, setRound, username, email, highScore } = useUserProfile();
  const [gameState, setGameState] = useState<GameState>('START');
  const [posts, setPosts] = useState<Post[]>([]);
  const [timer, setTimer] = useState(ROUND_DURATIONS[0]);
  const [roundPosts, setRoundPosts] = useState<Post[]>([]);
  const [unclassifiedPosts, setUnclassifiedPosts] = useState<Post[]>([]);
  const [feedback, setFeedback] = useState<{ isOpen: boolean; reasoning: string }>({
    isOpen: false, reasoning: '',
  });

  // Use a ref to keep track of the current posts for the timer interval
  const postsRef = useRef<Post[]>(posts);
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  const currentDifficulty = useMemo(() => {
    if (round === 1) return 'easy';
    if (round === 2) return 'medium';
    return 'hard';
  }, [round]);

  const stats: GameStats = useMemo(() => ({
    correct: 0, // This will be calculated at the end of each round
    incorrect: 0, // This will be calculated at the end of each round
    score,
    tier: 0, // Tier is not used in this version
    username,
    email,
    highScore,
    round,
  }), [score, username, email, highScore, round]);

  const startRound = useCallback(() => {
    setGameState('PLAYING');
    setTimer(ROUND_DURATIONS[round - 1]);
    const filteredPosts = allPosts.filter(p => p.difficulty === currentDifficulty);
    const shuffledPosts = shuffle([...filteredPosts]);
    const currentRoundPosts = shuffledPosts.slice(0, POSTS_PER_ROUND);
    setPosts(currentRoundPosts);
    setRoundPosts(currentRoundPosts);
  }, [round, currentDifficulty]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setGameState('ROUND_OVER');
            const unclassified = roundPosts.filter(p => postsRef.current.some(up => up.instanceId === p.instanceId));
            setUnclassifiedPosts(unclassified);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, roundPosts]);

  const handleClassify = (instanceId: string, isMisinformation: boolean) => {
    const classifiedPost = posts.find(p => p.instanceId === instanceId);
    if (!classifiedPost) return;

    const correct = (classifiedPost.type === 'Misinformation') === isMisinformation;
    let basePoints = 0;

    switch (classifiedPost.difficulty) {
      case 'easy':
        basePoints = 25;
        break;
      case 'medium':
        basePoints = 50;
        break;
      case 'hard':
        basePoints = 100;
        break;
      default:
        basePoints = 50;
    }

    if (correct) {
      setScore(s => s + basePoints);
      setFeedback({ 
        isOpen: true, 
        reasoning: `✅ Correct!\n\n${classifiedPost.reasoning}` 
      });
    } else {
      setScore(s => s - basePoints);
      setFeedback({ 
        isOpen: true, 
        reasoning: `❌ Incorrect.\n\n${classifiedPost.reasoning}` 
      });
    }

    setPosts(prevPosts => prevPosts.filter(post => post.instanceId !== instanceId));
  };

  const closeFeedback = () => {
    setFeedback(prev => ({ ...prev, isOpen: false }));
  };

  const nextRound = () => {
    if (round < 4) {
      setRound(r => r + 1);
      setGameState('START');
    } else {
      setGameState('GAMEOVER');
    }
  };

  const roundDuration = ROUND_DURATIONS[round - 1];

  return { posts, score, gameState, setGameState, handleClassify, stats, round, timer, roundPosts, unclassifiedPosts, nextRound, startRound, feedback, closeFeedback, roundDuration };
}
