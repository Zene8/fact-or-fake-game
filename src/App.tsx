import { Feed } from './components/Feed';
import { useGameLoop } from './hooks/useGameLoop';
import { FeedbackModal } from './components/FeedbackModal';
import { Home, Bell, Mail, User as UserIcon, Bookmark, Settings, ShieldCheck, ShieldX, MoreHorizontal } from 'lucide-react';

function App() {
  const game = useGameLoop();

  return (
    <div className="bg-black text-white min-h-screen flex justify-center font-sans">
      <div className="max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-10 lg:grid-cols-12">
        {/* Left Sidebar */}
        <div className="col-span-2 lg:col-span-3 border-r border-gray-800 p-4 hidden md:flex flex-col justify-between items-start sticky top-0 h-screen">
          <div className="flex flex-col space-y-2 mt-4"> {/* Adjusted spacing */}
            <div className="flex items-center space-x-4 text-xl font-bold text-white cursor-pointer hover:bg-gray-900 p-3 rounded-full transition-colors duration-200"> {/* Adjusted padding */}
              <Home size={28} />
              <span>Home</span>
            </div>
            <div className="flex items-center space-x-4 text-xl text-gray-400 cursor-pointer hover:bg-gray-900 p-3 rounded-full transition-colors duration-200">
              <Bell size={28} />
              <span>Notifications</span>
            </div>
            <div className="flex items-center space-x-4 text-xl text-gray-400 cursor-pointer hover:bg-gray-900 p-3 rounded-full transition-colors duration-200">
              <Mail size={28} />
              <span>Messages</span>
            </div>
            <div className="flex items-center space-x-4 text-xl text-gray-400 cursor-pointer hover:bg-gray-900 p-3 rounded-full transition-colors duration-200">
              <Bookmark size={28} />
              <span>Bookmarks</span>
            </div>
            <div className="flex items-center space-x-4 text-xl text-gray-400 cursor-pointer hover:bg-gray-900 p-3 rounded-full transition-colors duration-200">
              <UserIcon size={28} />
              <span>Profile</span>
            </div>
            <div className="flex items-center space-x-4 text-xl text-gray-400 cursor-pointer hover:bg-gray-900 p-3 rounded-full transition-colors duration-200">
              <Settings size={28} />
              <span>Settings</span>
            </div>
          </div>
          <button className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg w-11/12 text-center transition-colors duration-200"> {/* Adjusted width */}
            Post
          </button>
          <div className="flex items-center justify-between w-full mt-8 p-2 rounded-full hover:bg-gray-900 cursor-pointer transition-colors duration-200">
            <div className="flex items-center">
              <UserIcon size={40} className="rounded-full bg-gray-700 p-2" /> {/* Placeholder for user avatar */}
              <div className="ml-3">
                <p className="font-bold text-white">Player</p>
                <p className="text-sm text-gray-400">@player</p>
              </div>
            </div>
            <MoreHorizontal className="text-gray-400" size={20} />
          </div>
        </div>

        {/* Main Feed */}
        <div className="col-span-10 md:col-span-8 lg:col-span-6 border-r border-gray-800">
          <header className="p-4 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
            <h1 className="text-xl font-bold">Home</h1>
          </header>
          <Feed
            posts={game.posts}
            handleClassify={game.handleClassify}
            viralProgress={game.viralProgress}
          />
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 p-4 hidden lg:block sticky top-0 h-screen">
          <div className="bg-gray-900 rounded-xl p-4 mt-4">
            <h2 className="font-bold text-xl mb-4">Game Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Score:</p>
                <p className="font-bold text-lg">{game.score}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Tier:</p>
                <p className="font-bold text-lg">{game.tier}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Correct:</p>
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="text-green-500" />
                  <span className="font-bold text-lg text-green-500">{game.correctCount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Incorrect:</p>
                <div className="flex items-center space-x-1">
                  <ShieldX className="text-red-500" />
                  <span className="font-bold text-lg text-red-500">{game.incorrectCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeedbackModal
        isOpen={game.feedback.isOpen}
        onClose={game.closeFeedbackModal}
        reasoning={game.feedback.reasoning}
      />
    </div>
  );
}

export default App;
