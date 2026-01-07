import type { Post } from '../types';
import { formatTimeAgo } from '../lib/utils';
import { MessageCircle, Repeat, Heart, BarChart2, Upload, Bookmark } from 'lucide-react';
import { useState, useRef } from 'react'; // Import useState and useRef

import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';

interface Props {
  post: Post;
  isRoundOver?: boolean;
  onClassify: (isFake: boolean) => void;
}

export function PostCard({ post, isRoundOver, onClassify }: Props) {
  const replies = Math.floor(post.id % 100);
  const retweets = Math.floor(post.id % 500);
  const likes = Math.floor(post.id % 2000);
  const views = Math.floor(post.id % 10000);

  const engagementIcons = [
    { icon: MessageCircle, count: replies, color: 'hover:text-accent' },
    { icon: Repeat, count: retweets, color: 'hover:text-green-500' },
    { icon: Heart, count: likes, color: 'hover:text-red-500' },
    { icon: BarChart2, count: views, color: 'hover:text-accent' },
    { icon: Bookmark, color: 'hover:text-accent' },
    { icon: Upload, color: 'hover:text-accent' },
  ];

  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isBeingClassified, setIsBeingClassified] = useState(false); // New state
  const startX = useRef(0);
  const currentX = useRef(0);
  const postCardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 100;

  const handleStart = (clientX: number) => {
    if (post.classified || isBeingClassified || isRoundOver) return; // Prevent swiping if already classified or being classified or round over
    setIsSwiping(true);
    startX.current = clientX;
    currentX.current = clientX;
    if (postCardRef.current) {
      postCardRef.current.style.transition = 'none';
    }
  };

  const handleMove = (clientX: number) => {
    if (!isSwiping || post.classified || isBeingClassified || isRoundOver) return;
    currentX.current = clientX;
    const deltaX = currentX.current - startX.current;
    setTranslateX(deltaX);
  };

  const handleEnd = () => {
    if (!isSwiping || post.classified || isBeingClassified || isRoundOver) return;
    setIsSwiping(false);
    const deltaX = currentX.current - startX.current;

    if (postCardRef.current) {
      postCardRef.current.style.transition = 'transform 0.3s ease-out';
    }

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      setIsBeingClassified(true); // Set to true when classification is triggered
      const isFake = deltaX < 0;
      
      setTranslateX(isFake ? -window.innerWidth : window.innerWidth);

      setTimeout(() => {
        onClassify(isFake);
      }, 300);
      
    } else {
      setTranslateX(0);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => { // Handle case where mouse leaves while dragging
    if (isSwiping) handleEnd();
  };

  // Determine banner visibility and opacity
  const swipeProgress = Math.abs(translateX) / SWIPE_THRESHOLD;
  const factBannerOpacity = translateX > 0 ? Math.min(swipeProgress, 1) : 0;
  const fakeBannerOpacity = translateX < 0 ? Math.min(swipeProgress, 1) : 0;

  return (
    <div 
      ref={postCardRef}
      className={`w-full bg-primary hover:bg-secondary transition-colors duration-200 border-b border-border p-4 flex gap-3 relative overflow-hidden ${post.classified || isRoundOver ? 'opacity-50' : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ transform: `translateX(${translateX}px)` }} // Apply transform to the whole card
    >
      {/* Fact Banner */}
      <div 
        className="absolute inset-0 flex items-center justify-start bg-green-500/70 text-white text-2xl font-bold z-10"
        style={{ opacity: factBannerOpacity, pointerEvents: 'none' }}
      >
        <span className="p-4">FACT</span>
      </div>
      {/* Fake Banner */}
      <div 
        className="absolute inset-0 flex items-center justify-end bg-red-500/70 text-white text-2xl font-bold z-10"
        style={{ opacity: fakeBannerOpacity, pointerEvents: 'none' }}
      >
        <span className="p-4">FAKE</span>
      </div>

      {/* Missed Banner */}
      {isRoundOver && (
        <div className="absolute inset-0 bg-zinc-900/90 flex flex-col items-center justify-center p-6 text-center z-20">
          <span className="text-yellow-500 font-black text-xl mb-2">MISSED</span>
          <p className="text-sm font-bold text-white mb-1">{post.type.toUpperCase()}</p>
          <p className="text-xs text-zinc-300">{post.reasoning}</p>
        </div>
      )}

      {/* Post Content - This will be swiped */}
      <div className="flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.avatar} alt={`${post.username}'s avatar`} />
          <AvatarFallback className="bg-secondary text-text-primary">{post.username[0]}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-text-primary hover:underline cursor-pointer">{post.username}</span>
          <span className="text-text-secondary">@{post.handle}</span>
          <span className="text-text-secondary">·</span>
          <span className="text-text-secondary hover:underline cursor-pointer">{formatTimeAgo(post.timestamp)}</span>
        </div>

        <p className="text-text-primary text-[15px] leading-relaxed mt-1">
          {post.content}
        </p>
        
        {post.media && post.media.length > 0 && (
          <div className="mt-3 rounded-2xl border border-border overflow-hidden">
            <div className={`grid grid-cols-${post.media.length > 1 ? 2 : 1} gap-px`}>
              {post.media.map((src: string, index: number) => (
                <img key={index} src={src} className="w-full h-full object-cover" />
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between max-w-sm text-text-secondary">
          {engagementIcons.map((item, index) => (
            <div key={index} className={`flex items-center gap-1 group ${item.color}`}>
              <div className="p-2 rounded-full group-hover:bg-accent/10">
                <item.icon size={18} />
              </div>
              {item.count && <span className="text-sm group-hover:text-current">{item.count}</span>}
            </div>
          ))}
        </div>
        {/* Removed Fact/Fake Buttons */}
      </div>
    </div>
  );
}
