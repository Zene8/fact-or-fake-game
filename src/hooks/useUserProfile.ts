import { useState } from 'react';

export function useUserProfile() {
  const [score, _setScore] = useState(0);

  const [round, setRound] = useState(1);

  const [username, setUsername] = useState('Guest');

  const [email, setEmail] = useState('');

  const [highScore, setHighScore] = useState(0);

  const setScore = (newScore: number | ((s: number) => number)) => {
    const updatedScore = typeof newScore === 'function' ? newScore(score) : newScore;
    _setScore(updatedScore);
    setHighScore(prevHighScore => Math.max(prevHighScore, updatedScore));
  }

  return { score, setScore, round, setRound, username, setUsername, email, setEmail, highScore, setHighScore };
}