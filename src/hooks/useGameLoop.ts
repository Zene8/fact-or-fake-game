import { useState, useEffect, useCallback, useMemo } from 'react';
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

// Pre-process posts (simplified as username, handle, avatar are now in posts.json)
let instanceIdCounter = 0; // Counter for unique instanceId
const allPosts: Post[] = postsData.map(post => ({
  ...post,
  instanceId: `${post.id}-${instanceIdCounter++}`, // Generate unique instanceId
  classified: false, // Add a classified flag
}));


export function useGameLoop() {
  const { score, setScore, round, setRound } = useUserProfile();
  const [gameState, setGameState] = useState<GameState>('START');
  const [posts, setPosts] = useState<Post[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isOpen: boolean; reasoning: string }>({
    isOpen: false, reasoning: '',
  });
  const [currentDifficultyLevel, setCurrentDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [loadedPostsCount, setLoadedPostsCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0); // New state for streak
  const [streakMultiplier, setStreakMultiplier] = useState(1.0); // New state for multiplier
  const [credibilityMeter, setCredibilityMeter] = useState(100); // New state for credibility meter

  const POSTS_PER_DIFFICULTY_ROUND = 10; // Number of posts to show before potentially increasing difficulty
  const POSTS_TO_LOAD_BATCH = 5; // Number of posts to load at a time for infinite scroll

  const tier = useMemo(() => Math.floor(score / 1000) + 1, [score]);

  const stats: GameStats = useMemo(() => ({
    correct: correctCount,
    incorrect: incorrectCount,
    score,
    tier,
    // Add streak info to stats if needed for display
  }), [correctCount, incorrectCount, score, tier]);

  // Filter and shuffle posts based on current difficulty
  const availablePostsForDifficulty = useMemo(() => {
    const filtered = allPosts.filter(p => p.difficulty === currentDifficultyLevel);
    return shuffle([...filtered]);
  }, [currentDifficultyLevel]);

  const loadMorePosts = useCallback(() => {
    // If all posts for current difficulty are loaded, try to advance difficulty
    if (loadedPostsCount >= availablePostsForDifficulty.length) {
      if (currentDifficultyLevel === 'easy') {
        setCurrentDifficultyLevel('medium');
        setLoadedPostsCount(0); // Reset count for new difficulty
        setPosts([]); // Clear current posts to load new difficulty posts
        return;
      } else if (currentDifficultyLevel === 'medium') {
        setCurrentDifficultyLevel('hard');
        setLoadedPostsCount(0);
        setPosts([]);
        return;
      } else if (currentDifficultyLevel === 'hard') {
        // If all hard posts are loaded, loop back to easy for infinite play
        setCurrentDifficultyLevel('easy');
        setLoadedPostsCount(0);
        setPosts([]);
        return;
      }
    }

    const newPosts = availablePostsForDifficulty.slice(loadedPostsCount, loadedPostsCount + POSTS_TO_LOAD_BATCH);
    setPosts(prev => [...prev, ...newPosts]);
    setLoadedPostsCount(prev => prev + POSTS_TO_LOAD_BATCH);
  }, [availablePostsForDifficulty, loadedPostsCount, currentDifficultyLevel]);

  // Initial load and subsequent loads when difficulty changes
  useEffect(() => {
    if (gameState === 'PLAYING' && posts.length === 0 && availablePostsForDifficulty.length > 0) {
      loadMorePosts();
    }
  }, [gameState, posts.length, availablePostsForDifficulty.length, loadMorePosts]);

  const handleClassify = (instanceId: string, isMisinformation: boolean) => {
    const classifiedPost = posts.find(p => p.instanceId === instanceId);
    if (!classifiedPost) return;

    const correct = (classifiedPost.type === 'Misinformation') === isMisinformation;
    let basePoints = 0;

    // Determine base points based on difficulty
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
        basePoints = 50; // Default for unknown difficulty
    }
    
    if (correct) {
      const newStreak = currentStreak + 1; // Calculate new streak
      setCurrentStreak(newStreak);

      let newMultiplier = 1.0;
      if (newStreak >= 15) newMultiplier = 2.0;
      else if (newStreak >= 10) newMultiplier = 1.5;
      else if (newStreak >= 5) newMultiplier = 1.2;
      
      setStreakMultiplier(newMultiplier);

      const earnedPoints = Math.round(basePoints * newMultiplier); // Use newMultiplier
      setScore(s => s + earnedPoints);
      setCorrectCount(c => c + 1);
      setCredibilityMeter(prev => Math.min(100, prev + 5)); // Increase credibility
      setFeedback({ isOpen: true, reasoning: `Correct! This was a ${classifiedPost.type} (${classifiedPost.difficulty}). Earned ${earnedPoints} points (x${newMultiplier.toFixed(1)} streak). ${classifiedPost.reasoning}` });
    } else {
      setCurrentStreak(0); // Reset streak
      setStreakMultiplier(1.0); // Reset multiplier
      const deductedPoints = Math.round(basePoints * 1.0); // Always deduct with 1.0 multiplier after reset
      setScore(s => s - deductedPoints);
      setIncorrectCount(c => c + 1);
      setCredibilityMeter(prev => Math.max(0, prev - 10)); // Decrease credibility
      setFeedback({ isOpen: true, reasoning: `Incorrect. This was a ${classifiedPost.type} (${classifiedPost.difficulty}). Lost ${deductedPoints} points (streak reset). ${classifiedPost.reasoning}` });
    }

    // Remove the classified post from the feed
    setPosts(prevPosts => prevPosts.filter(post => post.instanceId !== instanceId));
  };

  // Game over logic
  useEffect(() => {
    if (credibilityMeter <= 0) {
      setGameState('GAMEOVER');
    }
  }, [credibilityMeter]);

  return { posts, score, tier, gameState, setGameState, handleClassify, feedback, setFeedback, stats, round, loadMorePosts, credibilityMeter };
}
