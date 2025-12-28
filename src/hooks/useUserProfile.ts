import { useState, useEffect } from 'react';

export function useUserProfile() {
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('userScore');
    return savedScore ? parseInt(savedScore, 10) : 1000;
  });

  const [round, setRound] = useState(() => {
    const savedRound = localStorage.getItem('userRound');
    return savedRound ? parseInt(savedRound, 10) : 1;
  });

  const [username, setUsername] = useState(() => {
    const savedUsername = localStorage.getItem('username');
    return savedUsername || 'Guest'; // Default username
  });

  const [email, setEmail] = useState(() => {
    const savedEmail = localStorage.getItem('email');
    return savedEmail || ''; // Default empty email
  });

  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem('highScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('userScore', score.toString());
    // Update high score if current score is higher
    setHighScore(prevHighScore => Math.max(prevHighScore, score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem('userRound', round.toString());
  }, [round]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('highScore', highScore.toString());
  }, [highScore]);

  return { score, setScore, round, setRound, username, setUsername, email, setEmail, highScore, setHighScore };
}
