import React from 'react';
import type { Post } from '../types';

interface RoundOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: number;
  unclassifiedPosts: Post[];
  roundPosts: Post[];
}

export const RoundOverModal: React.FC<RoundOverModalProps> = ({ isOpen, onClose, round, unclassifiedPosts, roundPosts }) => {
  if (!isOpen) return null;

  const correctlyClassifiedPosts = roundPosts.filter(p => !unclassifiedPosts.some(up => up.instanceId === p.instanceId));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Round {round} Over!</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Results</h3>
          <p>You correctly classified {correctlyClassifiedPosts.length} out of {roundPosts.length} posts.</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Missed Posts</h3>
          {unclassifiedPosts.length > 0 ? (
            <div className="space-y-4">
              {unclassifiedPosts.map(post => (
                <div key={post.instanceId} className="border-l-4 border-gray-300 pl-4">
                  <p className="font-bold">{post.username}</p>
                  <p className={`font-semibold ${post.type === 'Misinformation' ? 'text-red-600' : 'text-green-600'}`}>
                    {post.type}
                  </p>
                  <p className="text-sm italic">{post.content}</p>
                  <p className="mt-1 text-gray-700">{post.reasoning}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>You classified all the posts this round!</p>
          )}
        </div>
        <button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
          {round < 4 ? 'Next Round' : 'See Final Score'}
        </button>
      </div>
    </div>
  );
};
