import { useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { GameScreen } from './components/GameScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PostComposer } from './components/PostComposer';
import { NotificationsView } from './components/NotificationsView';
import { CommentGame } from './components/CommentGame';
import { PhishingGame } from './components/PhishingGame';
import { InstructionsScreen } from './components/InstructionsScreen';
import { MisinformationGuide } from './components/MisinformationGuide';
import { RoundTimer } from './components/ui/RoundTimer';
import {
  LayoutGrid,
  User,
  Circle,
  Home,
  MessageCircle,
  Users,
  Bell,
  Mail,
  BookOpen, // Added import
} from 'lucide-react';

const OLogo = () => (
  <Circle className="text-accent w-6 h-6" strokeWidth={3} />
);

export default function App() {
  const game = useGameLoop();
  const [currentView, setCurrentView] = useState('feed');

  const restartGame = () => {
    window.location.reload();
  }

  if (game.gameState === 'GAMEOVER') {
    return (
      <div className="h-screen bg-primary flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <div className="bg-secondary/50 p-12 rounded-[3rem] border border-border shadow-2xl max-w-sm w-full">
          <Circle className="text-accent w-16 h-16 mx-auto mb-6" strokeWidth={3} />
          <h1 className="text-5xl font-black text-text-primary mb-2 tracking-tighter">Round Over</h1>
          <div className="space-y-1 mb-8">
            <p className="text-text-secondary text-lg font-medium">
              Final Score: <span className="text-text-primary font-bold">{game.score}</span>
            </p>
            <p className="text-text-secondary text-lg font-medium">
              Best: <span className="text-accent font-bold">{localStorage.getItem('factOrFake_highScore')}</span>
            </p>
          </div>
          <button
            onClick={restartGame}
            className="w-full bg-text-primary text-primary py-4 rounded-full font-black text-xl hover:opacity-90 transition-all active:scale-95"
          >
            New Game
          </button>
        </div>
      </div>
    );
  }

  const sidebarNavItems = [
    { icon: LayoutGrid, label: 'Feed', view: 'feed' },
    { icon: BookOpen, label: 'Guide', view: 'guide' }, // Added Guide
    { icon: MessageCircle, label: 'Comments', view: 'comments' },
    { icon: User, label: 'Profile', view: 'profile' },
    { icon: Bell, label: 'Notifications', view: 'notifications' },
    { icon: Mail, label: 'Inbox', view: 'phishing' },
  ];

  const bottomNavItems = [
    { icon: Home, label: 'Home', view: 'feed' },
    { icon: BookOpen, label: 'Guide', view: 'guide' }, // Added Guide
    { icon: MessageCircle, label: 'Comments', view: 'comments' },
    { icon: Users, label: 'Profile', view: 'profile' },
    { icon: Bell, label: 'Notifications', view: 'notifications' },
    { icon: Mail, label: 'Inbox', view: 'phishing' },
  ];

  const getActiveScore = () => {
    switch (currentView) {
      case 'feed': return game.score;
      case 'comments': return game.stats.commentScore;
      case 'phishing': return game.stats.phishingScore;
      default: return game.score;
    }
  };

  return (
    <div className="h-screen bg-primary text-text-primary flex justify-center font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-[88px] xl:w-[275px] h-full p-2 xl:p-3 border-r border-border">
        <div className="flex items-center justify-center xl:justify-start p-3 mb-4">
          <Circle className="text-accent w-8 h-8" strokeWidth={3} />
        </div>
        <div className="space-y-2">
          {sidebarNavItems.map((item) => (
            <div
              key={item.label}
              onClick={() => item.view && setCurrentView(item.view)}
              className={`flex items-center justify-center xl:justify-start gap-4 p-3 rounded-full hover:bg-secondary cursor-pointer transition-colors ${currentView === item.view ? 'font-bold text-accent' : 'text-text-secondary'}`}
            >
              <item.icon size={26} />
              <span className="hidden xl:inline text-xl">{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-[600px] border-x border-border h-full relative">
        {game.gameState === 'WELCOME' ? (
          <InstructionsScreen onStart={() => game.setGameState('START')} />
        ) : (
          <>
            <header className="flex-shrink-0 bg-primary/80 backdrop-blur-md border-b border-border z-20">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="w-10" />
                <OLogo />
                <div className="text-text-primary font-bold text-lg">
                  Score: {getActiveScore()}
                </div>
              </div>
              {currentView === 'feed' && (
                <nav className="flex">
                  <div className="flex-1 text-center py-3 font-bold border-b-4 border-accent">
                    For you
                  </div>
                </nav>
              )}
              {game.gameState === 'PLAYING' && currentView === 'feed' && (
                <div className="w-full">
                  <RoundTimer timeLeft={game.timer} roundDuration={game.roundDuration} />
                </div>
              )}
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
              {currentView === 'feed' && (
                <>
                  {game.gameState !== 'PLAYING' && (
                    <PostComposer onPost={game.addUserPost} username={game.stats.username} pfp={game.stats.pfp} />
                  )}
                  <GameScreen
                    posts={game.posts}
                    handleClassify={game.handleClassify}
                    round={game.round}
                    gameState={game.gameState}
                    startRound={game.startRound}
                    nextRound={game.nextRound}
                    unclassifiedPosts={game.unclassifiedPosts}
                    roundPosts={game.roundPosts}
                    feedback={game.feedback}
                    closeFeedback={game.closeFeedback}
                  />
                </>
              )}
              {currentView === 'profile' && (
                <ProfileScreen stats={game.stats} onClose={() => setCurrentView('feed')} />
              )}
              {currentView === 'notifications' && (
                <NotificationsView />
              )}
              {currentView === 'comments' && (
                <CommentGame />
              )}
              {currentView === 'phishing' && (
                <PhishingGame />
              )}
              {currentView === 'guide' && (
                <MisinformationGuide onPlayNow={() => setCurrentView('feed')} />
              )}
            </div>
          </>
        )}
      </main>

      {/* Desktop Right Sidebar - Can be used for stats */}
      <aside className="hidden lg:block w-[350px] p-4">
      </aside>

      {/* Mobile Bottom Navigation */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-border flex justify-around items-center z-50 py-2">
        {bottomNavItems.map((item) => {
          return (
            <div
              key={item.label}
              onClick={() => {
                setCurrentView(item.view);
              }}
              className={`p-3 transition-colors ${currentView === item.view ? 'text-accent' : 'text-text-secondary'
                } cursor-pointer`}
            >
              <item.icon size={28} />
            </div>
          );
        })}
      </footer>
    </div>
  );
}
