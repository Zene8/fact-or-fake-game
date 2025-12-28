import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  reasoning: string;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, reasoning, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-zinc-900 rounded-2xl max-w-md w-full shadow-xl border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-lg">Analysis</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-zinc-300 whitespace-pre-wrap">{reasoning}</p>
            </div>
            <div className="p-4 border-t border-zinc-800">
              <button 
                onClick={onClose}
                className="w-full py-2.5 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
