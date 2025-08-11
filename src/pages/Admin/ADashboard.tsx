import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import NewHikeCycleForm from '../../components/HikeForm';
import HikeCycleList from '../../components/HikeCycleList';
import PieChart from '../../components/PieChart';
import ApprovalDetails from '../../components/ApprovalDetails';
import TemplateManager from '../../components/TemplateManager';
import { FaFileCsv, FaFilter, FaSearch, FaChartBar, FaChartLine, FaChartPie, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import { HikeCycle, DashboardStat, Approval } from '../../types/reviewTypes';
import { v4 as uuidv4 } from 'uuid';
import { HikeForm, HikeFormField, ApprovalLevel, HikeFormFieldType } from '../../types/reviewTypes';
import { HikeCycleForm } from '../../components/HikeForm';
export type FormStatus = 'pending_approval' | 'published';


const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "forms" | "review-cycles" | "reports" | "approvals" | "settings" | "users" | "templates" | "performance-review" |"assessments"| "reviews"
  >("dashboard");

const [formToReject, setFormToReject] = useState<number | null>(null);

  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState<number>(1);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectReason, setRejectReason] = useState('');
const [formToEdit, setFormToEdit] = useState<HikeCycleForm | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newFieldType, setNewFieldType] = useState<HikeFormFieldType>('text');
  const [newApprovalLevel, setNewApprovalLevel] = useState<Omit<ApprovalLevel, 'level'>>({
    title: '',
    approvers: [],
    isFinalApproval: false
  });
  const userDepartment = "Human Resource"; // or get from auth/user context
