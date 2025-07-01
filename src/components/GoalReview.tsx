import React from 'react';
import { Goal } from '../types/reviewTypes';

interface RatingDropdownProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  isRequired?: boolean;
}

interface GoalReviewProps {
  goal: Goal;
  renderRatingDropdown: (props: RatingDropdownProps) => React.ReactNode;
  error?: {
    rating?: string;
    comments?: string;
  };
  onRatingChange?: (value: number) => void;
  onCommentsChange?: (comments: string) => void;
  isViewOnly: boolean;
}

const GoalReview: React.FC<GoalReviewProps> = ({
  goal,
  renderRatingDropdown,
  error,
  onRatingChange,
  onCommentsChange,
  isViewOnly
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{goal.title}</h2>
        <p className="text-gray-700 mb-2"><strong>Description:</strong> {goal.description}</p>
        <p className="text-gray-700 mb-2"><strong>Achievement:</strong> {goal.achievement}</p>
        <p className="text-gray-700 mb-2"><strong>Self Rating:</strong> {goal.selfRating}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manager Rating</h2>
        {renderRatingDropdown({
          value: goal.managerRating || 0,
          onChange: (value) => onRatingChange && onRatingChange(value),
          error: error?.rating,
          isRequired: true
        })}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manager Comments</h2>
        <textarea
          className={`w-full border ${error?.comments ? 'border-red-500' : 'border-gray-300'} rounded p-2 h-32 text-sm`}
          placeholder="Provide specific feedback on this goal..."
          value={goal.managerComments || ''}
          onChange={(e) => onCommentsChange && onCommentsChange(e.target.value)}
          disabled={isViewOnly}
        />
        {error?.comments && <p className="text-red-500 text-xs mt-1">{error.comments}</p>}
      </div>
    </div>
  );
};

export default GoalReview;
