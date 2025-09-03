import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isLoading: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim() && !isLoading) {
      onSubmit(reason.trim());
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <FiX size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Provide Feedback</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Please explain why this response was not helpful. This feedback will be used to improve the AI.</p>
          
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., The information was incorrect, the plan was inefficient, etc."
            disabled={isLoading}
            className="w-full p-2 border rounded-md text-sm resize-none bg-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
            rows={4}
            autoFocus
          />
          
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !reason.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
