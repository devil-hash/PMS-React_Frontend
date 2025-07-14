import React from 'react';
import { Review } from '../types/reviewTypes';

interface EmployeeReviewListProps {
  title: string;
  reviews: Review[];
  status: 'pending' | 'completed';
  onReviewClick: (review: Review, isCompleted: boolean) => void;
}

const EmployeeReviewList: React.FC<EmployeeReviewListProps> = ({ 
  title, 
  reviews, 
  status,
  onReviewClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No {status} reviews</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div 
              key={review.id} 
              className="flex justify-between items-center p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium">{review.name}</p>
                <p className="text-sm text-gray-600">{review.position}</p>
                <p className="text-sm text-gray-600">Self Rating: {review.selfRating}/5</p>
                {status === 'completed' && review.managerRating && (
                  <p className="text-sm text-gray-600">Your Rating: {review.managerRating}/5</p>
                )}
              </div>
              <div className="text-right">
                {status === 'pending' && review.deadline && (
                  <p className="text-sm text-red-600">Due: {review.deadline}</p>
                )}
                <button 
                  className={`mt-2 py-1 px-3 rounded text-sm ${
                    status === 'pending' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => onReviewClick(review, status === 'completed')}
                >
                  {status === 'pending' ? 'Review Now' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeReviewList;