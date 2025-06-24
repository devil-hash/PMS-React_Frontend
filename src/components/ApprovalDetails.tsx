// components/ApprovalDetails.tsx
import React from 'react';
import { Approval } from '../types/reviewTypes';

type ApprovalDetailsProps = {
  approval: Approval;
  onBack: () => void;
  onApprove: (hikePercentage: number, feedback: string) => void;
  onRequestClarification: (feedback: string) => void;
};

const ApprovalDetails: React.FC<ApprovalDetailsProps> = ({
  approval,
  onBack,
  onApprove,
  onRequestClarification,
}) => {
  const [hikePercentage, setHikePercentage] = React.useState<number>(0);
  const [feedback, setFeedback] = React.useState<string>('');
  const [action, setAction] = React.useState<'none' | 'approve' | 'clarify'>('none');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{approval.employeeName}'s Review Details</h2>
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          Back to List
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Position</p>
            <p className="font-medium">{approval.position}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Salary</p>
            <p className="font-medium">₹{approval.currentSalary.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Review Type</p>
            <p className="font-medium">{approval.reviewType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Submitted</p>
            <p className="font-medium">{approval.submittedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Manager</p>
            <p className="font-medium">{approval.manager}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Overall Rating</p>
            <p className="font-medium">{approval.rating}/5</p>
          </div>
        </div>

        {/* Goals Section */}
        <div>
          <h3 className="font-semibold mb-3">Goal Assessments</h3>
          <div className="space-y-3">
            {approval.goals.map((goal, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-gray-600">{goal.comments}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Rating: {goal.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h3 className="font-semibold mb-3">Project Assessments</h3>
          <div className="space-y-3">
            {approval.projects.map((project, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.comments}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      Rating: {project.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Form */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Review Decision</h3>
          
          <div className="space-y-4">
            {action === 'approve' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hike Percentage
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={hikePercentage}
                    onChange={(e) => setHikePercentage(parseFloat(e.target.value))}
                    className="border rounded px-3 py-2 w-24"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback/Comments
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                rows={3}
                placeholder="Enter your feedback or comments..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            {action === 'none' ? (
              <>
                <button 
                  onClick={() => setAction('approve')}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button 
                  onClick={() => setAction('clarify')}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Request Clarification
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    if (action === 'approve') {
                      onApprove(hikePercentage, feedback);
                    } else {
                      onRequestClarification(feedback);
                    }
                  }}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Confirm {action === 'approve' ? 'Approval' : 'Request'}
                </button>
                <button 
                  onClick={() => setAction('none')}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetails;