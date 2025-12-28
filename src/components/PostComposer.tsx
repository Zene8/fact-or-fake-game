import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Image, BarChart2, Smile, MapPin, GitCommit } from 'lucide-react';

export function PostComposer() {
  return (
    <div className="flex p-4 border-b border-border">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/src/assets/react.svg" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1 ml-4">
        <textarea
          placeholder="What’s happening?"
          className="w-full bg-transparent text-xl placeholder-text-secondary focus:outline-none resize-none"
          rows={1}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-4">
            <Image size={20} className="text-accent" />
            <GitCommit size={20} className="text-accent" />
            <BarChart2 size={20} className="text-accent" />
            <Smile size={20} className="text-accent" />
            <MapPin size={20} className="text-accent" />
          </div>
          <button className="bg-accent text-white px-4 py-1.5 rounded-full font-bold text-sm opacity-50 cursor-not-allowed">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
