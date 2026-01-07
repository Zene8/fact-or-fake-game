import { MessageCircle, ThumbsUp, Flag, Reply, Heart, Share, Flame, ChevronRight, Hash, MoreHorizontal, Send, Bookmark } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import commentThreadsData from '../data/comments.json';
import type { CommentThread, Comment } from '../types';

export function CommentGame() {
  const { commentScore, setCommentScore } = useUserProfile();
  const [streak, setStreak] = useState(0);
  const [threadIndex, setThreadIndex] = useState(0);
  const [commentIndex, setCommentIndex] = useState(0);
  const [showReasoning, setShowReasoning] = useState(false);
  const [gameState, setGameState] = useState<'SELECTING' | 'PLAYING'>('SELECTING');
  const [history, setHistory] = useState<{ id: number; choice: boolean; correct: boolean }[]>([]);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const threads = commentThreadsData as CommentThread[];
  const currentThread = threads[threadIndex];
  const currentComment = currentThread.comments[commentIndex];

  useEffect(() => {
    if (gameState === 'PLAYING') {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentIndex, gameState]);

  const handleChoice = (choice: boolean) => {
    const isCorrect = choice === currentComment.isFake;
    if (isCorrect) {
      const points = 100 + (streak * 20);
      setCommentScore(s => s + points);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    
    setHistory(prev => [...prev, { id: currentComment.id, choice, correct: isCorrect }]);
    setShowReasoning(true);
  };

  const nextComment = () => {
    setShowReasoning(false);
    if (commentIndex < currentThread.comments.length - 1) {
      setCommentIndex(commentIndex + 1);
    } else {
      setGameState('SELECTING');
      setCommentIndex(0);
      setHistory([]);
      setThreadIndex((threadIndex + 1) % threads.length);
    }
  };

  const startThread = (index: number) => {
    setThreadIndex(index);
    setCommentIndex(0);
    setHistory([]);
    setGameState('PLAYING');
    setShowReasoning(false);
  };

  if (gameState === 'SELECTING') {
    return (
      <div className="flex-1 flex flex-col bg-primary h-full">
        <header className="p-4 border-b border-border bg-primary/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tighter">Moderator Dashboard</h2>
            <p className="text-xs text-text-secondary">High-traffic threads requiring verification</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <MessageCircle className="text-accent" size={20} />
          </div>
        </header>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          {threads.map((thread, idx) => (
            <button
              key={thread.id}
              onClick={() => startThread(idx)}
              className="w-full text-left bg-secondary/10 hover:bg-secondary/30 border border-border/50 rounded-[2rem] p-5 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-blue-400 flex items-center justify-center text-white font-bold text-xs">
                    {thread.topic[0]}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent block leading-none">
                      {thread.topic}
                    </span>
                  </div>
                </div>
                <span className="text-text-secondary text-xs font-bold flex items-center gap-1 bg-primary/50 px-2 py-1 rounded-full">
                  <MessageCircle size={12} /> {thread.comments.length}
                </span>
              </div>
              <h3 className="font-bold text-lg group-hover:text-accent transition-colors leading-tight mb-2 pr-6">
                {thread.title}
              </h3>
              <div className="flex items-center text-xs text-text-secondary gap-1">
                <span>Last active 2m ago</span>
                <span>·</span>
                <span className="text-orange-500 font-bold">Trending</span>
              </div>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary group-hover:text-accent transition-all transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-primary h-full">
      {/* Top Navigation */}
      <header className="px-4 py-3 border-b border-border bg-primary/80 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setGameState('SELECTING')}
            className="p-2 hover:bg-secondary rounded-full text-text-primary transition-colors"
          >
            <ChevronRight className="rotate-180" size={24} />
          </button>
          <span className="font-bold">Post</span>
        </div>
        <div className="flex gap-2">
          {streak > 1 && (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1">
              <Flame size={12} fill="currentColor" /> {streak}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* The Main Post Card */}
        <div className="border-b border-border pb-4">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full border-2 border-primary bg-secondary flex items-center justify-center font-bold text-[10px]">
                  {currentThread.topic[0]}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold leading-none">{currentThread.topic} Global</p>
                <p className="text-[10px] text-text-secondary">Sponsored</p>
              </div>
            </div>
            <MoreHorizontal size={20} className="text-text-secondary" />
          </div>
          
          <div className="px-4 py-2 bg-secondary/10 aspect-video flex items-center justify-center text-center border-y border-border/50">
             <div className="p-8">
                <Hash size={40} className="mx-auto mb-4 text-accent/20" />
                <h2 className="text-2xl font-black tracking-tight leading-tight">{currentThread.title}</h2>
             </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <Heart size={24} />
                <MessageCircle size={24} />
                <Send size={24} />
              </div>
              <Bookmark size={24} />
            </div>
            <p className="text-sm font-bold mb-1">12,402 likes</p>
            <p className="text-sm">
              <span className="font-bold mr-2">{currentThread.topic.toLowerCase()}Global</span>
              Official discussion thread regarding {currentThread.title.toLowerCase()}. Join the conversation!
            </p>
            <p className="text-xs text-text-secondary mt-2 uppercase tracking-tighter">View all {currentThread.comments.length} comments</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-4 space-y-6">
          {/* History of classified comments */}
          {currentThread.comments.slice(0, commentIndex).map((comment, idx) => {
            const result = history.find(h => h.id === comment.id);
            return (
              <div key={comment.id} className="flex gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full bg-secondary shrink-0 overflow-hidden">
                   <img src={`https://ui-avatars.com/api/?name=${comment.user}&background=random`} alt="" />
                </div>
                <div className="flex-1 text-sm">
                  <p>
                    <span className="font-bold mr-2">{comment.handle.replace('@', '')}</span>
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary font-bold">
                    <span>2h</span>
                    {result && (
                      <span className={result.correct ? 'text-green-500' : 'text-red-500'}>
                        {result.correct ? 'Verified' : 'Missed'}
                      </span>
                    )}
                    <span>Reply</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* THE ACTIVE COMMENT */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-accent/5 rounded-2xl border border-accent/20 animate-pulse pointer-events-none" />
            
            <div className="flex gap-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent shrink-0 text-xs">
                {currentComment.user[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{currentComment.handle.replace('@', '')}</span>
                  <span className="text-text-secondary text-[10px]">Just now</span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed">
                  {currentComment.text}
                </p>
                
                {!showReasoning ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleChoice(false)}
                        className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 py-2.5 rounded-xl font-bold text-xs border border-green-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <ThumbsUp size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => handleChoice(true)}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 rounded-xl font-bold text-xs border border-red-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Flag size={14} /> Report
                      </button>
                    </div>
                    <p className="text-[10px] text-center text-text-secondary uppercase font-black tracking-widest mt-1">
                      Scanning Comment {commentIndex + 1}/{currentThread.comments.length}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className={`p-4 rounded-2xl ${currentComment.isFake ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'} border`}>
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle size={14} className={currentComment.isFake ? 'text-red-500' : 'text-green-500'} />
                        <p className="font-black text-xs uppercase tracking-tighter">
                          {currentComment.isFake ? 'Misinformation Detected' : 'Verified Content'}
                        </p>
                      </div>
                      <p className="text-xs text-text-primary leading-relaxed opacity-90 italic">"{currentComment.reasoning}"</p>
                    </div>
                    <button 
                      onClick={nextComment} 
                      className="w-full bg-text-primary text-primary py-3 rounded-xl font-black text-sm hover:opacity-90 transition-all active:scale-95"
                    >
                      {commentIndex < currentThread.comments.length - 1 ? 'Next Comment' : 'Complete Review'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div ref={commentsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}