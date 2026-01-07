import { useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { GameScreen } from './components/GameScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PostComposer } from './components/PostComposer';
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/Avatar';
import { RoundTimer } from './components/ui/RoundTimer';
import {
  LayoutGrid,
  User,
  Circle,
  Home,
  Search,
  Users,
  Bell,
  Mail,
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
        <h1 className="text-7xl font-black text-text-primary mb-2 tracking-tighter">Game Over</h1>
        <p className="text-text-secondary mb-8 max-w-sm text-lg font-medium">
          Your final score is: {game.score}
        </p>
        <button
          onClick={restartGame}
          className="bg-accent text-white px-12 py-4 rounded-full font-bold text-xl hover:opacity-90 transition-opacity active:scale-95"
        >
          Play Again
        </button>
      </div>
    );
  }

  const sidebarNavItems = [
    { icon: LayoutGrid, label: 'Feed', view: 'feed' },
    { icon: User, label: 'Profile', view: 'profile' },
  ];

  const bottomNavItems = [
    { icon: Home, label: 'Home', view: 'feed' },
    { icon: Search, label: 'Search', view: 'search' },
    { icon: Users, label: 'Communities', view: 'communities' },
    { icon: Bell, label: 'Notifications', view: 'notifications' },
    { icon: Mail, label: 'Messages', view: 'messages' },
  ];

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
        {currentView === 'feed' && (
          <>
            <header className="flex-shrink-0 bg-primary/80 backdrop-blur-md border-b border-border z-20">
              <div className="flex items-center justify-between px-4 py-2">
                <Avatar>
                  <AvatarImage src="/src/assets/react.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <OLogo />
                <div className="text-text-primary font-bold text-lg">
                  Score: {game.score}
                </div>
              </div>
              <nav className="flex">
                <div className="flex-1 text-center py-3 font-bold border-b-4 border-accent">
                  For you
                </div>
                <div className="flex-1 text-center py-3 text-text-secondary">
                  Following
                </div>
              </nav>
            </header>
            {game.gameState === 'PLAYING' && (
              <div className="flex-shrink-0 z-30">
                <RoundTimer timeLeft={game.timer} roundDuration={game.roundDuration} />
              </div>
            )}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
              <PostComposer />
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
            </div>
          </>
        )}
        {currentView === 'profile' && (
          <ProfileScreen stats={game.stats} onClose={() => setCurrentView('feed')} />
        )}
      </main>

      {/* Desktop Right Sidebar - Can be used for stats */}
      <aside className="hidden lg:block w-[350px] p-4">
      </aside>

      {/* Mobile Bottom Navigation */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-border flex justify-around items-center z-50 py-2">
        {bottomNavItems.map((item) => {
          const isActive = item.view === 'feed' || item.view === 'profile';
          return (
            <div
              key={item.label}
              onClick={() => {
                if (item.view === 'feed' || item.view === 'profile') {
                  setCurrentView(item.view);
                }
              }}
              className={`p-3 transition-colors ${
                currentView === item.view ? 'text-accent' : isActive ? 'text-text-secondary' : 'text-text-secondary/40'
              } ${isActive ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <item.icon size={28} />
            </div>
          );
        })}
      </footer>
    </div>
  );
}
