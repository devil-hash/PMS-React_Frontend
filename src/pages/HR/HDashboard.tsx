import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import ReviewCycleList from '../../components/ReviewCycleList';
import HRReportsChart from '../../components/HRReportsChart';
import { HikeForm, HikeCycle, Approval, DashboardStat } from '../../types/reviewTypes';
import HikePublish from '../../components/HikePublish';

const PendingApprovalsList: React.FC<{
  approvals: Approval[];
  onViewClick: (approval: Approval) => void;
}> = ({ approvals, onViewClick }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {approvals.map((approval) => (
          <tr key={approval.id} className="hover:bg-gray-50">
            <td className="px-6 py-4">{approval.employeeName}</td>
            <td className="px-6 py-4">{approval.position}</td>
            <td className="px-6 py-4">{approval.manager}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 text-xs rounded-full ${
                approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                approval.status === 'needs-clarification' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {approval.status.replace('-', ' ')}
              </span>
            </td>
            <td className="px-6 py-4">
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

const ApprovalDetails: React.FC<{
  approval: Approval;
  onBack: () => void;
  onApprove: (hikePercentage: number, feedback: string) => void;
  onRequestClarification: (feedback: string) => void;
}> = ({ approval, onBack, onApprove, onRequestClarification }) => {
  const [hikePercentage, setHikePercentage] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [action, setAction] = useState<'none' | 'approve' | 'clarify'>('none');

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
                  <span className="ml-4 text-sm text-gray-600">
                    New Salary: ₹{(approval.currentSalary * (1 + hikePercentage/100)).toLocaleString()}
                  </span>
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

const reviewCycles: HikeCycle[] = [
  {
    id: 1,
    title: "Annual Review 2025",
    name: "Annual Review 2025",
    status: "completed",
    type: "Annual",
    period: "Jan 2025 - Mar 2025",
    dueDate: "2025-03-31",
    participants: 50,
    completed: 45,
    pending: 5,
    progress: 90,
    milestones: []
  },
  {
    id: 2,
    title: "Mid-Year Review",
    name: "Mid-Year Review",
    status: "active",
    type: "Mid-term",
    period: "Jul 2025 - Aug 2025",
    dueDate: "2025-08-15",
    participants: 40,
    completed: 20,
    pending: 20,
    progress: 50,
    milestones: []
  }
];

const pendingApprovals: Approval[] = [
  {
    id: 101,
    employeeName: "John Doe",
    position: "Software Engineer",
    manager: "Alice Smith",
    currentSalary: 600000,
    reviewType: "Annual",
    submittedDate: "2025-03-15",
    rating: 4.5,
    status: "pending",
    hikePercentage: 0,
    feedback: "",
    goals: [
      {
        title: "Improve Code Quality",
        comments: "Consistently followed best practices.",
        rating: 4
      },
      {
        title: "Reduce Bugs",
        comments: "Bug count reduced by 30%.",
        rating: 5
      }
    ],
    projects: [
      {
        title: "Migration to React",
        comments: "Successfully migrated frontend to React.",
        rating: 5
      }
    ]
  }
];

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cycles' | 'approvals' | 'reports' | 'hikePublish'>('cycles');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [quickAction, setQuickAction] = useState<'none' | 'template' | 'report'>('none');
  const [approvals, setApprovals] = useState<Approval[]>(pendingApprovals);
  const [forms, setForms] = useState<HikeForm[]>([]);

  const stats: DashboardStat[] = [
    { title: 'Active Cycles', value: 2, trend: 'up', icon: '🔄' },
    { title: 'Employees to Review', value: 15, trend: 'down', icon: '👥' },
    { title: 'Pending Approvals', value: approvals.filter(a => a.status === 'pending').length, trend: 'up', icon: '⏳' },
    { title: 'Completed Reviews', value: 32, trend: 'up', icon: '✅' },
  ];

  const handleSave = (form: HikeForm) => {
    setForms(prevForms => {
      const existingIndex = prevForms.findIndex(f => f.id === form.id);
      if (existingIndex >= 0) {
        const updatedForms = [...prevForms];
        updatedForms[existingIndex] = form;
        return updatedForms;
      } else {
        return [...prevForms, form];
      }
    });
  };

  const handleLaunch = (form: HikeForm) => {
    alert(`Launching hike form: ${form.title}`);
    setForms(prevForms => 
      prevForms.map(f => 
        f.id === form.id ? { ...form, status: 'pending_approval' } : f
      )
    );
  };

  const handleHomeClick = () => {
    navigate('/hr', { replace: true });
  };

  const handleTabChange = (tab: 'cycles' | 'approvals' | 'reports' | 'hikePublish') => {
    setActiveTab(tab);
    setSelectedApproval(null);
  };

  const handleViewApproval = (approval: Approval) => {
    setSelectedApproval(approval);
  };

  const handleApprove = (hikePercentage: number, feedback: string) => {
    if (!selectedApproval) return;
    
    setApprovals(prev => 
      prev.map(a => 
        a.id === selectedApproval.id 
          ? { 
              ...a, 
              status: 'approved', 
              hikePercentage,
              feedback,
              newSalary: a.currentSalary * (1 + hikePercentage/100)
            } 
          : a
      )
    );
    
    setSelectedApproval(null);
    alert(`Approved with ${hikePercentage}% hike!`);
  };

  const handleRequestClarification = (feedback: string) => {
    if (!selectedApproval) return;
    
    setApprovals(prev => 
      prev.map(a => 
        a.id === selectedApproval.id 
          ? { ...a, status: 'needs-clarification', feedback } 
          : a
      )
    );
    
    setSelectedApproval(null);
    alert('Clarification requested!');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onHomeClick={handleHomeClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">HR Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <DashboardCard key={index} {...stat} />
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex border-b mb-6">
              <button
                className={`py-2 px-4 ${activeTab === 'cycles' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => handleTabChange('cycles')}
              >
                Hike Cycles
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'approvals' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => handleTabChange('approvals')}
              >
                Hike Approvals ({approvals.filter(a => a.status === 'pending').length})
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'hikePublish' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => handleTabChange('hikePublish')}
              >
                Hike Publish
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => handleTabChange('reports')}
              >
                Reports & Analytics
              </button>
            </div>

            {activeTab === 'cycles' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Performance Review Cycles</h2>
                <ReviewCycleList cycles={reviewCycles} />
              </div>
            )}

            {activeTab === 'approvals' && (
              <div>
                {selectedApproval ? (
                  <ApprovalDetails
                    approval={selectedApproval}
                    onBack={() => setSelectedApproval(null)}
                    onApprove={handleApprove}
                    onRequestClarification={handleRequestClarification}
                  />
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
                    <PendingApprovalsList 
                      approvals={approvals.filter(a => a.status === 'pending')} 
                      onViewClick={handleViewApproval} 
                    />
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'hikePublish' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Publish Hike</h2>
                <HikePublish 
                  forms={forms} 
                  pendingApprovals={forms.filter(f => f.status === 'pending_approval')}
                  onSave={handleSave} 
                  onPublish={handleLaunch} 
                  onApprove={(formId) => {
                    setForms(prevForms => 
                      prevForms.map(f => 
                        f.id === formId ? { ...f, status: 'approved' } : f
                      )
                    );
                    alert(`Approved form ${formId}`);
                  }} 
                  onReject={(formId, reason) => {
                    setForms(prevForms => 
                      prevForms.map(f => 
                        f.id === formId ? { ...f, status: 'rejected' } : f
                      )
                    );
                    alert(`Rejected form ${formId} because: ${reason}`);
                  }} 
                />
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Review Analytics</h2>
                <HRReportsChart />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;