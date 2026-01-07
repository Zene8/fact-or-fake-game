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
  difficulty: post.difficulty as 'easy' | 'medium' | 'hard' | 'impossible',
  instanceId: `${post.id}-${instanceIdCounter++}`,
  classified: false,
  viralProgress: 0,
}));

const ROUND_DURATIONS = [60, 45, 30, 30]; // in seconds
const POSTS_PER_ROUND = 50;

export function useGameLoop() {
  const { 
    feedScore: score, 
    setFeedScore: setScore, 
    commentScore,
    phishingScore,
    round, 
    setRound, 
    username, 
    email, 
    highScore, 
    playingStreak, 
    incrementStreak, 
    resetStreak, 
    pfp 
  } = useUserProfile();
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [posts, setPosts] = useState<Post[]>([]);
  const [timer, setTimer] = useState(ROUND_DURATIONS[0]);
  const [roundPosts, setRoundPosts] = useState<Post[]>([]);
  const [unclassifiedPosts, setUnclassifiedPosts] = useState<Post[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [userPosts, setUserPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('factOrFake_userPosts');
    return saved ? JSON.parse(saved) : [];
  });
  const [feedback, setFeedback] = useState<{ isOpen: boolean; reasoning: string }>({
    isOpen: false, reasoning: '',
  });

  // Persist user posts
  useEffect(() => {
    localStorage.setItem('factOrFake_userPosts', JSON.stringify(userPosts));
  }, [userPosts]);

  const addUserPost = (content: string, type: 'Verified' | 'Misinformation') => {
    const newPost: Post = {
      id: Date.now(),
      instanceId: `user-${Date.now()}`,
      username: username,
      handle: username.toLowerCase().replace(/\s/g, ''),
      avatar: pfp,
      content,
      type,
      difficulty: 'easy',
      timestamp: new Date().toISOString(),
      reasoning: "User-generated post contributed to the community database.",
      classified: false
    };
    setUserPosts(prev => [newPost, ...prev]);
  };

  // Use a ref to keep track of the current posts for the timer interval
  const postsRef = useRef<Post[]>(posts);
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  const currentDifficulty = useMemo(() => {
    if (round === 1) return 'easy';
    if (round === 2) return 'medium';
    if (round === 3) return 'hard';
    return 'impossible';
  }, [round]);

  const stats: GameStats = useMemo(() => ({
    correct: correctCount,
    incorrect: 0, // Simplified for now
    score,
    commentScore,
    phishingScore,
    tier: 0, 
    username,
    pfp,
    email,
    highScore,
    round,
  }), [score, username, email, highScore, round, correctCount, pfp, commentScore, phishingScore]);

  const startGame = () => {
    setGameState('START');
  };

  const startRound = useCallback(() => {
    setGameState('PLAYING');
    setCorrectCount(0);
    setTimer(ROUND_DURATIONS[round - 1]);
    
    // Combine built-in posts with user posts of matching difficulty
    const relevantUserPosts = userPosts.filter(p => p.difficulty === currentDifficulty);
    const filteredPosts = allPosts.filter(p => p.difficulty === currentDifficulty);
    
    const shuffledPosts = shuffle([...filteredPosts, ...relevantUserPosts]);
    const currentRoundPosts = shuffledPosts.slice(0, POSTS_PER_ROUND);
    setPosts(currentRoundPosts);
    setRoundPosts(currentRoundPosts);
  }, [round, currentDifficulty, userPosts]);

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
      case 'impossible':
        basePoints = 200;
        break;
      default:
        basePoints = 50;
    }

    if (correct) {
      setScore(s => s + basePoints);
      setCorrectCount(c => c + 1);
      incrementStreak();
      setFeedback({ 
        isOpen: true, 
        reasoning: `✅ Correct!\n\n${classifiedPost.reasoning}` 
      });
    } else {
      setScore(s => s - basePoints);
      resetStreak();
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

  return { posts, score, gameState, setGameState, handleClassify, stats, round, timer, roundPosts, unclassifiedPosts, nextRound, startRound, feedback, closeFeedback, roundDuration, playingStreak, addUserPost, startGame };
}
