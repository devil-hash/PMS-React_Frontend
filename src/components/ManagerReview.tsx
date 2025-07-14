import React, { useState } from 'react';

interface ReviewItem {
  id: number;
  employeeName: string;
  selfRating: number;
  managerRating?: number;
  feedback?: string;
  status: 'pending' | 'completed';
}

const ManagerReview: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 1,
      employeeName: 'John Doe',
      selfRating: 4,
      status: 'pending'
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      selfRating: 3,
      status: 'pending'
    }
  ]);

  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [managerRating, setManagerRating] = useState<number>(3);
  const [feedback, setFeedback] = useState<string>('');

  const handleReviewSelect = (review: ReviewItem) => {
    setSelectedReview(review);
    setManagerRating(review.selfRating);
    setFeedback(review.feedback || '');
  };

  const submitFeedback = () => {
    if (!selectedReview) return;
    
    const updatedReviews = reviews.map(review => {
      if (review.id === selectedReview.id) {
        return {
          ...review,
          managerRating,
          feedback,
          status: 'completed' as const // Explicitly type this as 'completed'
        };
      }
      return review;
    });
    
    setReviews(updatedReviews);
    setSelectedReview(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Employee Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Pending Reviews</h3>
          <div className="space-y-2">
            {reviews.filter(r => r.status === 'pending').map(review => (
              <div 
                key={review.id} 
                className={`p-3 border rounded cursor-pointer ${selectedReview?.id === review.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => handleReviewSelect(review)}
              >
                <p className="font-medium">{review.employeeName}</p>
                <p className="text-sm text-gray-600">Self Rating: {review.selfRating}/5</p>
              </div>
            ))}
          </div>
        </div>
        
        {selectedReview && (
          <div>
            <h3 className="font-medium mb-2">Provide Feedback</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={managerRating}
                onChange={(e) => setManagerRating(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            <button
              onClick={submitFeedback}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerReview;