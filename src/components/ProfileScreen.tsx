import { useState } from 'react'; // Import useState
import type { GameStats } from '../types';
import { useUserProfile } from '../hooks/useUserProfile'; // Import useUserProfile

interface ProfileScreenProps {
  stats: GameStats;
  onClose: () => void;
}

export function ProfileScreen({ stats, onClose }: ProfileScreenProps) {
  const { username, setUsername, email, setEmail, highScore, playingStreak, pfp, setPfp } = useUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedEmail, setEditedEmail] = useState(email);
  const [editedPfp, setEditedPfp] = useState(pfp);

  const handleSave = () => {
    setUsername(editedUsername);
    setEmail(editedEmail);
    setPfp(editedPfp);
    setIsEditing(false);
  };

  const totalClassifications = stats.correct + stats.incorrect;
  const accuracy = totalClassifications > 0 ? Math.round((stats.correct / totalClassifications) * 100) : 0;

  return (
    <div className="w-full max-w-[600px] text-text-primary bg-primary min-h-screen">
      <header className="sticky top-0 z-20 bg-primary/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-4">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <span className="text-xl">←</span>
        </button>
        <div>
          <h2 className="text-xl font-bold">{username}</h2>
          <p className="text-sm text-text-secondary">Level 1 Truth Seeker</p>
        </div>
      </header>
      
      <div className="relative">
        <div className="h-32 bg-accent/20 w-full"></div>
        <div className="px-4 -mt-16 mb-4 flex justify-between items-end">
          <img 
            src={isEditing ? editedPfp : pfp} 
            alt="Player Avatar" 
            className="w-32 h-32 rounded-full border-4 border-black bg-secondary object-cover" 
          />
          {isEditing ? (
            <button onClick={handleSave} className="bg-text-primary text-primary px-4 py-1.5 rounded-full font-bold text-sm hover:opacity-90">Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="border border-border text-text-primary px-4 py-1.5 rounded-full font-bold text-sm hover:bg-secondary">Edit profile</button>
          )}
        </div>
      </div>

      <div className="px-4 mb-6">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase px-1">Username</label>
              <input 
                type="text" 
                value={editedUsername} 
                onChange={(e) => setEditedUsername(e.target.value)} 
                className="w-full bg-transparent border border-border p-2 rounded focus:border-accent outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase px-1">Email</label>
              <input 
                type="email" 
                value={editedEmail} 
                onChange={(e) => setEditedEmail(e.target.value)} 
                className="w-full bg-transparent border border-border p-2 rounded focus:border-accent outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase px-1">Profile Picture URL</label>
              <input 
                type="text" 
                value={editedPfp} 
                onChange={(e) => setEditedPfp(e.target.value)} 
                className="w-full bg-transparent border border-border p-2 rounded focus:border-accent outline-none mt-1"
              />
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-black">{username}</h3>
            <p className="text-text-secondary">@{username.toLowerCase().replace(/\s/g, '')}</p>
            <p className="mt-3 text-sm text-text-primary">{email || 'Analyzing the truth, one post at a time.'}</p>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="text-text-secondary"><strong className="text-text-primary">{playingStreak}</strong> Streak</span>
              <span className="text-text-secondary"><strong className="text-text-primary">{highScore}</strong> High Score</span>
            </div>
          </>
        )}
      </div>

      <nav className="flex border-b border-border">
        <div className="flex-1 text-center py-4 font-bold border-b-4 border-accent">Game Stats</div>
      </nav>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-secondary/50 p-4 rounded-xl border border-border text-center">
            <p className="text-[10px] text-text-secondary mb-1 uppercase font-bold">Feed Score</p>
            <p className="text-xl font-black text-accent">{stats.score}</p>
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl border border-border text-center">
            <p className="text-[10px] text-text-secondary mb-1 uppercase font-bold">Comments</p>
            <p className="text-xl font-black text-accent">{stats.commentScore}</p>
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl border border-border text-center">
            <p className="text-[10px] text-text-secondary mb-1 uppercase font-bold">Phishing</p>
            <p className="text-xl font-black text-accent">{stats.phishingScore}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 p-4 rounded-xl border border-border">
            <p className="text-sm text-text-secondary mb-1">Accuracy</p>
            <p className="text-2xl font-black text-accent">{accuracy}%</p>
          </div>
          <div className="bg-secondary/30 p-4 rounded-xl border border-border">
            <p className="text-sm text-text-secondary mb-1">Correct Hits</p>
            <p className="text-2xl font-black text-green-500">{stats.correct}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
