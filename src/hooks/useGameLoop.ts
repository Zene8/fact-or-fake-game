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
const allPosts: Post[] = postsData.map(post => ({
  ...post,
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

  const POSTS_PER_DIFFICULTY_ROUND = 10; // Number of posts to show before potentially increasing difficulty
  const POSTS_TO_LOAD_BATCH = 5; // Number of posts to load at a time for infinite scroll

  const tier = useMemo(() => Math.floor(score / 1000) + 1, [score]);

  const stats: GameStats = useMemo(() => ({
    correct: correctCount,
    incorrect: incorrectCount,
    score,
    tier,
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

  const handleClassify = (id: number, isMisinformation: boolean) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === id ? { ...post, classified: true } : post
      )
    );

    const post = posts.find(p => p.id === id);
    if (!post) return;

    const correct = (post.type === 'Misinformation') === isMisinformation;
    
    if (correct) {
      setScore(s => s + 50); // Simplified scoring
      setCorrectCount(c => c + 1);
    } else {
      setScore(s => s - 50); // Simplified scoring
      setIncorrectCount(c => c + 1);
      setFeedback({ isOpen: true, reasoning: post.reasoning });
    }
  };

  return { posts, score, tier, gameState, setGameState, handleClassify, feedback, setFeedback, stats, round, loadMorePosts };
}
