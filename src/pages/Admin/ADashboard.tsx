import React, { useState } from 'react';
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
import { HikeForm, HikeFormField, ApprovalLevel, FormStatus, HikeFormFieldType } from '../../types/reviewTypes';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "forms" | "review-cycles" | "reports" | "approvals" | "settings" | "users" | "templates" | "performance-review" |"assessments"| "reviews"
  >("dashboard");

  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState<number>(1);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectReason, setRejectReason] = useState('');
  const [formToReject, setFormToReject] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<HikeForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFieldType, setNewFieldType] = useState<HikeFormFieldType>('text');
  const [newApprovalLevel, setNewApprovalLevel] = useState<Omit<ApprovalLevel, 'level'>>({
    title: '',
    approvers: [],
    isFinalApproval: false
  });

  // Static data for pending approvals
  const staticPendingApprovals: HikeForm[] = [
    {
      id: uuidv4(),
      title: '2023 Annual Performance Review',
      description: 'Form for annual employee performance evaluations',
      fields: [
        { id: uuidv4(), label: 'Cycle Name', type: 'text', required: true },
        { id: uuidv4(), label: 'Cycle Deadline', type: 'Date', required: true },
        { id: uuidv4(), label: 'Goal Section', type: 'textarea', required: true },
        { id: uuidv4(), label: 'Project Section', type: 'textarea', required: true },
        { id: uuidv4(), label: 'Communication', type: 'number', required: true, min: 1, max: 5 },
        { id: uuidv4(), label: 'Team Work', type: 'number', required: true, min: 1, max: 5 },
        { id: uuidv4(), label: 'Behaviour', type: 'number', required: true, min: 1, max: 5 },
        { id: uuidv4(), label: 'Upload Document', type: 'file', required: true, min: 1, max: 5 },
      ],
      approvalLevels: [
        {
          level: 1,
          title: 'Manager Review',
          approvers: ['John Doe', 'Jane Smith'],
          isFinalApproval: false
        },
        {
          level: 2,
          title: 'Manager Head Review',
          approvers: ['Managing HIgher Officials'],
          isFinalApproval: false
        },
        {
          level: 3,
          title: 'HR Approval',
          approvers: ['HR Department'],
          isFinalApproval: true
        }
      ],
      status: 'pending_approval',
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2023-01-15T10:30:00Z'
    },
    {
      id: uuidv4(),
      title: 'Q3 Promotion Cycle',
      description: 'Form for promotion recommendations and approvals',
      fields: [
        { id: uuidv4(), label: 'Current Position', type: 'text', required: true },
        { id: uuidv4(), label: 'Recommended Position', type: 'text', required: true },
        { id: uuidv4(), label: 'Justification', type: 'textarea', required: true },
        { id: uuidv4(), label: 'Salary Adjustment %', type: 'number', required: false, min: 0, max: 50 }
      ],
      approvalLevels: [
        {
          level: 1,
          title: 'Department Head',
          approvers: ['Department Heads'],
          isFinalApproval: false
        },
        {
          level: 2,
          title: 'Compensation Committee',
          approvers: ['Comp Team'],
          isFinalApproval: false
        },
        {
          level: 3,
          title: 'HR Final Approval',
          approvers: ['HR Director'],
          isFinalApproval: true
        }
      ],
      status: 'pending_approval',
      createdAt: '2023-06-20T14:15:00Z',
      updatedAt: '2023-06-20T14:15:00Z'
    }
  ];

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

  // Mock completed assessment data for employee approvals
  const mockCompletedAssessment = {
    id: 1,
    cycleId: 2,
    cycleName: "Mid-term Review 2023",
    employeeName: "John Doe",
    position: "Senior Developer",
    department: "Engineering",
    manager: "Mr. Murugan",
    submittedDate: "2023-08-10",
    status: "pending",
    overallRating: 4.2,
    goals: [
      {
        title: "Improve code quality",
        description: "Focus on writing cleaner, more maintainable code",
        achievement: "Reduced bug reports by 25%",
        employeeRating: 4,
        managerRating: 4.5,
        managerFeedback: "Significant improvement shown in code quality metrics."
      },
      {
        title: "Learn new framework",
        description: "Gain proficiency in React 18",
        achievement: "Completed React course and implemented features",
        employeeRating: 5,
        managerRating: 5,
        managerFeedback: "Excellent progress with React 18 adoption."
      }
    ],
    projects: [
      {
        name: "Customer Portal Redesign",
        description: "Redesign of the customer-facing portal",
        impact: "Improved user satisfaction by 30%",
        role: "Lead Frontend Developer",
        employeeRating: 5,
        managerRating: 5,
        managerFeedback: "Excellent work leading the frontend development team."
      },
      {
        name: "API Performance Optimization",
        description: "Improved response times for critical APIs",
        impact: "Reduced latency by 40%",
        role: "Backend Developer",
        employeeRating: 4,
        managerRating: 4,
        managerFeedback: "Good work on performance improvements."
      }
    ],
    skills: [
      {
        name: "Quality of Work",
        category: "Technical",
        employeeRating: 4.5,
        managerRating: 4.5,
        managerFeedback: "Consistently delivers high-quality work with attention to detail."
      },
      {
        name: "Technical Skills",
        category: "Technical",
        employeeRating: 4.0,
        managerRating: 4.0,
        managerFeedback: "Strong technical skills demonstrated across the stack."
      },
      {
        name: "Communication",
        category: "Soft Skills",
        employeeRating: 3.5,
        managerRating: 3.5,
        managerFeedback: "Communicates effectively but could improve documentation."
      }
    ],
    managerFeedback: "John has shown excellent technical skills and leadership qualities this cycle. His work on the customer portal redesign was particularly impressive. He has demonstrated strong problem-solving abilities and has been proactive in taking on additional responsibilities. There is room for improvement in documentation practices and mentoring junior team members more consistently.",
    strengths: [
      "Technical expertise",
      "Leadership skills",
      "Problem solving",
      "Quick learner",
      "Reliable and consistent"
    ],
    areasForImprovement: [
      "Could improve documentation practices",
      "Should mentor more junior team members",
      "Could take more initiative in cross-team collaboration"
    ],
    hikeRecommendation: {
      percentage: "12%",
      justification: "Strong performance across all metrics with exceptional work on key projects. Demonstrated technical leadership and delivered significant business impact.",
      status: "pending"
    }
  };

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
    completedAssessment: {
      cycleName: "Annual Cycle",
      submittedDate: "2025-03-15",
      department: "Engineering",
      overallRating: 4.5,
      goals: [
        {
          title: "Improve Code Quality",
          description: "",
          achievement: "",
          employeeRating: 0,
          managerRating: 4,
          managerFeedback: "Consistently followed best practices."
        }
      ],
      projects: [
        {
          name: "Migration to React",
          description: "",
          role: "",
          impact: "",
          employeeRating: 0,
          managerRating: 5,
          managerFeedback: "Successfully migrated frontend to React."
        }
      ],
      skills: [],
      managerFeedback: "",
      strengths: [],
      areasForImprovement: [],
      hikeRecommendation: {
        percentage: "10%",
        justification: "Great work.",
        status: "pending"
      }
    }
  }
];


  const statusClasses: Record<FormStatus, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    pending_approval: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-gray-100 text-gray-800'
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

  const handlePublish = (data: any) => {
    console.log('Published New Form:', data);
    setShowNewForm(false);
    setActiveTab('forms');
  };

  const handleViewApproval = (approval: Approval) => {
    // Set the selected approval with the mock completed assessment data
    setSelectedApproval({
  ...approval,
  completedAssessment: {
    ...mockCompletedAssessment,
    hikeRecommendation: {
      ...mockCompletedAssessment.hikeRecommendation,
      status: mockCompletedAssessment.hikeRecommendation?.status as 'pending' | 'approved' | 'clarifying'
    }
  }
});

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

  const handleRejectClick = (formId: string) => {
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

  const handleApproveHikeForm = (formId: string) => {
    const approvedForm = staticPendingApprovals.find(form => form.id === formId);
    if (approvedForm) {
      const updatedForm = { ...approvedForm, status: 'approved' };
      alert(`Form "${updatedForm.title}" approved successfully!`);
    }
    setActiveForm(null);
  };

  const handleRejectHikeForm = (formId: string) => {
    if (!rejectReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    const rejectedForm = staticPendingApprovals.find(form => form.id === formId);
    if (rejectedForm) {
      alert(`Form "${rejectedForm.title}" rejected with reason: ${rejectReason}`);
    }
    setActiveForm(null);
    setRejectReason('');
    setFormToReject(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'forms':
        return showNewForm ? (
          <NewHikeCycleForm
            onCancel={() => setShowNewForm(false)}
            onPublish={handlePublish}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Review Forms</h2>
              <button
                onClick={() => setShowNewForm(true)}
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
                <div>
                  <h4 className="text-md font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{activeForm.description || 'No description provided'}</p>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Form Fields</h4>
                  <div className="space-y-3">
                    {activeForm.fields.map(field => (
                      <div key={field.id} className="border rounded p-4">
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {field.type} {field.required && '(required)'}
                        </div>
                        {field.type === 'select' && (
                          <div className="mt-2 text-sm">
                            Options: {field.options?.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Approval Workflow</h4>
                  <div className="space-y-3">
                    {activeForm.approvalLevels.map(level => (
                      <div key={level.level} className="border rounded p-3">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">Level {level.level}: {level.title}</span>
                            {level.isFinalApproval && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Final Approval
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          Approvers: {level.approvers.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Performance Review: {selectedApproval.employeeName}</h2>
                <p className="text-gray-600">{selectedApproval.position} • {selectedApproval.manager}</p>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Back to List
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Current Salary</p>
                <p className="text-2xl font-bold">₹{selectedApproval.currentSalary.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Proposed Hike</p>
                <p className="text-2xl font-bold">{selectedApproval.completedAssessment?.hikeRecommendation?.percentage || 'Pending'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Overall Rating</p>
                <p className="text-2xl font-bold">{selectedApproval.completedAssessment?.overallRating}/5</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Assessment Details */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">Assessment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Review Cycle</p>
                    <p className="font-medium">{selectedApproval.completedAssessment?.cycleName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted Date</p>
                    <p className="font-medium">{selectedApproval.completedAssessment?.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{selectedApproval.completedAssessment?.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium capitalize">{selectedApproval.status}</p>
                  </div>
                </div>
              </div>

              {/* Goals Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Goals Assessment</h3>
                {selectedApproval.completedAssessment?.goals?.length ? (
                  <div className="space-y-4">
                    {selectedApproval.completedAssessment.goals.map((goal, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{goal.title}</h4>
                            <p className="text-sm text-gray-600">{goal.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Employee</p>
                              <span className="font-medium">{goal.employeeRating}/5</span>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Manager</p>
                              <span className="font-medium">{goal.managerRating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm font-medium">Achievements:</p>
                          <p className="text-gray-700">{goal.achievement}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Manager Feedback:</p>
                          <p className="text-gray-700">{goal.managerFeedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No goals data available</p>
                )}
              </div>

              {/* Projects Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Projects Assessment</h3>
                {selectedApproval.completedAssessment?.projects?.length ? (
                  <div className="space-y-4">
                    {selectedApproval.completedAssessment.projects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-gray-600">{project.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Employee</p>
                              <span className="font-medium">{project.employeeRating}/5</span>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Manager</p>
                              <span className="font-medium">{project.managerRating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Your Role:</p>
                            <p className="text-gray-700">{project.role}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Impact:</p>
                            <p className="text-gray-700">{project.impact}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Manager Feedback:</p>
                          <p className="text-gray-700">{project.managerFeedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No projects data available</p>
                )}
              </div>

              {/* Skills Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Skills Assessment</h3>
                {selectedApproval.completedAssessment?.skills?.length ? (
                  <div className="space-y-4">
                    {selectedApproval.completedAssessment.skills.map((skill, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            <p className="text-sm text-gray-600">{skill.category}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Employee</p>
                              <span className="font-medium">{skill.employeeRating}/5</span>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Manager</p>
                              <span className="font-medium">{skill.managerRating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Manager Feedback:</p>
                          <p className="text-gray-700">{skill.managerFeedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills data available</p>
                )}
              </div>

              {/* Manager Feedback */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Manager's Overall Feedback</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedApproval.completedAssessment?.managerFeedback}</p>
                </div>
              </div>

              {/* Strengths and Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {selectedApproval.completedAssessment?.strengths?.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {selectedApproval.completedAssessment?.areasForImprovement?.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Approval Actions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Approval Decision</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback (Optional)
                    </label>
                    <textarea
                      className="border rounded px-3 py-2 w-full"
                      rows={3}
                      placeholder="Provide any additional feedback..."
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => handleRequestClarification('')}
                      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                    >
                      Request Clarification
                    </button>
                    <button
                      onClick={() => handleApprove(12, '')}
                      className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Form Approvals ({staticPendingApprovals.length})</h2>
            </div>

            {staticPendingApprovals.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fields</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staticPendingApprovals.map(form => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{form.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{form.fields.length}</td>
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
                                          : 0}%</p>
                                      <p><span className="font-medium">Team Members:</span> {cycle.participants}</p>
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