// components/OverallReview.tsx
import React from 'react';
import { ReviewDocument } from '../types/reviewTypes';

interface RatingDropdownProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  isRequired?: boolean;
}

interface OverallReviewProps {
  employee: {
    name: string;
    position: string;
    
  };
  documents?: ReviewDocument[];
  renderRatingDropdown: (props: RatingDropdownProps) => React.ReactNode;
  overallFeedback: string;
  onFeedbackChange: (feedback: string) => void;
  error?: string;
  isViewOnly: boolean;
}

const OverallReview: React.FC<OverallReviewProps> = ({
  employee,
  documents,
  renderRatingDropdown,
  overallFeedback,
  onFeedbackChange,
  error,
  isViewOnly
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Overall Performance Review</h1>
      <p className="text-gray-600 mb-6">Reviewing: {employee.name} - {employee.position}</p>

      {documents && documents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Additional Documents</h2>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center p-2 border rounded hover:bg-gray-50">
                {/* Document display code remains the same */}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overall Rating</h2>
        {renderRatingDropdown({
          value: 0,
          onChange: () => {},
          error: undefined,
          isRequired: false
        })}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overall Feedback</h2>
        <textarea
          className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded p-2 h-32`}
          placeholder="Provide comprehensive feedback on the employee's overall performance..."
          value={overallFeedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default OverallReview;