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
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl font-black text-accent">{round}</span>
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tighter">Round {round}</h2>
        <p className="text-text-secondary mb-8 max-w-[280px]">
          {round === 1 && "Easy difficulty. Look for obvious hoaxes."}
          {round === 2 && "Medium difficulty. Watch for pseudo-science."}
          {round === 3 && "Hard difficulty. Professional spoofs ahead."}
          {round === 4 && "Impossible difficulty. Indistinguishable from truth."}
        </p>
        <button 
          onClick={startRound} 
          className="bg-accent text-white px-12 py-3.5 rounded-full font-bold text-lg hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-accent/20"
        >
          Begin Round
        </button>
      </div>
    );
  }

  const isRoundOver = gameState === 'ROUND_OVER';

  return (
    <div className="flex flex-col relative">
      <div className={`${isRoundOver ? 'opacity-40 pointer-events-none' : ''}`}>
        {posts.map(post => (
          <PostCard
            key={post.instanceId}
            post={post}
            isRoundOver={isRoundOver}
            onClassify={isMisinformation => handleClassify(post.instanceId, isMisinformation)}
          />
        ))}
      </div>
      
      <FeedbackModal
        isOpen={feedback.isOpen}
        reasoning={feedback.reasoning}
        onClose={closeFeedback}
      />

      {isRoundOver && (
        <RoundOverModal
          isOpen={true}
          onClose={nextRound}
          round={round}
          unclassifiedPosts={unclassifiedPosts}
          roundPosts={roundPosts}
        />
      )}
    </div>
  );
}
