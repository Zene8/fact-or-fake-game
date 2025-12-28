import { useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { GameScreen } from './components/GameScreen';
import { FeedbackModal } from './components/FeedbackModal';
import { ProfileScreen } from './components/ProfileScreen';
import { PostComposer } from './components/PostComposer';
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/Avatar';
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

const XLogo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current text-text-primary">
    <g>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </g>
  </svg>
);

export default function App() {
  const game = useGameLoop();
  const [currentView, setCurrentView] = useState('feed');

  const startGame = () => {
    game.setGameState('PLAYING');
  };

  if (game.gameState === 'START') {
    return (
      <div className="h-screen bg-primary flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <div className="mb-6 animate-pulse">
          <Circle size={80} strokeWidth={3} className="text-accent" />
        </div>
        <h1 className="text-7xl font-black text-text-primary mb-2 tracking-tighter">PROJECT O</h1>
        <p className="text-text-secondary mb-8 max-w-sm text-lg font-medium">
          The disinformation swarm is evolving. Filter the feed, protect the truth, and maintain your credibility.
        </p>
        <button 
          onClick={startGame} 
          className="bg-accent text-white px-12 py-4 rounded-full font-bold text-xl hover:opacity-90 transition-opacity active:scale-95"
        >
          Initialize Feed
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
    <div className="min-h-screen bg-primary text-text-primary flex justify-center font-sans">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-[88px] xl:w-[275px] sticky top-0 h-screen p-2 xl:p-3 border-r border-border">
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
      <main className="w-full max-w-[600px] border-r border-l border-border min-h-screen relative pb-24 md:pb-0">
        {currentView === 'feed' && (
          <>
            <header className="sticky top-0 z-20 bg-primary/80 backdrop-blur-md border-b border-border">
              <div className="flex items-center justify-between px-4 py-2">
                <Avatar>
                  <AvatarImage src="/src/assets/react.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <XLogo />
                <button className="bg-black text-white px-4 py-1.5 rounded-full font-bold text-sm border border-white/50">
                  Subscribe
                </button>
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
            <PostComposer />
            {game.posts.length > 0 ? (
              <GameScreen 
                posts={game.posts} 
                handleClassify={game.handleClassify} 
                loadMorePosts={game.loadMorePosts}
              />
            ) : (
              <div className="text-center p-10 text-text-secondary">Loading next round...</div>
            )}
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
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-border flex justify-around items-center z-10">
        {bottomNavItems.map((item) => (
          <div 
            key={item.label} 
            onClick={() => item.view && setCurrentView(item.view)}
            className={`p-3 transition-colors ${currentView === item.view ? 'text-accent' : 'text-text-secondary'}`}
          >
            <item.icon size={28} />
          </div>
        ))}
      </footer>

      <FeedbackModal 
        isOpen={game.feedback.isOpen} 
        reasoning={game.feedback.reasoning} 
        onClose={() => game.setFeedback({ ...game.feedback, isOpen: false })} 
      />
    </div>
  );
}