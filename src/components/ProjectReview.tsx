import React from 'react';
import { Project } from '../types/reviewTypes';

interface RatingDropdownProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  isRequired?: boolean;
}

interface ProjectReviewProps {
  project: Project;
  renderRatingDropdown: (props: RatingDropdownProps) => React.ReactNode;
  isViewOnly: boolean;
  error?: {
    rating?: string;
    comments?: string;
  };
  onRatingChange?: (value: number) => void;
  onCommentsChange?: (comments: string) => void;
}

const ProjectReview: React.FC<ProjectReviewProps> = ({
  project,
  renderRatingDropdown,
  isViewOnly,
  error,
  onRatingChange,
  onCommentsChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Example of Project display */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
        <p className="text-gray-700 mb-2"><strong>Description:</strong> {project.description}</p>
        <p className="text-gray-700 mb-2"><strong>Impact:</strong> {project.impact}</p>
        <p className="text-gray-700 mb-2"><strong>Role:</strong> {project.role}</p>
        <p className="text-gray-700 mb-2"><strong>Self Rating:</strong> {project.selfRating}</p>

      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manager Rating</h2>
        {renderRatingDropdown({
          value: project.managerRating || 0,
          onChange: (value) => onRatingChange && onRatingChange(value),
          error: error?.rating,
          isRequired: true,
        })}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manager Comments</h2>
        <textarea
          className={`w-full border ${error?.comments ? 'border-red-500' : 'border-gray-300'} rounded p-2 h-32`}
          placeholder="Provide specific feedback on this project..."
          value={project.managerComments || ''}
          onChange={(e) => onCommentsChange && onCommentsChange(e.target.value)}
          disabled={isViewOnly}
        />
        {error?.comments && <p className="text-red-500 text-xs mt-1">{error.comments}</p>}
      </div>
    </div>
  );
};

export default ProjectReview;
