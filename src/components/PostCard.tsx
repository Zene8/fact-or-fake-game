import type { Post } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { MessageCircle, Repeat, Heart, BarChart2, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface PostCardProps {
  post: Post;
  onClassify: (isMisinformation: boolean) => void;
}

export function PostCard({ post, onClassify }: PostCardProps) {
  return (
    <div className="bg-black border-b border-gray-800 p-4 hover:bg-gray-900/50 transition-colors duration-200 cursor-pointer">
      <div className="flex">
        <div className="mr-3 flex-shrink-0">
          <Avatar className="h-10 w-10"> {/* Adjusted avatar size */}
            <AvatarImage
              src={post.avatar}
              alt={`${post.username}'s avatar`}
              loading="lazy"
              className={cn(post.type === 'Misinformation' && 'filter grayscale blur-[0.5px]')} // Subtle uncanny factor
            />
            <AvatarFallback>{post.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 whitespace-nowrap text-[15px]">
              <p className="font-bold text-white">{post.username}</p>
              <p className="text-gray-400">@{post.handle}</p>
              {post.type === 'Verified' && (
                <BadgeCheck className="text-blue-500 ml-1" size={16} />
              )}
              <p className="text-gray-400">·</p>
              <p className="text-gray-400 text-sm">1h</p>
            </div>
            <MoreHorizontal className="text-gray-400" size={18} />
          </div>
          <p className="text-white mt-1 text-[15px] leading-relaxed">{post.content}</p>
          <div className="flex justify-between text-gray-400 mt-3 max-w-md">
            <div className="flex items-center space-x-1 text-sm hover:text-blue-500 transition-colors duration-200">
              <MessageCircle size={16} />
              <span className="text-xs">{Math.floor(Math.random() * 1000)}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm hover:text-green-500 transition-colors duration-200">
              <Repeat size={16} />
              <span className="text-xs">{Math.floor(Math.random() * 1000)}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm hover:text-pink-500 transition-colors duration-200">
              <Heart size={16} />
              <span className="text-xs">{Math.floor(Math.random() * 1000)}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm hover:text-blue-500 transition-colors duration-200">
              <BarChart2 size={16} />
              <span className="text-xs">{Math.floor(Math.random() * 10000)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-around mt-4 pt-4 border-t border-gray-800">
        <button
          onClick={() => onClassify(false)}
          className="flex-1 mx-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full text-sm transition-colors duration-200"
        >
          Fact
        </button>
        <button
          onClick={() => onClassify(true)}
          className="flex-1 mx-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-full text-sm transition-colors duration-200"
        >
          Fake
        </button>
      </div>
    </div>
  );
}
