import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Image, BarChart2, Smile, MapPin, GitCommit, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  onPost: (content: string, type: 'Verified' | 'Misinformation') => void;
  username: string;
  pfp: string;
}

export function PostComposer({ onPost, username, pfp }: Props) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'Verified' | 'Misinformation'>('Verified');

  const handlePost = () => {
    if (!content.trim()) return;
    onPost(content, type);
    setContent('');
    alert("Post added to the game database! (Difficulty: Easy)");
  };

  return (
    <div className="flex p-4 border-b border-border bg-secondary/10">
      <Avatar className="h-10 w-10">
        <AvatarImage src={pfp} alt={username} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 ml-4">
        <textarea
          placeholder="Add a post to the game database..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent text-lg placeholder-text-secondary focus:outline-none resize-none"
          rows={2}
        />
        
        <div className="flex flex-wrap gap-2 mb-4 mt-2">
          <button 
            onClick={() => setType('Verified')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${type === 'Verified' ? 'bg-green-500 text-white' : 'bg-secondary text-text-secondary'}`}
          >
            <ShieldCheck size={14} /> Verified
          </button>
          <button 
            onClick={() => setType('Misinformation')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${type === 'Misinformation' ? 'bg-red-500 text-white' : 'bg-secondary text-text-secondary'}`}
          >
            <AlertTriangle size={14} /> Misinfo
          </button>
          
          <div className="h-4 w-px bg-border mx-1 my-auto" />
          <span className="text-[10px] uppercase font-black text-text-secondary self-center">Difficulty: Easy</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-4 text-accent opacity-50">
            <Image size={18} />
            <GitCommit size={18} />
            <BarChart2 size={18} />
            <Smile size={18} />
            <MapPin size={18} />
          </div>
          <button 
            onClick={handlePost}
            disabled={!content.trim()}
            className={`bg-accent text-white px-6 py-1.5 rounded-full font-bold text-sm transition-all ${!content.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'}`}
          >
            Post to Game
          </button>
        </div>
      </div>
    </div>
  );
}