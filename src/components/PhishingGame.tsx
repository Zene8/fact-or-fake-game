import { AlertTriangle, CheckCircle, ChevronLeft, Star, Trash2, Archive, Flag, Shield } from 'lucide-react';
import { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import emailsData from '../data/emails.json';

interface Email {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  date: string;
  body: string;
  isScam: boolean;
  indicators: string[];
}

export function PhishingGame() {
  const { phishingScore, setPhishingScore } = useUserProfile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [trustLevel, setTrustLevel] = useState(100);

  const emails = emailsData as Email[];
  const email = emails[currentIndex];

  const handleChoice = (isScamChoice: boolean) => {
    if (isScamChoice === email.isScam) {
      setPhishingScore(s => s + 200);
    } else {
      setTrustLevel(prev => Math.max(0, prev - 20));
    }
    setShowResult(true);
  };

  const next = () => {
    setShowResult(false);
    setCurrentIndex((currentIndex + 1) % emails.length);
  };

  return (
    <div className="flex-1 flex flex-col bg-primary h-full">
      {/* Email Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-primary/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <ChevronLeft className="text-text-secondary cursor-pointer hover:text-accent" />
          <div>
            <h2 className="font-bold text-lg leading-tight">Inbox</h2>
            <div className="flex items-center gap-2">
              <p className="text-xs text-text-secondary">{currentIndex + 1} of {emails.length} emails</p>
              <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${trustLevel > 60 ? 'bg-green-500' : trustLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${trustLevel}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-text-secondary flex items-center gap-0.5">
                <Shield size={10} /> {trustLevel}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-text-secondary">
          <Archive size={20} />
          <Trash2 size={20} />
          <Flag size={20} />
        </div>
      </div>

      <div className="p-4 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-4 leading-tight">{email.subject}</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-accent">
              {email.senderName[0]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-primary">{email.senderName}</span>
                <span className="text-xs text-text-secondary">{email.date}</span>
              </div>
              <p className="text-xs text-text-secondary truncate">From: {email.senderEmail}</p>
            </div>
            <Star size={18} className="text-text-secondary" />
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-6 border border-border min-h-[200px] mb-8">
          <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
            {email.body}
          </p>
        </div>

        {!showResult ? (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-primary/80 backdrop-blur-md border-t border-border md:relative md:bottom-0 md:bg-transparent md:border-none">
            <div className="max-w-lg mx-auto flex gap-4">
              <button 
                onClick={() => handleChoice(false)}
                className="flex-1 bg-green-600 text-white py-4 rounded-full font-black flex items-center justify-center gap-2 hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-900/20"
              >
                <CheckCircle size={20} /> Safe
              </button>
              <button 
                onClick={() => handleChoice(true)}
                className="flex-1 bg-red-600 text-white py-4 rounded-full font-black flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-900/20"
              >
                <AlertTriangle size={20} /> Phishing
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className={`p-6 rounded-3xl ${email.isScam ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'} border`}>
              <div className="flex items-center gap-3 mb-4">
                {email.isScam ? <AlertTriangle className="text-red-500" /> : <CheckCircle className="text-green-500" />}
                <p className="font-black text-xl">{email.isScam ? 'Phishing Detected!' : 'Safe Email'}</p>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">Analysis Indicators:</p>
                <ul className="space-y-2">
                  {email.indicators.map((ind, i) => (
                    <li key={i} className="flex gap-2 text-sm text-text-primary">
                      <span className="text-accent">•</span>
                      {ind}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button 
              onClick={next} 
              className="w-full bg-text-primary text-primary py-4 rounded-full font-black text-lg hover:opacity-90 transition-all active:scale-95"
            >
              Continue to Next Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}