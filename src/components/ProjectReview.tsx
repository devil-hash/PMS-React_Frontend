import React from 'react';
import { Project } from '../types/reviewTypes';

interface ProjectReviewProps {
  project: Project;
  renderRatingDropdown: (value: number, onChange: (value: number) => void) => React.ReactNode;
}

const ProjectReview: React.FC<ProjectReviewProps> = ({ project, renderRatingDropdown }) => {
  const [managerRating, setManagerRating] = React.useState<number | null>(project.managerRating || null);
  const [comments, setComments] = React.useState(project.managerComments || '');

  const handleRatingChange = (value: number) => {
    setManagerRating(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-2"><strong>Role:</strong> {project.role}</p>
      <p className="text-gray-600 mb-4"><strong>Self-rated:</strong> {project.selfRating}/5</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Project Description</h2>
        <p className="text-gray-700">{project.description}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Employee's Impact</h2>
        <p className="text-gray-700">{project.impact}</p>
      </div>

      {project.documents && project.documents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Attached Documents</h2>
          <div className="space-y-2">
            {project.documents.map((doc) => (
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
        <h2 className="text-xl font-semibold mb-2">Manager Rating</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            {renderRatingDropdown(managerRating || 0, handleRatingChange)}
            <span className="text-gray-600 whitespace-nowrap">
              {managerRating ? `${managerRating}/5` : 'Not rated'}
            </span>
          </div>
          
          
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manager Comments</h2>
        <textarea
          className="w-full border border-gray-300 rounded p-2 h-32"
          placeholder="Provide specific feedback on this project..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Save Review
      </button>
    </div>
  );
};

export default ProjectReview;