import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import ReviewStatus from '../../components/ReviewStatus';
import HikeCycleList from '../../components/HikeCycleList';
import SelfAssessmentForm from '../../components/SelfassessmentForm';
import { EmployeeHikeCycle, ReviewStatusItem, SelfAssessment } from '../../types/reviewTypes';

// Mock employee data
const employeeData = {
  id: 'emp-123',
  name: 'John Doe',
  position: 'Senior Developer',
  department: 'Engineering',
  manager: 'Mr. Murugan (Engineering Manager)',
  completedGoals: 5,
  pendingReviews: 1,
  completedProjects: 3,
  currentRating: 4.3,
  goals: [
    {
      title: "Improve code quality",
      status: "Completed",
      rating: "4.5/5",
      details: "Reduced bugs by 30% through improved testing practices"
    }
  ],
  expectations: [
    {
      title: "Technical Leadership",
      status: "Exceeded",
      details: "Mentored 2 junior developers this quarter"
    }
  ],
  feedbacks: [
    {
      from: "Manager",
      content: "Excellent work on the recent project.",
      date: "2024-02-10"
    }
  ]
};

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'goals' | 'expectations' | 'feedbacks' | null>(null);
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [hikeCycles, setHikeCycles] = useState<EmployeeHikeCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Manager options for the form
  const managerOptions = [
    "Mr. Murugan (Engineering Manager)",
    "Ms. Smith (Product Manager)", 
    "Dr. Johnson (CTO)",
    "Ms. Lee (HR Director)"
  ];

  // Load employee-specific data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data: EmployeeHikeCycle[] = [
          {
            title:"Annual Hike 2024",
            id: 1,
            name: "Annual Review 2024",
            status: "active",
            type: "Annual",
            period: "2024-01-01 to 2024-03-31",
            dueDate: "2024-03-31",
            participants: 1,
            completed: 0,
            pending: 1,
            progress: 0,
            manager: employeeData.manager,
            isSubmitted: false,
            milestones: [
              {
                id: 1,
                title: "Self Review Submission",
                description: "Complete your self-assessment",
                dueDate: "2024-02-15",
                status: "in-progress"
              }
            ],
            details: {
              formsSubmitted: 0,
              approved: 0,
              clarifying: 0,
              pendingApproval: 0,
              averageRating: 0,
              departments: [employeeData.department]
            }
          },
          {
            title:"Mid-term Hike 2025",
            id: 2,
            name: "Mid-term Review 2023",
            status: "completed",
            type: "Mid-term",
            period: "2023-07-01 to 2023-09-30",
            dueDate: "2023-09-30",
            participants: 1,
            completed: 1,
            pending: 0,
            progress: 100,
            manager: employeeData.manager,
            isSubmitted: true,
            selfAssessment: {
              goals: [
                {
                  title: "Improve code quality",
                  description: "Focus on writing cleaner, more maintainable code",
                  achievement: "Reduced bug reports by 25%",
                  rating: 4,
                  manager: "Mr. Murugan (Engineering Manager)",
                  documents: []
                }
              ],
              projects: [
                {
                  name: "Customer Portal Redesign",
                  description: "Redesign of the customer-facing portal",
                  impact: "Improved user satisfaction by 30%",
                  role: "Lead Frontend Developer",
                  rating: 5,
                  manager: "Mr. Murugan (Engineering Manager)",
                  documents: []
                }
              ],
              skills: [],
              submittedDate: "2023-08-10"
            },
            milestones: [
              {
                id: 1,
                title: "Self Review Submission",
                description: "Completed your self-assessment",
                dueDate: "2023-08-15",
                status: "completed",
                rating: 4.2
              }
            ],
            details: {
              formsSubmitted: 1,
              approved: 1,
              clarifying: 0,
              pendingApproval: 0,
              averageRating: 4.2,
              departments: [employeeData.department]
            }
          }
        ];
        setHikeCycles(data);
      } catch (error) {
        console.error("Failed to load employee data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployeeData();
  }, []);

  // Stats cards with employee-specific data
  const stats = [
    { title: 'Goals Completed', value: employeeData.completedGoals },
    { title: 'Pending Reviews', value: employeeData.pendingReviews },
    { title: 'Completed Projects', value: employeeData.completedProjects },
    { title: 'Current Rating', value: employeeData.currentRating },
  ];

  // Review status data
  const reviewStatus: ReviewStatusItem[] = hikeCycles.map(cycle => ({
    stage: cycle.name,
    status: cycle.status === 'completed' ? 'completed' : 
           cycle.isSubmitted ? 'in-progress' : 'pending',
    date: cycle.status === 'completed' ? `Completed: ${cycle.dueDate}` : `Due: ${cycle.dueDate}`,
    note: cycle.status === 'completed' ? 
          `Rating: ${cycle.details?.averageRating}/5` :
          cycle.isSubmitted ? 'Waiting for manager review' : 'Pending submission'
  }));

  const handleHomeClick = () => {
     setExpandedCycle(null);
    setActiveTab(null);
    navigate('/employee', { replace: true });
  };

  const handleTabClick = (tab: 'goals' | 'expectations' | 'feedbacks') => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleManageClick = (id: number) => {
    setExpandedCycle(expandedCycle === id ? null : id);
  };

  const handleAssessmentSubmit = (assessment: SelfAssessment) => {
    const updatedCycles = hikeCycles.map(cycle => {
      if (cycle.id === expandedCycle) {
        return { 
          ...cycle, 
          isSubmitted: true,
          selfAssessment: {
            ...assessment,
            submittedDate: new Date().toISOString().split('T')[0]
          },
          completed: 1,
          pending: 0,
          progress: 100,
          details: {
            ...cycle.details!,
            formsSubmitted: 1,
            approved: 0,
            pendingApproval: 1,
            averageRating: 0
          }
        };
      }
      return cycle;
    });
    setHikeCycles(updatedCycles);
    setExpandedCycle(null);
  };

  const activeCycle = hikeCycles.find(cycle => 
    cycle.id === expandedCycle && cycle.status === 'active' && !cycle.isSubmitted
  );

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar onHomeClick={handleHomeClick} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onHomeClick={handleHomeClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-2">
            {employeeData.name}'s Dashboard
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {employeeData.position} | {employeeData.department} | Manager: {employeeData.manager}
          </p>
          
          {activeCycle ? (
            <SelfAssessmentForm
              cycle={activeCycle}
              onSubmit={handleAssessmentSubmit}
              onCancel={() => setExpandedCycle(null)}
              managerOptions={managerOptions}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <DashboardCard 
                    key={index} 
                    title={stat.title} 
                    value={stat.value}
                    icon={index === 3 ? '⭐' : index === 0 ? '🎯' : index === 1 ? '📝' : '🏆'}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">My Performance Reviews</h2>
                  <HikeCycleList 
                    cycles={hikeCycles} 
                    expandedCycle={expandedCycle}
                    onManageClick={handleManageClick}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Review Status</h2>
                  <ReviewStatus items={reviewStatus} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                  <button 
                    className={`py-2 px-4 rounded transition-colors ${
                      activeTab === 'goals' 
                        ? 'bg-blue-700 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={() => handleTabClick('goals')}
                  >
                    View My Goals
                  </button>
                  <button 
                    className={`py-2 px-4 rounded transition-colors ${
                      activeTab === 'expectations' 
                        ? 'bg-green-700 text-white' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    onClick={() => handleTabClick('expectations')}
                  >
                    My Expectations
                  </button>
                  <button 
                    className={`py-2 px-4 rounded transition-colors ${
                      activeTab === 'feedbacks' 
                        ? 'bg-purple-700 text-white' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    onClick={() => handleTabClick('feedbacks')}
                  >
                    My Feedbacks
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {activeTab === 'goals' && 'My Goals'}
                    {activeTab === 'expectations' && 'Performance Expectations'}
                    {activeTab === 'feedbacks' && 'Received Feedbacks'}
                  </h3>
                  
                  {activeTab === 'goals' && (
                    <div className="space-y-6">
                      {employeeData.goals.map((goal, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="font-medium text-gray-900">{goal.title}</h4>
                            <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                              goal.status === "Completed" 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {goal.status}
                            </span>
                          </div>
                          {goal.rating && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-sm font-medium">Rating:</span>
                              <span className="text-sm text-gray-600">{goal.rating}</span>
                            </div>
                          )}
                          <p className="text-sm text-gray-600 mt-3">{goal.details}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'expectations' && (
                    <div className="space-y-6">
                      {employeeData.expectations.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                              item.status === "Exceeded" 
                                ? 'bg-green-100 text-green-800' 
                                : item.status === "Needs Improvement"
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-3">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'feedbacks' && (
                    <div className="space-y-6">
                      {employeeData.feedbacks.map((feedback, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="font-medium text-gray-900">From: {feedback.from}</h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {feedback.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-3">{feedback.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;