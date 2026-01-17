import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Search, AlertTriangle, FileText, CheckCircle, ArrowRight, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';


interface MisinformationGuideProps {
    onPlayNow: () => void;
}

export function MisinformationGuide({ onPlayNow }: MisinformationGuideProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const tips = [
        {
            icon: Search,
            title: "Verify the Source",
            description: "Check the domain name carefully. Imitator sites often use slight misspellings.",
            example: "You see a breaking news story on 'bbc-news.co.uk.net'. The real BBC is 'bbc.co.uk'. The extra '.net' indicates it's a clone site designed to fool you.",
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            icon: AlertTriangle,
            title: "Check Your Emotions",
            description: "Misinformation is designed to trigger strong emotional reactions—fear, anger, or shock.",
            example: "A headline screams 'WARNING: New virus killing thousands instantly!' It uses all caps and fear to make you panic-share without checking the facts first.",
            color: "text-red-400",
            bg: "bg-red-400/10"
        },
        {
            icon: FileText,
            title: "Read Beyond the Headline",
            description: "Headlines are often clickbait. Read the full article to see if the content supports the claim.",
            example: "Headline: 'Scientists Prove Chocolate Cures Cancer'. Actual Article: '...a compound in chocolate showed promise in a limited petri dish test, but it is not a cure.'",
            color: "text-yellow-400",
            bg: "bg-yellow-400/10"
        },
        {
            icon: ShieldAlert,
            title: "Inspect Visuals",
            description: "AI-generated images often have tell-tale signs: distorted hands, uneven textures, or inconsistencies.",
            example: "A viral photo of a protest shows a person with 6 fingers on one hand and text on a sign that looks like blurred gibberish—classic signs of AI generation.",
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        },
        {
            icon: CheckCircle,
            title: "Cross-Reference",
            description: "If a story is breaking news, check if other major, reputable news outlets are reporting it.",
            example: "A random blog claims aliens landed in London. You check CNN, BBC, and Sky News, and none of them mention it. If it were real, everyone would be covering it.",
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
                        Master the art of identifying misinformation. Tap a card to see an example.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {tips.map((tip, index) => {
                        const isExpanded = expandedIndex === index;
                        return (
                            <motion.div
                                key={index}
                                variants={item}
                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                className={`
                                    border border-border rounded-2xl p-5 cursor-pointer transition-all duration-300
                                    ${isExpanded ? 'bg-secondary ring-1 ring-accent' : 'bg-secondary/50 hover:bg-secondary'}
                                `}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${tip.bg} ${tip.color} shrink-0`}>
                                        <tip.icon size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-xl mb-1">{tip.title}</h3>
                                            {isExpanded ? <ChevronUp size={20} className="text-text-secondary" /> : <ChevronDown size={20} className="text-text-secondary" />}
                                        </div>
                                        <p className="text-text-secondary leading-relaxed">
                                            {tip.description}
                                        </p>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="bg-primary/50 rounded-xl p-4 border border-border/50">
                                                        <div className="flex gap-3 mb-2">
                                                            <Lightbulb className="text-accent shrink-0" size={20} />
                                                            <span className="text-accent font-bold text-sm uppercase tracking-wider">Example</span>
                                                        </div>
                                                        <p className="text-text-primary text-sm leading-relaxed italic">
                                                            "{tip.example}"
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
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
