import React from 'react';
import { ReviewDocument } from '../types/reviewTypes';

interface OverallReviewProps {
  employee: {
    name: string;
    position: string;
  };
  documents?: ReviewDocument[];
  renderRatingDropdown: (value: number, onChange: (value: number) => void) => React.ReactNode;
  initialRating?: number;
  initialFeedback?: string;
  onRatingChange?: (rating: number) => void;
  onFeedbackChange?: (feedback: string) => void;
}

const OverallReview: React.FC<OverallReviewProps> = ({
  employee,
  documents,
  renderRatingDropdown,
  initialRating = null,
  initialFeedback = '',
  onRatingChange,
  onFeedbackChange
}) => {
  const [overallRating, setOverallRating] = React.useState<number | null>(initialRating);
  const [feedback, setFeedback] = React.useState(initialFeedback);

  const handleRatingChange = (value: number) => {
    setOverallRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFeedback(value);
    if (onFeedbackChange) {
      onFeedbackChange(value);
    }
  };

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
                <div className="mr-3 text-blue-600">
                  {doc.type === 'pdf' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.type.toUpperCase()} • {(doc.size / 1024).toFixed(1)} KB</p>
                </div>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overall Rating</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            {renderRatingDropdown(overallRating || 0, handleRatingChange)}
            <span className="text-gray-600 whitespace-nowrap">
              {overallRating ? `${overallRating}/5` : 'Not rated'}
            </span>
          </div>
          
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overall Feedback</h2>
        <textarea
          className="w-full border border-gray-300 rounded p-2 h-32"
          placeholder="Provide comprehensive feedback on the employee's overall performance..."
          value={feedback}
          onChange={handleFeedbackChange}
        />
      </div>

      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Submit Final Review
      </button>
    </div>
  );
};

export default OverallReview;