const userRole = "Admin";
const [pendingApprovals, setPendingApprovals] = useState<HikeCycleForm[]>([]);
const [activeForm, setActiveForm] = useState<HikeCycleForm | null>(null);
  // Sample data
  const existingForms = [
    { id: 1, name: 'Annual Review 2024', createdBy: 'Admin', createdOn: '2024-01-10' },
    { id: 2, name: 'Mid-Year Review 2024', createdBy: 'Admin', createdOn: '2024-06-10' }
  ];

  const hikeCycles: HikeCycle[] = [
    {
      title: "Annual Review 2024",
      id: 1,
      name: "Annual Review 2024",
      status: "active",
      type: "Annual",
      period: "2024-01-01 to 2024-03-31",
      dueDate: "2024-03-31",
      participants: 45,
      completed: 12,
      pending: 33,
      manager: "Mr. Murugan",
      milestones: [],
      details: {
        formsSubmitted: 38,
        approved: 12,
        clarifying: 5,
        pendingApproval: 21,
        averageRating: 3.8,
        departments: ['Engineering', 'Product', 'Marketing']
      }
    },
    {
      title: "Quarterly Review 2025",
      id: 2,
      name: "Mid-term Review 2024",
      status: "completed",
      type: "Mid-term",
      period: "2024-07-01 to 2024-09-30",
      dueDate: "2024-09-30",
      participants: 45,
      completed: 45,
      pending: 0,
      manager: "Mr. Murugan",
      milestones: [],
      details: {
        formsSubmitted: 45,
        approved: 42,
        clarifying: 3,
        pendingApproval: 0,
        averageRating: 4.1,
        departments: ['All Departments']
      }
    }
  ];

  const approvals: Approval[] = [
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

  const statusClasses: Record<FormStatus, string> = {
 
    pending_approval: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
  
  };

  // Enhanced analytics data
  const analyticsData = {
    participationTrends: [
      { month: 'Jan', participants: 120, completed: 85 },
      { month: 'Feb', participants: 150, completed: 110 },
      { month: 'Mar', participants: 180, completed: 150 },
      { month: 'Apr', participants: 200, completed: 175 },
      { month: 'May', participants: 220, completed: 190 },
      { month: 'Jun', participants: 250, completed: 230 },
    ],
    departmentStats: [
      { name: 'Engineering', participation: 95, avgRating: 4.2 },
      { name: 'Product', participation: 88, avgRating: 4.1 },
      { name: 'Marketing', participation: 92, avgRating: 3.9 },
      { name: 'Sales', participation: 85, avgRating: 3.8 },
      { name: 'HR', participation: 98, avgRating: 4.3 },
    ],
    ratingDistribution: [
      { rating: 1, count: 5 },
      { rating: 2, count: 12 },
      { rating: 3, count: 45 },
      { rating: 4, count: 120 },
      { rating: 5, count: 65 },
    ],
    completionRates: {
      currentCycle: 78,
      previousCycle: 65,
      average: 72,
    },
  };

  // Filter cycles for reports
  const filteredCycles = hikeCycles.filter(cycle => {
    const matchesSearch = cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cycle.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cycle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Prepare CSV data
  const csvData = filteredCycles.map(cycle => ({
    Name: cycle.name,
    Type: cycle.type,
    Status: cycle.status,
    Period: cycle.period,
    'Due Date': cycle.dueDate,
    Participants: cycle.participants,
    Completed: cycle.completed,
    'Average Rating': cycle.details?.averageRating?.toFixed(1),
    'Forms Submitted': cycle.details?.formsSubmitted,
    Approved: cycle.details?.approved,
    'Pending Approval': cycle.details?.pendingApproval,
    Clarifying: cycle.details?.clarifying
  }));

  const selectedCycle = hikeCycles.find(cycle => cycle.id === selectedCycleId);

  const summaryStats: DashboardStat[] = [
    {
      title: 'Total Hike Cycles',
      value: hikeCycles.length,
      icon: '📊',
      trend: 'up'
    },
    {
      title: 'Active Cycles',
      value: hikeCycles.filter(c => c.status === 'active').length,
      icon: '⏳',
      trend: 'neutral'
    },
    {
      title: 'Total Employees',
      value: hikeCycles.reduce((sum, cycle) => sum + cycle.participants, 0),
      icon: '👥',
      trend: 'up'
    },
    {
      title: 'Avg Completion',
      value: `${Math.round(
        hikeCycles.reduce((sum, cycle) => sum + (cycle.completed / cycle.participants) * 100, 0) /
        hikeCycles.length
      )}%`,
      icon: '✅',
      trend: 'up'
    }
  ];

  const selectedPieData = selectedCycle?.details ? [
    { name: 'Approved', value: selectedCycle.details.approved },
    { name: 'Clarifying', value: selectedCycle.details.clarifying },
    { name: 'Pending', value: selectedCycle.details.pendingApproval }
  ] : [];
  const handlePublish = (data: HikeCycleForm) => {
  console.log('Form Published/Updated:', data);
  setShowNewForm(false);
  setActiveForm(null); // Clear activeForm after publishing/updating
  setActiveTab('forms');
  // ... (rest of the function)
};

  const handleViewApproval = (approval: Approval) => {
    setSelectedApproval(approval);
  };

  const handleApprove = (hikePercentage: number, feedback: string) => {
    if (!selectedApproval) return;
    setSelectedApproval(null);
    alert(`Approved with ${hikePercentage}% hike!`);
  };

  const handleRequestClarification = (feedback: string) => {
    if (!selectedApproval) return;
    setSelectedApproval(null);
    alert('Clarification requested!');
  };

  const handleRejectClick = (formId: number) => {
    setFormToReject(formId);
  };

  const confirmReject = () => {
    if (formToReject && rejectReason.trim()) {
      handleRejectHikeForm(formToReject);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedCycle(expandedCycle === id ? null : id);
  };

const handleEditForm = () => {
  if (activeForm) {
    setShowNewForm(true); // This tells the renderContent to show the form
    // No need to setFormToEdit, as NewHikeCycleForm will now use activeForm as initialData
  }
};

const handleApproveHikeForm = async (formId: number) => {
  try {
    await fetch(`https://localhost:7000/api/HikeCycle/approve/${formId}`, { method: 'POST' });
    alert('Form approved successfully!');
    setPendingApprovals(prev => prev.filter(form => form.id !== formId));
    setActiveForm(null);
  } catch (error) {
    alert('Failed to approve form');
  }
};


const handleRejectHikeForm = async (formId: number) => {
  if (!rejectReason) {
    alert('Please provide a reason for rejection');
    return;
  }

  try {
    await fetch(`/api/HikeForm/reject/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectReason }),
    });

    alert('Form rejected successfully!');
    setPendingApprovals(prev => prev.filter(form => form.id !== formId));
    setActiveForm(null);
    setRejectReason('');
    setFormToReject(null);
  } catch (error) {
    alert('Failed to reject form');
  }
};


useEffect(() => {
  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch('https://localhost:7000/api/HikeCycle/pending');
      const data = await response.json();

      // Map the cycleName to title to match the expected HikeForm type
      const mappedForms = data.map((item: any) => ({
        ...item,
        title: item.cycleName
      }));

      setPendingApprovals(mappedForms);
    } catch (error) {
      console.error('Failed to fetch pending hike forms:', error);
    }
  };

  fetchPendingApprovals();
}, []);

useEffect(() => {
  setShowNewForm(false);
  setFormToEdit(null);
  setActiveForm(null); // Also reset activeForm when switching tabs
}, [activeTab]);
  const renderContent = () => {
    
 if (showNewForm) { // No need for formToEdit || here if we're only using showNewForm
return (
 <NewHikeCycleForm
 onCancel={() => {
 setShowNewForm(false);
 setActiveForm(null); // Clear activeForm if cancelled
}}
onPublish={handlePublish}
userDepartment={userDepartment}
 userRole={userRole}
 initialData={activeForm} // <--- THIS IS THE KEY CHANGE: Pass activeForm here!
 />
 );}
    
    switch (activeTab) {
      case 'forms':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Review Forms</h2>
              <button
                onClick={() => {
                  setShowNewForm(true);
                  setFormToEdit(null); // IMPORTANT: Ensure no initial data when creating a NEW form
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + New Form
              </button>
            </div>
            <ul className="bg-white shadow rounded divide-y">
              {existingForms.map(form => (
                <li key={form.id} className="p-4 flex justify-between">
                  <span>{form.name}</span>
                  <span className="text-sm text-gray-500">Created by {form.createdBy} on {form.createdOn}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      // ... (rest of your cases for 'templates', 'review-cycles', 'approvals', 'dashboard')
      // The 'approvals' case already has the handleEditForm button correctly calling setFormToEdit(activeForm)
    

      case 'templates':
        return <TemplateManager />;

      case 'review-cycles':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Performance Review Cycles</h2>
            <HikeCycleList
              cycles={hikeCycles}
              expandedCycle={expandedCycle}
              onManageClick={toggleExpand}
            />
          </div>
        );

     case 'approvals':
  if (activeForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Review Form: {activeForm.title}</h3>
        <button
          onClick={() => setActiveForm(null)}
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Back to List
        </button>
      </div>

      <div className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="text-md font-semibold mb-2">Description</h4>
          <p className="text-gray-700">{activeForm.description || 'No description provided'}</p>
        </div>

        {/* Cycle Details */}
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold">Cycle Type</h4>
            <p>{activeForm.cycleTypeName || 'N/A'}</p>
          </div>

          <div className="border rounded p-4">
            <h4 className="font-semibold">Review Period Start</h4>
            <p>{new Date(activeForm.reviewPeriodStartDate ?? '').toLocaleDateString()}</p>
          </div>

          <div className="border rounded p-4">
            <h4 className="font-semibold">Review Period End</h4>
            <p>{new Date(activeForm.reviewPeriodEndDate ?? '').toLocaleDateString()}</p>
          </div>

          <div className="border rounded p-4">
            <h4 className="font-semibold">Cycle Deadline</h4>
            <p>{new Date(activeForm.cycleDeadline ?? '').toLocaleDateString()}</p>
          </div>

          {/* Selected Assessment Options */}
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Selected Assessment Options</h4>
            {activeForm.assessmentSelections && activeForm.assessmentSelections.length > 0 ? (
              <div className="space-y-2">
                {activeForm.assessmentSelections.map((group, index) => (
                  <div key={index}>
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      Selected {group.type}(s):
                    </div>
                    <div className="text-sm text-gray-700">{group.values.join(', ')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No options selected</p>
            )}
          </div>
        </div>

        {/* Review Levels */}
        <div>
          <h4 className="text-md font-semibold mb-3">Review Levels</h4>
          {Array.isArray(activeForm.reviewLevels) && activeForm.reviewLevels.length > 0 ? (
            <ul className="space-y-3">
              {activeForm.reviewLevels.map((level, index) => (
                <li key={index} className="border p-3 rounded">
                  <div className="font-semibold">Level {level.reviewOrder}: {level.name}</div>
                  <div className="text-sm text-gray-600">Reviewer: {level.reviewerName || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Deadline: {new Date(level.deadline ?? '').toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No review levels configured</p>
          )}
        </div>

        {/* Assessment Categories and Questions */}
        <div>
          <h4 className="text-md font-semibold mb-3">Assessment Categories & Questions</h4>
          {Array.isArray(activeForm.assessmentCategories) && activeForm.assessmentCategories.length > 0 ? (
            <ul className="space-y-4">
              {activeForm.assessmentCategories.map((cat, idx) => (
                <li key={idx} className="border p-3 rounded">
                  <div className="font-semibold">{cat.categoryName}</div>
                  <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
                    {cat.questions?.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No assessment questions added</p>
          )}
        </div>

        {/* Approval Decision */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold mb-4">Approval Decision</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback (Required for rejection)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                rows={3}
                placeholder="Provide feedback or reason for rejection..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleRejectClick(activeForm.id)}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                        onClick={handleEditForm} // Call the new handler
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                      >
                        Edit
                      </button>
              <button
                onClick={() => handleApproveHikeForm(activeForm.id)}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

        return selectedApproval ? (
          <ApprovalDetails
            approval={selectedApproval}
            onBack={() => setSelectedApproval(null)}
            onApprove={handleApprove}
            onRequestClarification={handleRequestClarification}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Form Approvals ({pendingApprovals.length})</h2>

            </div>

            {pendingApprovals.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Title</th>
                
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {pendingApprovals.map(form => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{form.title}</td>
                     
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[form.status]}`}>
                            {form.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => {
                              setActiveForm(form);
                              setIsEditing(false);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No forms pending approval</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Employee Performance Approvals</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {approvals.filter(a => a.status === 'pending').map(approval => (
                      <tr key={approval.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{approval.employeeName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{approval.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{approval.manager}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{approval.rating}</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleViewApproval(approval)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-semibold">Performance Review Analytics</h1>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search cycles..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2 border rounded-lg appearance-none w-full"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <CSVLink 
                  data={csvData} 
                  filename={`performance-reviews-${new Date().toISOString().slice(0,10)}.csv`}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <FaFileCsv /> Export CSV
                </CSVLink>
              </div>
            </div>

            {/* Review Cycles Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Review Cycles Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCycles.length > 0 ? (
                      filteredCycles.map((cycle) => (
                        <React.Fragment key={cycle.id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cycle.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cycle.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                cycle.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                cycle.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {cycle.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cycle.period}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cycle.participants}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cycle.completed}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {cycle.details?.averageRating?.toFixed(1) || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => toggleExpand(cycle.id)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                {expandedCycle === cycle.id ? (
                                  <>
                                    <FaChevronUp size={12} /> Hide Details
                                  </>
                                ) : (
                                  <>
                                    <FaChevronDown size={12} /> View Details
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                          {expandedCycle === cycle.id && (
                            <tr>
                              <td colSpan={8} className="px-6 py-4 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  <div className="bg-white p-4 rounded shadow">
                                    <h3 className="font-semibold mb-2">Submission Details</h3>
                                    <div className="space-y-2">
                                      <p><span className="font-medium">Forms Submitted:</span> {cycle.details?.formsSubmitted ?? '-'}</p>
<p><span className="font-medium">Approved:</span> {cycle.details?.approved ?? '-'}</p>
<p><span className="font-medium">Pending Approval:</span> {cycle.details?.pendingApproval ?? '-'}</p>
<p><span className="font-medium">Needs Clarification:</span> {cycle.details?.clarifying ?? '-'}</p>
</div>
                                  </div>
                                  <div className="bg-white p-4 rounded shadow">
                                    <h3 className="font-semibold mb-2">Performance Metrics</h3>
                                    <div className="space-y-2">
                                      <p><span className="font-medium">Average Rating:</span> {cycle.details?.averageRating?.toFixed(1) ?? '-'}/5</p>
<p><span className="font-medium">Completion Rate:</span> {Math.round((cycle.completed / cycle.participants) * 100)}%</p>
                                      <p><span className="font-medium">Approval Rate:</span> {cycle.details?.formsSubmitted && cycle.details?.approved !== undefined 
    ? Math.round((cycle.details.approved / cycle.details.formsSubmitted) * 100) 
    : 0}%</p><p><span className="font-medium">Team Members:</span> {cycle.participants}</p>
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded shadow">
                                    <h3 className="font-semibold mb-2">Cycle Information</h3>
                                    <div className="space-y-2">
                                      <p><span className="font-medium">Manager:</span> {cycle.manager}</p>
                                      <p><span className="font-medium">Due Date:</span> {cycle.dueDate}</p>
                                      <p><span className="font-medium">Departments:</span> {cycle.details?.departments?.join(', ') ?? '-'}</p>
<p><span className="font-medium">Status:</span> <span className={`capitalize ${cycle.status === 'active' ? 'text-blue-600' : 'text-green-600'}`}>{cycle.status}</span></p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                          No matching review cycles found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default: // Dashboard
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Admin Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {summaryStats.map((stat, index) => (
                <DashboardCard key={index} {...stat} />
              ))}
            </div>
            <div className="bg-white p-4 rounded shadow mb-6">
              <h3 className="text-lg font-semibold mb-3">Choose a Hike Cycle to View Chart</h3>
              <div className="flex flex-wrap gap-4">
                {hikeCycles.map(cycle => (
                  <label key={cycle.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cycle"
                      value={cycle.id}
                      checked={selectedCycleId === cycle.id}
                      onChange={() => setSelectedCycleId(cycle.id)}
                    />
                    {cycle.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-8 bg-white rounded-lg shadow p-6 flex justify-center items-center h-auto min-h-[280px]">
              <PieChart
                data={selectedPieData}
                title={`${selectedCycle?.name} - Status Distribution`}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        role="admin" 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
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
  );
};

export default AdminDashboard;