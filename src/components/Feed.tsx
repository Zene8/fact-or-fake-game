import { PostCard } from './PostCard';
import type { Post } from '../types';

interface FeedProps {
  posts: Post[];
  handleClassify: (postId: number, isMisinformation: boolean) => void;
  viralProgress: Record<number, number>;
}

export function Feed({ posts, handleClassify, viralProgress }: FeedProps) {
  return (
    <div className="flex flex-col">
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <PostCard
              post={post}
              onClassify={(isMisinformation) => handleClassify(post.id, isMisinformation)}
            />
            <div className="relative h-1 w-full bg-gray-800">
              <div
                className="absolute top-0 left-0 h-full bg-red-500"
                style={{ width: `${viralProgress[post.id] || 0}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
