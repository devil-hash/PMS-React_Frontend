import React from 'react';
import { Approval, FormApproval } from '../types/reviewTypes';

interface Props {
  approvals: Approval[];
  formApprovals: FormApproval[];
  onViewClick: (approval: Approval) => void;
  onViewFormClick: (formApproval: FormApproval) => void;
  onApproveForm: (formId: number) => void;
  onRejectForm: (formId: number, reason: string) => void;
}

const PendingApprovalsList: React.FC<Props> = ({ 
  approvals, 
  formApprovals,
  onViewClick,
  onViewFormClick,
  onApproveForm,
  onRejectForm
}) => {
  const [rejectReason, setRejectReason] = React.useState('');
  const [formToReject, setFormToReject] = React.useState<number | null>(null);

  const handleRejectClick = (formId: number) => {
    setFormToReject(formId);
  };

  const confirmReject = () => {
    if (formToReject && rejectReason.trim()) {
      onRejectForm(formToReject, rejectReason);
      setFormToReject(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Employee Hike Approvals Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Employee Hike Approvals</h3>
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
              {approvals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending hike approvals
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Approvals Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Form Approvals</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formApprovals.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{form.title}</div>
                    <div className="text-sm text-gray-500">{form.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {form.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {form.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(form.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      form.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      form.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {form.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onViewFormClick(form)}
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => onApproveForm(form.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRejectClick(form.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {formApprovals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending form approvals
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reject Reason Modal */}
        {formToReject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Reason for Rejection</h3>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={4}
                placeholder="Enter reason for rejecting this form..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setFormToReject(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={confirmReject}
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovalsList;