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
  const accuracy = Math.round((correctlyClassifiedPosts.length / roundPosts.length) * 100);

  return (
    <div className="fixed inset-0 bg-primary/95 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-primary border border-border rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 text-center border-b border-border">
          <h2 className="text-3xl font-black mb-1">Round {round} Summary</h2>
          <p className="text-text-secondary font-medium">Analyzing your truth-seeking performance</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 p-6 rounded-2xl border border-border text-center">
              <p className="text-sm text-text-secondary uppercase tracking-widest font-bold mb-2">Accuracy</p>
              <p className="text-4xl font-black text-accent">{accuracy}%</p>
            </div>
            <div className="bg-secondary/50 p-6 rounded-2xl border border-border text-center">
              <p className="text-sm text-text-secondary uppercase tracking-widest font-bold mb-2">Correct</p>
              <p className="text-4xl font-black text-green-500">{correctlyClassifiedPosts.length}/{roundPosts.length}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full"></span>
              Missed Intelligence
            </h3>
            {unclassifiedPosts.length > 0 ? (
              <div className="space-y-4">
                {unclassifiedPosts.map(post => (
                  <div key={post.instanceId} className="bg-secondary/30 p-4 rounded-2xl border border-border/50 group hover:border-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm text-text-primary">{post.username}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${post.type === 'Misinformation' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {post.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary italic line-clamp-2 mb-2">"{post.content}"</p>
                    <p className="text-xs text-text-primary leading-relaxed bg-black/20 p-2 rounded-lg">{post.reasoning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-accent/10 p-8 rounded-2xl border border-accent/20 text-center">
                <p className="text-accent font-bold">Perfect detection. No misinformation escaped your watch.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-primary">
          <button 
            onClick={onClose} 
            className="w-full bg-text-primary text-primary py-4 rounded-full font-black text-lg hover:opacity-90 transition-all active:scale-95"
          >
            {round < 4 ? 'Advance to Next Round' : 'View Final Score'}
          </button>
        </div>
      </div>
    </div>
  );
};
