import React from 'react';
import { Goal } from '../types/reviewTypes';

interface GoalReviewProps {
  goal: Goal;
}

const GoalReview: React.FC<GoalReviewProps> = ({ goal }) => {
  const [managerRating, setManagerRating] = React.useState<number | null>(null);
  const [comments, setComments] = React.useState('');

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setManagerRating(isNaN(value) ? null : Math.min(Math.max(value, 1), 5));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">{goal.title}</h1>
      <p className="text-gray-600 mb-4"><strong>Self-rated:</strong> {goal.selfRating}/5</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Goal Description</h2>
        <p className="text-gray-700">{goal.description}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Employee's Achievement</h2>
        <p className="text-gray-700">{goal.achievement}</p>
      </div>

      {goal.documents && goal.documents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Attached Documents</h2>
          <div className="space-y-2">
            {goal.documents.map((doc) => (
              <div key={doc.id} className="flex items-center p-2 border rounded hover:bg-gray-50">
                <div className="mr-3 text-blue-600 flex-shrink-0">
                  {doc.type === 'pdf' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500 truncate">{doc.type.toUpperCase()} • {(doc.size / 1024).toFixed(1)} KB</p>
                </div>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manager Rating</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={managerRating || ''}
              onChange={handleRatingChange}
              className="border border-gray-300 rounded p-2 w-20"
              placeholder="1.0-5.0"
            />
            <span className="text-gray-600 whitespace-nowrap text-sm">
              {managerRating ? `${managerRating}/5` : 'Not rated'}
            </span>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-xs w-full sm:w-auto">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <span className="font-medium whitespace-nowrap">5.0</span>
              <span className="whitespace-nowrap">Outstanding</span>
              <span className="font-medium whitespace-nowrap">4.0-4.9</span>
              <span className="whitespace-nowrap">Excellent</span>
              <span className="font-medium whitespace-nowrap">3.0-3.9</span>
              <span className="whitespace-nowrap">Good</span>
              <span className="font-medium whitespace-nowrap">2.0-2.9</span>
              <span className="whitespace-nowrap">Needs Improvement</span>
              <span className="font-medium whitespace-nowrap">1.0-1.9</span>
              <span className="whitespace-nowrap">Poor</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manager Comments</h2>
        <textarea
          className="w-full border border-gray-300 rounded p-2 h-32 text-sm"
          placeholder="Provide specific feedback on this goal..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm">
        Save Review
      </button>
    </div>
  );
};

export default GoalReview;