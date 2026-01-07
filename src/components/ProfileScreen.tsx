import { useState } from 'react'; // Import useState
import type { GameStats } from '../types';
import { useUserProfile } from '../hooks/useUserProfile'; // Import useUserProfile

interface ProfileScreenProps {
  stats: GameStats;
  onClose: () => void;
}

export function ProfileScreen({ stats, onClose }: ProfileScreenProps) {
  const { username, setUsername, email, setEmail, highScore } = useUserProfile(); // Access user profile data

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedEmail, setEditedEmail] = useState(email);

  const handleSave = () => {
    setUsername(editedUsername);
    setEmail(editedEmail);
    setIsEditing(false);
  };

  const totalClassifications = stats.correct + stats.incorrect;
  const accuracy = totalClassifications > 0 ? Math.round((stats.correct / totalClassifications) * 100) : 0;
  const bestStreak = stats.correct > 0 ? stats.correct : 0; // Can be enhanced later with actual streak tracking

  return (
    <div className="w-full max-w-[600px] text-text-primary">
      <header className="sticky top-0 z-20 bg-black border-b border-border p-4 flex items-center gap-4">
        <button onClick={onClose} className="font-bold text-accent hover:text-accent/80 transition-colors">← Back</button>
        <div>
          <h2 className="text-xl font-bold">Your Profile</h2>
          <p className="text-sm text-text-secondary">Game Statistics</p>
        </div>
      </header>
      <div className="p-6">
        <div className="bg-secondary rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img src="https://i.pravatar.cc/150?u=projectoplayer" alt="Player Avatar" className="w-24 h-24 rounded-full border-4 border-accent" />
            <div>
              {isEditing ? (
                <>
                  <input 
                    type="text" 
                    value={editedUsername} 
                    onChange={(e) => setEditedUsername(e.target.value)} 
                    className="text-2xl font-bold bg-transparent border-b border-border focus:outline-none"
                  />
                  <input 
                    type="email" 
                    value={editedEmail} 
                    onChange={(e) => setEditedEmail(e.target.value)} 
                    className="text-text-secondary bg-transparent border-b border-border focus:outline-none mt-1"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold">{username}</h3>
                  <p className="text-text-secondary">{email || 'No email set'}</p>
                </>
              )}
              <p className="text-sm text-accent mt-1">Tier {stats.tier} Analyst</p>
            </div>
          </div>
          <div className="flex justify-end">
            {isEditing ? (
              <button onClick={handleSave} className="bg-accent text-white px-4 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity active:scale-95">Save</button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity active:scale-95">Edit Profile</button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary mb-1">Credibility Score</p>
            <p className="text-4xl font-bold text-accent">{stats.score}</p>
          </div>
          <div className="bg-secondary rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary mb-1">Accuracy</p>
            <p className="text-4xl font-bold text-accent">{accuracy}%</p>
          </div>
          <div className="bg-secondary rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary mb-1">High Score</p>
            <p className="text-4xl font-bold text-accent">{highScore}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Correct</p>
            <p className="text-3xl font-bold text-green-500">{stats.correct}</p>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Incorrect</p>
            <p className="text-3xl font-bold text-red-500">{stats.incorrect}</p>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Total Classified</p>
            <p className="text-3xl font-bold">{totalClassifications}</p>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Best Streak</p>
            <p className="text-3xl font-bold text-accent">{bestStreak}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
