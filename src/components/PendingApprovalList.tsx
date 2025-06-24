import React from 'react';
import { Approval } from '../types/reviewTypes';

interface Props {
  approvals: Approval[];
  onViewClick: (approval: Approval) => void;
}

const PendingApprovalsList: React.FC<Props> = ({ approvals, onViewClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Salary</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {approvals.map((approval) => (
            <tr key={approval.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{approval.employeeName}</div>
                    <div className="text-sm text-gray-500">{approval.reviewType}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{approval.position}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ₹{approval.currentSalary.toLocaleString('en-IN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {approval.rating}/5
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => onViewClick(approval)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingApprovalsList;