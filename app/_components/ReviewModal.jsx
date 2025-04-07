'use client';
import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaTimesCircle } from 'react-icons/fa';

const ReviewModal = ({ isOpen, onClose, onSubmit, submitLoading }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  const handleSubmit = () => {
    if (rating === 0 || !reviewText.trim()) return;
    onSubmit({ rating, reviewText });
    setRating(0);
    setReviewText('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black opacity-60 backdrop-blur-sm"></div>
      <div
        className="relative z-50 bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#255F38]">Write a Review</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-[#255F38]"
          >
            <FaTimesCircle size={20} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-[#443627] mb-2">Rate your experience:</p>
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? (
                  <FaStar className="text-[#255F38] text-2xl" />
                ) : (
                  <FaRegStar className="text-[#255F38] text-2xl" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            className="w-full min-h-[100px] p-3 border text-black border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitLoading || rating === 0 || !reviewText.trim()}
          className={`w-full py-3 rounded-lg font-medium text-white ${
            submitLoading || rating === 0 || !reviewText.trim()
              ? 'bg-gray-400'
              : 'bg-gradient-to-r from-[#255F38] to-[#1D4D34]'
          }`}
        >
          {submitLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
