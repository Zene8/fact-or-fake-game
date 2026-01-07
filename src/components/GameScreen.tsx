import type { Post } from '../types';
import { PostCard } from './PostCard';
import { RoundOverModal } from './RoundOverModal';
import { FeedbackModal } from './FeedbackModal';

interface GameScreenProps {
  posts: Post[];
  handleClassify: (instanceId: string, isMisinformation: boolean) => void;
  round: number;
  gameState: string;
  startRound: () => void;
  nextRound: () => void;
  unclassifiedPosts: Post[];
  roundPosts: Post[];
  feedback: { isOpen: boolean; reasoning: string };
  closeFeedback: () => void;
}

export function GameScreen({
  posts,
  handleClassify,
  round,
  gameState,
  startRound,
  nextRound,
  unclassifiedPosts,
  roundPosts,
  feedback,
  closeFeedback,
}: GameScreenProps) {
  if (gameState === 'START') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold mb-4">Round {round}</h2>
        <button onClick={startRound} className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl">
          Start Round
        </button>
      </div>
    );
  }

  if (gameState === 'PLAYING') {
    return (
      <div className="flex flex-col">
        {posts.map(post => (
          <PostCard
            key={post.instanceId}
            post={post}
            onClassify={isMisinformation => handleClassify(post.instanceId, isMisinformation)}
          />
        ))}
        <FeedbackModal
          isOpen={feedback.isOpen}
          reasoning={feedback.reasoning}
          onClose={closeFeedback}
        />
      </div>
    );
  }

  if (gameState === 'ROUND_OVER') {
    return (
      <RoundOverModal
        isOpen={true}
        onClose={nextRound}
        round={round}
        unclassifiedPosts={unclassifiedPosts}
        roundPosts={roundPosts}
      />
    );
  }

  return null;
}
