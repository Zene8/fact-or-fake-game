import { CheckCircle2, XCircle, Clock, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export function InstructionsScreen({ onStart }: Props) {
  const steps = [
    {
      icon: CheckCircle2,
      title: "Swipe Right for FACT",
      description: "If the post looks verified and from a reputable source, swipe right.",
      color: "text-green-500"
    },
    {
      icon: XCircle,
      title: "Swipe Left for FAKE",
      description: "Spot misinformation, bots, or spoofs? Swipe left to classify as fake.",
      color: "text-red-500"
    },
    {
      icon: Clock,
      title: "Beat the Timer",
      description: "Each round has a time limit. Classify as many as you can before time runs out.",
      color: "text-accent"
    },
    {
      icon: ShieldCheck,
      title: "Multiple Modes",
      description: "Check the bottom bar for Phishing simulations and Comment section radar.",
      color: "text-blue-500"
    },
    {
      icon: Zap,
      title: "Maintain Streaks",
      description: "Correct answers build your streak. Don't lose it by making a mistake!",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-primary p-6 items-center justify-center max-w-lg mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black mb-2 tracking-tighter">Welcome to O</h1>
        <p className="text-text-secondary font-medium">The ultimate misinformation detection training.</p>
      </div>

      <div className="space-y-6 w-full mb-10">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className={`p-2 rounded-full bg-secondary ${step.color}`}>
              <step.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{step.title}</h3>
              <p className="text-text-secondary text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full bg-text-primary text-primary py-4 rounded-full font-black text-xl hover:opacity-90 transition-all active:scale-95 shadow-xl"
      >
        Get Started
      </button>

      <p className="mt-6 text-xs text-text-secondary text-center">
        By starting, you agree to become a certified Truth Seeker.
      </p>
    </div>
  );
}
