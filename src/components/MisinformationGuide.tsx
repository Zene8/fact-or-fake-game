
import { motion } from 'framer-motion';
import { ShieldAlert, Search, AlertTriangle, FileText, CheckCircle, ArrowRight } from 'lucide-react';


interface MisinformationGuideProps {
    onPlayNow: () => void;
}

export function MisinformationGuide({ onPlayNow }: MisinformationGuideProps) {
    const tips = [
        // ... (keep existing tips)
        {
            icon: Search,
            title: "Verify the Source",
            description: "Check the domain name carefully. Imitator sites often use slight misspellings (e.g., 'bbc-news.co' instead of 'bbc.com'). Look for an 'About Us' section to understand the organization's mission.",
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            icon: AlertTriangle,
            title: "Check Your Emotions",
            description: "Misinformation is designed to trigger strong emotional reactions—fear, anger, or shock. If a headline makes you feel intense emotion, pause and verify before sharing.",
            color: "text-red-400",
            bg: "bg-red-400/10"
        },
        {
            icon: FileText,
            title: "Read Beyond the Headline",
            description: "Headlines are often clickbait. Read the full article to see if the content actually supports the sensational claim in the title.",
            color: "text-yellow-400",
            bg: "bg-yellow-400/10"
        },
        {
            icon: ShieldAlert,
            title: "Inspect Visuals",
            description: "AI-generated images often have tell-tale signs: distorted hands, uneven textures, or background inconsistencies. Use reverse image search to find the original source.",
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        },
        {
            icon: CheckCircle,
            title: "Cross-Reference",
            description: "If a story is breaking news, check if other major, reputable news outlets are reporting it. If only one obscure site has the 'scoop', be skeptical.",
            color: "text-green-400",
            bg: "bg-green-400/10"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex-1 flex flex-col bg-primary h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 pb-24 md:pb-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-black tracking-tighter mb-2 flex items-center gap-3">
                        <span className="bg-accent text-primary p-2 rounded-lg">
                            <ShieldAlert size={28} />
                        </span>
                        Spot the Fake
                    </h1>
                    <p className="text-text-secondary font-medium text-lg leading-relaxed">
                        Master the art of identifying misinformation in the digital age. Use these five pillars of verification.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {tips.map((tip, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="bg-secondary/50 border border-border rounded-2xl p-5 hover:bg-secondary transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${tip.bg} ${tip.color} shrink-0`}>
                                    <tip.icon size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">{tip.title}</h3>
                                    <p className="text-text-secondary leading-relaxed">
                                        {tip.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 bg-accent/10 border border-accent/20 rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
                    onClick={onPlayNow}
                >
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg text-accent mb-2">Ready to practice?</h3>
                        <p className="text-text-secondary mb-4">
                            Apply these skills in the main feed to boost your detection score.
                        </p>
                        <button
                            className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all"
                        >
                            Play Now <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
