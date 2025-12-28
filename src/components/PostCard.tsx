import type { Post } from '../types';
import { formatTimeAgo } from '../lib/utils';
import { MessageCircle, Repeat, Heart, BarChart2, Upload, Bookmark, Check, X } from 'lucide-react';
import { useState, useRef } from 'react'; // Import useState and useRef

interface Props {
  post: Post;
  onClassify: (postId: number, isFake: boolean) => void;
}

export function PostCard({ post, onClassify }: Props) {
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
  const startX = useRef(0);
  const currentX = useRef(0);
  const postCardRef = useRef<HTMLDivElement>(null); // Ref for the main post card div

  const SWIPE_THRESHOLD = 100; // Pixels to trigger a classification

  const handleStart = (clientX: number) => {
    if (post.classified) return; // Prevent swiping already classified posts
    setIsSwiping(true);
    startX.current = clientX;
    currentX.current = clientX;
    if (postCardRef.current) {
      postCardRef.current.style.transition = 'none'; // Disable transition during swipe
    }
  };

  const handleMove = (clientX: number) => {
    if (!isSwiping || post.classified) return;
    currentX.current = clientX;
    const deltaX = currentX.current - startX.current;
    setTranslateX(deltaX);
  };

  const handleEnd = () => {
    if (!isSwiping || post.classified) return;
    setIsSwiping(false);
    const deltaX = currentX.current - startX.current;

    if (postCardRef.current) {
      postCardRef.current.style.transition = 'transform 0.3s ease-out'; // Re-enable transition
    }

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      const isFake = deltaX < 0; // Swipe left for fake, right for fact
      // Call onClassify after the animation completes
      setTimeout(() => {
        onClassify(post.id, isFake);
      }, 300); // 300ms matches the CSS transition duration
      
    } else {
      // Snap back to original position
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
      className={`w-full bg-primary hover:bg-secondary transition-colors duration-200 border-b border-border p-4 flex gap-3 relative overflow-hidden ${post.classified ? 'opacity-50' : ''}`}
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

      {/* Post Content - This will be swiped */}
      <div className="flex-shrink-0">
        <img 
          src={post.avatar} 
          className="h-10 w-10 rounded-full bg-secondary" 
          alt={`${post.username}'s avatar`} 
        />
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
              {post.media.map((src, index) => (
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
