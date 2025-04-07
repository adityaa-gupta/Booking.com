'use client';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiService from '@/app/_lib/services/ApiService';
import useAuthStore from '@/app/_store/useAuthStore';
import ReviewModal from './ReviewModal';

const ReviewSection = ({ eventId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await ApiService.fetchReviewsByEventId(eventId);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching event reviews:', error.message);
      }
    };
    fetchReviews();
  }, [eventId]);

  const handleSubmitReview = async ({ rating, reviewText }) => {
    if (!isAuthenticated) {
      toast.warning('Please log in to submit a review.');
      return;
    }

    try {
      setSubmitLoading(true);
      const reviewData = {
        eventId: parseInt(eventId),
        score: rating,
        review: reviewText,
      };

      const response = await ApiService.postReview(reviewData);

      const newReview = {
        id: response?.id || Date.now(),
        username: user?.firstName || 'You',
        score: rating,
        review: reviewText,
        imageUrl:
          user?.imageUrl ||
          'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
      };

      setReviews([newReview, ...reviews]);
      setShowReviewModal(false);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Error submitting review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-[#255F38] mb-8">
        What People Say
      </h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-3 pb-3 border-b">
                <img
                  src={review.imageUrl}
                  alt={review.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{review.username}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.score ? 'text-[#255F38]' : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4">{review.review}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p>No reviews yet. Be the first to review!</p>
      )}
      <button
        onClick={() => setShowReviewModal(true)}
        className="mt-6 px-6 py-2 bg-[#255F38] text-white rounded-full"
      >
        Write a Review
      </button>
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        submitLoading={submitLoading}
      />
    </div>
  );
};

export default ReviewSection;
