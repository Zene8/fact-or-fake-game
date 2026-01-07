import { useState, useEffect } from 'react';

export function useUserProfile() {
  const [feedScore, _setFeedScore] = useState(() => Number(localStorage.getItem('factOrFake_feedScore')) || 0);
  const [commentScore, _setCommentScore] = useState(() => Number(localStorage.getItem('factOrFake_commentScore')) || 0);
  const [phishingScore, _setPhishingScore] = useState(() => Number(localStorage.getItem('factOrFake_phishingScore')) || 0);
  
  const [round, setRound] = useState(1);

  // Persistence with localStorage
  const [username, setUsername] = useState(() => localStorage.getItem('factOrFake_username') || 'Guest');
  const [pfp, setPfp] = useState(() => localStorage.getItem('factOrFake_pfp') || `https://ui-avatars.com/api/?name=Guest&background=random`);
  const [email, setEmail] = useState(() => localStorage.getItem('factOrFake_email') || '');
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('factOrFake_highScore')) || 0);
  const [playingStreak, setPlayingStreak] = useState(() => Number(localStorage.getItem('factOrFake_playingStreak')) || 0);

  useEffect(() => {
    localStorage.setItem('factOrFake_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('factOrFake_pfp', pfp);
  }, [pfp]);

  useEffect(() => {
    localStorage.setItem('factOrFake_email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('factOrFake_feedScore', feedScore.toString());
    const totalHighScore = Math.max(feedScore, commentScore, phishingScore);
    if (totalHighScore > highScore) {
      setHighScore(totalHighScore);
    }
  }, [feedScore, commentScore, phishingScore, highScore]);

  useEffect(() => {
    localStorage.setItem('factOrFake_commentScore', commentScore.toString());
  }, [commentScore]);

  useEffect(() => {
    localStorage.setItem('factOrFake_phishingScore', phishingScore.toString());
  }, [phishingScore]);

  useEffect(() => {
    localStorage.setItem('factOrFake_playingStreak', playingStreak.toString());
  }, [playingStreak]);

  const setFeedScore = (newScore: number | ((s: number) => number)) => {
    const updatedScore = typeof newScore === 'function' ? newScore(feedScore) : newScore;
    _setFeedScore(updatedScore);
  }

  const setCommentScore = (newScore: number | ((s: number) => number)) => {
    const updatedScore = typeof newScore === 'function' ? newScore(commentScore) : newScore;
    _setCommentScore(updatedScore);
  }

  const setPhishingScore = (newScore: number | ((s: number) => number)) => {
    const updatedScore = typeof newScore === 'function' ? newScore(phishingScore) : newScore;
    _setPhishingScore(updatedScore);
  }

  const incrementStreak = () => setPlayingStreak(prev => prev + 1);
  const resetStreak = () => setPlayingStreak(0);

  return { 
    feedScore, setFeedScore,
    commentScore, setCommentScore,
    phishingScore, setPhishingScore,
    round, setRound, 
    username, setUsername, 
    pfp, setPfp,
    email, setEmail, 
    highScore, setHighScore,
    playingStreak, incrementStreak, resetStreak
  };
}
