import type React from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasoning: string;
}

export function FeedbackModal({ isOpen, onClose, reasoning }: FeedbackModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm mx-auto border border-gray-700"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-white">Incorrect</h2>
        <p className="text-gray-300">{reasoning}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}