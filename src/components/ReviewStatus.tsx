// src/components/ReviewStatus.tsx
import React from 'react';
import { ReviewStatusItem } from '../types/reviewTypes';

interface ReviewStatusProps {
  items: ReviewStatusItem[];
}

const ReviewStatus: React.FC<ReviewStatusProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{item.stage}</h4>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                item.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : item.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status}
              </span>
            </div>
            {item.note && <p className="text-sm mt-1 text-gray-600">{item.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewStatus;