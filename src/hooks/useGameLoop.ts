import { useState, useEffect, useCallback, useRef } from 'react';
import type { Post, User } from '../types';
import { users } from '../data/users';
import { generateDynamicPost } from '../lib/groq';

const INITIAL_SCORE = 1000;
const CORRECT_FLAG_POINTS = 50;
const MISSED_FAKE_PENALTY = 100;
const WRONGLY_FLAGGED_REAL_PENALTY = 150;
const TIER_THRESHOLD = 500;
const INITIAL_POST_COUNT = 5; // Number of posts to generate at the start

const allUsers: User[] = [...users.verified_accounts, ...users.suspicious_accounts];

export function useGameLoop() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [tier, setTier] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [viralProgress, setViralProgress] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<{ isOpen: boolean; reasoning: string }>({
    isOpen: false,
    reasoning: '',
  });
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const generatingPostRef = useRef(false); // To prevent multiple API calls

  const generateAndAddPost = useCallback(async () => {
    if (generatingPostRef.current) return;
    generatingPostRef.current = true;

    try {
      const generatedPost = await generateDynamicPost();
      // Randomly assign a user from the curated list
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];

      const newPost: Post = {
        ...generatedPost,
        username: randomUser.name,
        handle: randomUser.handle,
        avatar: randomUser.avatar,
      };

      setPosts((prevPosts) => [...prevPosts, newPost]);
      setViralProgress((prev) => ({ ...prev, [newPost.id]: 0 }));
    } catch (error) {
      console.error("Failed to generate post:", error);
    } finally {
      generatingPostRef.current = false;
    }
  }, [posts]);

  // Initial post generation
  useEffect(() => {
    if (posts.length === 0 && !gameOver) {
      for (let i = 0; i < INITIAL_POST_COUNT; i++) {
        generateAndAddPost();
      }
    }
  }, [posts.length, gameOver, generateAndAddPost]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver) {
        clearInterval(gameInterval);
        return;
      }

      // Update viral progress
      setViralProgress((prev) => {
        const newProgress = { ...prev };
        let misinformationWentViral = false;
        for (const postIdStr in newProgress) {
          const postId = parseInt(postIdStr);
          newProgress[postId] += 1 * tier;
          if (newProgress[postId] >= 100) {
            const post = posts.find((p) => p.id === postId);
            if (post?.type === 'Misinformation') {
              setScore((s) => s - MISSED_FAKE_PENALTY);
              setIncorrectCount((c) => c + 1);
              setFeedback({ isOpen: true, reasoning: post.reasoning });
              misinformationWentViral = true;
            }
            // Remove post from feed
            setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
            delete newProgress[postIdStr];
          }
        }

        // If a misinformation post went viral, generate a new post immediately
        if (misinformationWentViral) {
          generateAndAddPost();
        } else if (posts.length < INITIAL_POST_COUNT / 2) { // Generate new post if feed is running low
          generateAndAddPost();
        }
        return newProgress;
      });
    }, 2000 / tier);

    return () => clearInterval(gameInterval);
  }, [tier, gameOver, posts, generateAndAddPost]);

  useEffect(() => {
    setTier(Math.floor(score / TIER_THRESHOLD) + 1);
    if (score <= 0) {
      setGameOver(true);
    }
  }, [score]);

  const handleClassify = (postId: number, isMisinformation: boolean) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const isCorrect = (post.type === 'Misinformation') === isMisinformation;

    if (isCorrect) {
      setScore((s) => s + CORRECT_FLAG_POINTS);
      setCorrectCount((c) => c + 1);
    } else {
      if (post.type === 'Verified') {
        setScore((s) => s - WRONGLY_FLAGGED_REAL_PENALTY);
      }
      setIncorrectCount((c) => c + 1);
      setFeedback({ isOpen: true, reasoning: post.reasoning });
    }

    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
    setViralProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[postId];
      return newProgress;
    });
    generateAndAddPost(); // Generate a new post after classification
  };

  const closeFeedbackModal = () => {
    setFeedback({ isOpen: false, reasoning: '' });
  };

  return { posts, score, tier, gameOver, handleClassify, viralProgress, feedback, closeFeedbackModal, correctCount, incorrectCount, allUsers };
}