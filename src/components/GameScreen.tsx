import { useEffect, useRef } from 'react';
import type { Post } from '../types';
import { PostCard } from './PostCard';

interface GameScreenProps {
  posts: Post[];
  handleClassify: (postId: number, isMisinformation: boolean) => void;
  loadMorePosts: () => void;
}

export function GameScreen({ posts, handleClassify, loadMorePosts }: GameScreenProps) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMorePosts]);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={post.id} ref={index === posts.length - 1 ? observerTarget : null}>
          <PostCard 
            post={post} 
            onClassify={handleClassify}
          />
        </div>
      ))}
    </div>
  );
}