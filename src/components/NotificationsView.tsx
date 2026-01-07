import { Award, Zap, RefreshCw } from 'lucide-react';

export function NotificationsView() {
  const notifications = [
    {
      id: 1,
      icon: Zap,
      title: "Streak Reminder",
      description: "Don't lose your 5-day streak! Play a round now.",
      time: "2h ago",
      color: "text-yellow-500"
    },
    {
      id: 2,
      icon: Award,
      title: "New Highscore!",
      description: "You reached a new personal best of 4,500 points.",
      time: "5h ago",
      color: "text-accent"
    },
    {
      id: 3,
      icon: RefreshCw,
      title: "App Update",
      description: "Phishing simulation mode is now available!",
      time: "1d ago",
      color: "text-green-500"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-primary">
      <header className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Notifications</h2>
      </header>
      <div className="flex-1 overflow-y-auto">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 border-b border-border flex gap-4 hover:bg-secondary transition-colors cursor-pointer">
            <div className={`p-2 rounded-full bg-secondary ${n.color}`}>
              <n.icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{n.title}</h3>
                <span className="text-xs text-text-secondary">{n.time}</span>
              </div>
              <p className="text-text-secondary text-sm mt-1">{n.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
