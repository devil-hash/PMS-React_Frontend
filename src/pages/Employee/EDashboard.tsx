// EmployeeDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import HikeCycleList from '../../components/HikeCycleList';
import SelfAssessmentForm from '../../components/SelfassessmentForm';
import { EmployeeHikeCycle, ReviewStatusItem, SelfAssessment, ManagerReview } from '../../types/reviewTypes';

// Define the Tab type that matches what Sidebar expects
type SidebarTab = 'dashboard' | 'assessments' | 'reviews' | 'forms' | 'review-cycles' | 'reports' | 'approvals' | 'settings' | 'users' | 'templates' | 'performance-review';
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
    },
    {
      title: "Learn new framework",
      status: "In Progress",
      rating: "3.5/5",
      details: "Completed React course, implementing in current project"
    },
    {
      title: "Mentor junior team members",
      status: "Completed",
      rating: "4.0/5",
      details: "Mentored 2 junior developers this quarter"
    }
  ],
  expectations: [
    {
      title: "Technical Leadership",
      status: "Exceeded",
      details: "Mentored 2 junior developers this quarter and led the frontend architecture decisions"
    },
    {
      title: "Code Quality",
      status: "Met",
      details: "Maintained high code quality standards with 95% code review approval rate"
    },
    {
      title: "Project Delivery",
      status: "Exceeded",
      details: "Delivered all projects on time with positive client feedback"
    }
  ],
  feedbacks: [
    {
      from: "Manager",
      content: "Excellent work on the recent project. Your leadership was instrumental in meeting the tight deadline.",
      date: "2024-02-10"
    },
    {
      from: "Peer",
      content: "Thanks for helping me understand the new architecture. Your explanations were very clear.",
      date: "2024-01-25"
    },
    {
      from: "Client",
      content: "The dashboard you built has been very well received by our team. Great attention to detail.",
      date: "2024-03-05"
    }
  ]
};

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'goals' | 'expectations' | 'feedbacks' | null>(null);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('dashboard');
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [hikeCycles, setHikeCycles] = useState<EmployeeHikeCycle[]>([]);
  const [managerReviews, setManagerReviews] = useState<ManagerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'form' | 'review'>('form'); // 'form' or 'review'

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
            title: "Annual Hike 2024",
            id: 1,
            name: "Annual Review 2024",
            status: "active",
            type: "Annual",
            period: "2024-01-01 to 2024-03-31",
            dueDate: "2024-03-31",
            participants: 1,
            completed: 0,
            pending: 1,
            manager: employeeData.manager,
            isSubmitted: false,
            milestones: [
              {
                id: 1,
                title: "Self Review Submission",
                description: "Complete your self-assessment",
                dueDate: "2024-02-15",
                status: "in-progress"
              },
              {
                id: 2,
                title: "Manager Review",
                description: "Manager will review your assessment",
                dueDate: "2024-03-01",
                status: "pending"
              },
              {
                id: 3,
                title: "HR Approval",
                description: "HR will finalize the hike",
                dueDate: "2024-03-15",
                status: "pending"
              },
              {
                id: 4,
                title: "Hike Effective",
                description: "New compensation takes effect",
                dueDate: "2024-04-01",
                status: "pending"
              }
            ],
            details: {
              formsSubmitted: 0,
              approved: 0,
              clarifying: 0,
              pendingApproval: 0,
              averageRating: 0,
              departments: [employeeData.department],
              averageHike: "0%",
              hikeRange: "0% - 0%",
              highestHike: "0%",
              lowestHike: "0%"
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
                },
                {
                  title: "Learn new framework",
                  description: "Gain proficiency in React 18",
                  achievement: "Completed React course and implemented features",
                  rating: 5,
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
                },
                {
                  name: "API Performance Optimization",
                  description: "Improved response times for critical APIs",
                  impact: "Reduced latency by 40%",
                  role: "Backend Developer",
                  rating: 4,
                  manager: "Mr. Murugan (Engineering Manager)",
                  documents: []
                }
              ],
              skills: [
                {
                  name: "Quality of Work",
                  category: "Technical",
                  level: "Advanced",
                  description: "Accuracy, thoroughness, and effectiveness of work output",
                  improvement: "Implemented new code review process",
                  examples: ["Reduced bugs by 25%", "Improved documentation"],
                  rating: 4.5,
                  yearsOfExperience: 3,
                  lastUsed: "2023",
                  manager: "Mr. Murugan (Engineering Manager)",
                  documents: [],
                  questionAnswers: [
                    { question: "How do you ensure the quality of your work?", answer: "I follow strict code review processes and write comprehensive unit tests." },
                    { question: "Describe a time when you identified and fixed a quality issue in your work", answer: "Found a memory leak in our application and fixed it through profiling." },
                    { question: "What metrics or indicators do you use to measure your work quality?", answer: "Bug reports, code review feedback, and production error rates." }
                  ]
                },
                {
                  name: "Technical Skills",
                  category: "Technical",
                  level: "Advanced",
                  description: "Proficiency in job-related technical skills",
                  improvement: "Learned React 18 features",
                  examples: ["Implemented concurrent features in React", "Optimized API performance"],
                  rating: 4.0,
                  yearsOfExperience: 4,
                  lastUsed: "2023",
                  manager: "Mr. Murugan (Engineering Manager)",
                  documents: [],
                  questionAnswers: [
                    { question: "What new technical skills have you learned this cycle? Why did you choose to learn them?", answer: "Learned React 18 to stay current with frontend technologies." },
                    { question: "How have you applied your technical skills to solve a complex problem?", answer: "Used React's concurrent features to improve dashboard performance." },
                    { question: "What technical skill do you plan to improve next and why?", answer: "Plan to improve my TypeScript skills for better type safety." }
                  ]
                },
                {
                  name: "Communication",
                  category: "Soft Skills",
                  level: "Intermediate",
                  description: "Effectiveness in verbal and written communication",
                  improvement: "Improved documentation practices",
                  examples: ["Wrote API documentation", "Presented project updates to stakeholders"],
                  rating: 3.5,
                  yearsOfExperience: 2,
                  lastUsed: "2023",
                  manager: "Mr. Murugan (Engineering Manager)",
                  documents: [],
                  questionAnswers: [
                    { question: "Describe a situation where your communication skills made a difference in a project", answer: "Helped bridge gap between dev team and product managers." },
                    { question: "How do you adapt your communication style for different audiences?", answer: "Use more technical details with engineers and focus on business impact with managers." },
                    { question: "What feedback have you received about your communication skills and how have you worked on it?", answer: "Was told to be more concise in emails - now I use bullet points for key messages." }
                  ]
                }
              ],
              submittedDate: "2023-08-10",
              status: "approved",
              clarificationNotes: "",
              hikeDetails: {
                percentage: "12%",
                effectiveDate: "2023-10-01",
                newSalary: "$95,000",
                managerApproval: "Approved by Mr. Murugan on 2023-09-15",
                hrApproval: "Approved by HR on 2023-09-18"
              }
            },
            milestones: [
              {
                id: 1,
                title: "Self Review Submission",
                description: "Completed your self-assessment",
                dueDate: "2023-08-15",
                status: "completed",
                rating: 4.2
              },
              {
                id: 2,
                title: "Manager Review",
                description: "Manager reviewed your assessment",
                dueDate: "2023-08-30",
                status: "completed",
                rating: 4.5
              },
              {
                id: 3,
                title: "HR Approval",
                description: "HR approved the hike",
                dueDate: "2023-09-15",
                status: "completed"
              }
            ],
            details: {
              formsSubmitted: 1,
              approved: 1,
              clarifying: 0,
              pendingApproval: 0,
              averageRating: 4.2,
              departments: [employeeData.department],
              averageHike: "10%",
              hikeRange: "5% - 15%",
              highestHike: "15%",
              lowestHike: "5%"
            }
          }
        ];

        const reviews: ManagerReview[] = [
          {
            id: 1,
            cycleId: 2,
            cycleName: "Mid-term Review 2023",
            manager: "Mr. Murugan",
            date: "2023-09-20",
            overallRating: 4.2,
            feedback: "John has shown excellent technical skills and leadership qualities this cycle. His work on the customer portal redesign was particularly impressive. He has demonstrated strong problem-solving abilities and has been proactive in taking on additional responsibilities. There is room for improvement in documentation practices and mentoring junior team members more consistently.",
            goals: [
              {
                title: "Improve code quality",
                rating: 4,
                feedback: "Significant improvement shown in code quality metrics. The implementation of new testing practices has reduced bugs by 25%."
              },
              {
                title: "Learn new framework",
                rating: 5,
                feedback: "Excellent progress with React 18 adoption. Has already implemented several features using the new concurrent mode."
              }
            ],
            projects: [
              {
                name: "Customer Portal Redesign",
                rating: 5,
                feedback: "Excellent work leading the frontend development team. The redesign has resulted in a 30% improvement in user satisfaction scores."
              },
              {
                name: "API Performance Optimization",
                rating: 4,
                feedback: "Good work on performance improvements, could document the changes more thoroughly for future reference."
              }
            ],
            skills: [
              {
                name: "Quality of Work",
                rating: 4.5,
                feedback: "Consistently delivers high-quality work with attention to detail. The new code review process has been effective."
              },
              {
                name: "Technical Skills",
                rating: 4,
                feedback: "Strong technical skills demonstrated across the stack. Particularly strong in React development."
              },
              {
                name: "Communication",
                rating: 3.5,
                feedback: "Communicates effectively but could improve documentation practices. Presentations to stakeholders have been well-received."
              }
            ],
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
              status: "approved"
            }
          }
        ];

        setHikeCycles(data);
        setManagerReviews(reviews);
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

  const handleHomeClick = () => {
    setExpandedCycle(null);
    setActiveTab(null);
    setSidebarTab('dashboard');
    navigate('/employee', { replace: true });
  };

  const handleSidebarTabChange = (tab: SidebarTab) => {
    setSidebarTab(tab);
    setExpandedCycle(null);
    setActiveTab(null);
    setViewMode('form');
  };

  const handleTabClick = (tab: 'goals' | 'expectations' | 'feedbacks') => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleManageClick = (id: number) => {
    const cycle = hikeCycles.find(c => c.id === id);
    if (cycle?.isSubmitted) {
      setViewMode('form'); // Default to showing the form first
    }
    setExpandedCycle(expandedCycle === id ? null : id);
  };

  const handleAssessmentSubmit = (assessment: SelfAssessment) => {
  const updatedCycles = hikeCycles.map(cycle => {
    if (cycle.id === expandedCycle) {
      const updatedCycle: EmployeeHikeCycle = {
        ...cycle,
        isSubmitted: true,
        selfAssessment: {
          ...assessment,
          submittedDate: new Date().toISOString().split('T')[0],
          status: 'pending', // This now matches the exact type
          hikeDetails: {
            percentage: "Pending",
            effectiveDate: "Pending",
            newSalary: "Pending",
            managerApproval: "Pending",
            hrApproval: "Pending"
          }
        },
        completed: 1,
        pending: 0,
        details: {
          ...cycle.details!,
          formsSubmitted: 1,
          approved: 0,
          pendingApproval: 1,
          averageRating: 0
        }
      };
      return updatedCycle;
    }
    return cycle;
  });
  setHikeCycles(updatedCycles);
  setExpandedCycle(null);
};

  const activeCycle = hikeCycles.find(cycle => 
    cycle.id === expandedCycle && cycle.status === 'active' && !cycle.isSubmitted
  );

  const currentAssessments = hikeCycles.filter(cycle => 
    cycle.status === 'active' && !cycle.isSubmitted
  );

  const completedAssessments = hikeCycles.filter(cycle => 
    cycle.status === 'completed' || cycle.isSubmitted
  );

  const selectedCompletedCycle = hikeCycles.find(cycle => 
    cycle.id === expandedCycle && (cycle.status === 'completed' || cycle.isSubmitted)
  );

  const selectedManagerReview = managerReviews.find(review => 
    review.cycleId === expandedCycle
  );

  const currentReviewCycle = hikeCycles.find(cycle => cycle.status === 'active');

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          onHomeClick={handleHomeClick} 
          activeTab={sidebarTab}
          onTabChange={handleSidebarTabChange}
          role="employee"
        />
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
      <Sidebar 
        onHomeClick={handleHomeClick} 
        activeTab={sidebarTab}
        onTabChange={handleSidebarTabChange}
        role="employee"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-2">
            {employeeData.name}'s Dashboard
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {employeeData.position} | {employeeData.department}
          </p>
          
          {activeCycle ? (
            <SelfAssessmentForm
              cycle={activeCycle}
              onSubmit={handleAssessmentSubmit}
              onCancel={() => setExpandedCycle(null)}
              managerOptions={managerOptions}
            />
          ) : selectedCompletedCycle ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{selectedCompletedCycle.name}</h2>
                  <p className="text-sm text-gray-600">
                    {selectedCompletedCycle.period} • Submitted on: {selectedCompletedCycle.selfAssessment?.submittedDate}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setViewMode('form')}
                    className={`px-4 py-2 rounded ${viewMode === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    My Submission
                  </button>
                  {selectedManagerReview && (
                    <button
                      onClick={() => setViewMode('review')}
                      className={`px-4 py-2 rounded ${viewMode === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Manager Review
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedCycle(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                  >
                    Back
                  </button>
                </div>
              </div>

              {viewMode === 'form' ? (
                <div className="space-y-8">
                  <div className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Assessment Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-sm text-gray-600">Current Status</p>
                        <p className="font-medium">
                          {selectedCompletedCycle.selfAssessment?.status === 'approved' ? (
                            <span className="text-green-600">Approved</span>
                          ) : selectedCompletedCycle.selfAssessment?.status === 'clarifying' ? (
                            <span className="text-yellow-600">Clarification Needed</span>
                          ) : (
                            <span className="text-blue-600">Under Review</span>
                          )}
                        </p>
                      </div>
                      {selectedCompletedCycle.selfAssessment?.hikeDetails && (
                        <>
                          <div className="bg-gray-50 p-4 rounded">
                            <p className="text-sm text-gray-600">Hike Percentage</p>
                            <p className="font-medium">
                              {selectedCompletedCycle.selfAssessment.hikeDetails.percentage}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded">
                            <p className="text-sm text-gray-600">Effective Date</p>
                            <p className="font-medium">
                              {selectedCompletedCycle.selfAssessment.hikeDetails.effectiveDate}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {selectedCompletedCycle.selfAssessment?.status === 'clarifying' && (
                      <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <h4 className="font-medium text-yellow-800">Clarification Requested</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          {selectedCompletedCycle.selfAssessment.clarificationNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Goals Assessment</h3>
                    {selectedCompletedCycle.selfAssessment?.goals?.length ? (
                      <div className="space-y-6">
                        {selectedCompletedCycle.selfAssessment.goals.map((goal, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{goal.title}</h4>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">Rating:</span>
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {goal.rating}/5
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
                            <div className="mt-3">
                              <p className="text-sm font-medium">Achievements:</p>
                              <p className="text-sm text-gray-700">{goal.achievement}</p>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Reviewed by:</p>
                              <p className="text-sm text-gray-700">{goal.manager}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No goals submitted for this assessment.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Projects Assessment</h3>
                    {selectedCompletedCycle.selfAssessment?.projects?.length ? (
                      <div className="space-y-6">
                        {selectedCompletedCycle.selfAssessment.projects.map((project, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{project.name}</h4>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">Rating:</span>
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {project.rating}/5
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                            <div className="mt-3">
                              <p className="text-sm font-medium">Your Role:</p>
                              <p className="text-sm text-gray-700">{project.role}</p>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Impact:</p>
                              <p className="text-sm text-gray-700">{project.impact}</p>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Reviewed by:</p>
                              <p className="text-sm text-gray-700">{project.manager}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No projects submitted for this assessment.</p>
                    )}
                  </div>

                  {selectedCompletedCycle.selfAssessment?.skills?.length ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Skills Development</h3>
                      <div className="space-y-6">
                        {selectedCompletedCycle.selfAssessment.skills.map((skill, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{skill.name}</h4>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">Rating:</span>
                                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  {skill.rating}/5
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
                            <div className="mt-3">
                              <p className="text-sm font-medium">Improvements:</p>
                              <p className="text-sm text-gray-700">{skill.improvement}</p>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm font-medium">Examples:</p>
                              <p className="text-sm text-gray-700">{skill.examples}</p>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm font-medium">Reviewed by:</p>
                              <p className="text-sm text-gray-700">{skill.manager}</p>
                            </div>
                            
                            {/* Skill-specific questions */}
                            {skill.questionAnswers?.length > 0 && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium mb-2">Question Responses:</h5>
                                <div className="space-y-4">
                                  {skill.questionAnswers.map((qa, qIndex) => (
                                    <div key={qIndex} className="pl-4 border-l-2 border-gray-200">
                                      <p className="text-sm font-medium text-gray-600">{qa.question}</p>
                                      <p className="text-sm text-gray-700 mt-1">{qa.answer}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedCompletedCycle.selfAssessment?.hikeDetails && (
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Hike Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium">Hike Percentage</p>
                          <p className="text-2xl font-bold mt-1">
                            {selectedCompletedCycle.selfAssessment.hikeDetails.percentage}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">New Salary</p>
                          <p className="text-2xl font-bold mt-1">
                            {selectedCompletedCycle.selfAssessment.hikeDetails.newSalary}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Effective Date</p>
                          <p className="text-lg mt-1">
                            {selectedCompletedCycle.selfAssessment.hikeDetails.effectiveDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Manager Approval</p>
                          <p className="text-lg mt-1">
                            {selectedCompletedCycle.selfAssessment.hikeDetails.managerApproval}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">HR Approval</p>
                          <p className="text-lg mt-1">
                            {selectedCompletedCycle.selfAssessment.hikeDetails.hrApproval}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Manager Review</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-sm text-gray-600">Reviewed by</p>
                        <p className="font-medium">{selectedManagerReview?.manager}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-sm text-gray-600">Review Date</p>
                        <p className="font-medium">{selectedManagerReview?.date}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-sm text-gray-600">Overall Rating</p>
                        <p className="font-medium">{selectedManagerReview?.overallRating}/5</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Overall Feedback</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-700">{selectedManagerReview?.feedback}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Goals Feedback</h3>
                    {selectedManagerReview?.goals.length ? (
                      <div className="space-y-4">
                        {selectedManagerReview.goals.map((goal, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{goal.title}</h4>
                              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {goal.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{goal.feedback}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No goals feedback provided.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Projects Feedback</h3>
                    {selectedManagerReview?.projects.length ? (
                      <div className="space-y-4">
                        {selectedManagerReview.projects.map((project, index) => (
                          <div key={index} className="border-l-4 border-green-200 pl-4 py-2">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{project.name}</h4>
                              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                {project.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{project.feedback}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No projects feedback provided.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Skills Feedback</h3>
                    {selectedManagerReview?.skills?.length ? (
                      <div className="space-y-4">
                        {selectedManagerReview.skills.map((skill, index) => (
                          <div key={index} className="border-l-4 border-purple-200 pl-4 py-2">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{skill.name}</h4>
                              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                {skill.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{skill.feedback}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No skills feedback provided.</p>
                    )}
                  </div>

                  {selectedManagerReview?.hikeRecommendation && (
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Hike Recommendation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium">Recommended Hike</p>
                          <p className="text-2xl font-bold mt-1">
                            {selectedManagerReview.hikeRecommendation.percentage}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Status</p>
                          <p className="text-lg mt-1 capitalize">
                            {selectedManagerReview.hikeRecommendation.status === 'approved' ? (
                              <span className="text-green-600">Approved</span>
                            ) : selectedManagerReview.hikeRecommendation.status === 'clarifying' ? (
                              <span className="text-yellow-600">Clarification Needed</span>
                            ) : (
                              <span className="text-blue-600">Pending</span>
                            )}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium">Justification</p>
                          <p className="text-gray-700 mt-1">
                            {selectedManagerReview.hikeRecommendation.justification}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : sidebarTab === 'assessments' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Current Assessments</h2>
                {currentAssessments.length > 0 ? (
                  <div className="space-y-4">
                    {currentAssessments.map(cycle => (
                      <div key={cycle.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-lg">{cycle.name}</h3>
                            <p className="text-sm text-gray-600">{cycle.period}</p>
                          </div>
                          <button
                            onClick={() => handleManageClick(cycle.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                          >
                            Fill Assessment
                          </button>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm"><span className="font-medium">Due Date:</span> {cycle.dueDate}</p>
                          <p className="text-sm"><span className="font-medium">Status:</span> {cycle.isSubmitted ? 'Submitted' : 'Pending'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No current assessments available.</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Completed Assessments</h2>
                {completedAssessments.length > 0 ? (
                  <div className="space-y-4">
                    {completedAssessments.map(cycle => (
                      <div 
                        key={cycle.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleManageClick(cycle.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-lg">{cycle.name}</h3>
                            <p className="text-sm text-gray-600">{cycle.period}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              cycle.selfAssessment?.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : cycle.selfAssessment?.status === 'clarifying'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {cycle.selfAssessment?.status === 'approved' 
                                ? 'Approved' 
                                : cycle.selfAssessment?.status === 'clarifying'
                                ? 'Clarification Needed'
                                : 'Under Review'}
                            </span>
                            <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                              Completed
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm"><span className="font-medium">Submitted On:</span> {cycle.selfAssessment?.submittedDate}</p>
                          {cycle.details?.averageRating ? (
                            <p className="text-sm"><span className="font-medium">Rating:</span> {cycle.details.averageRating}/5</p>
                          ) : null}
                          {cycle.selfAssessment?.hikeDetails?.percentage !== 'Pending' && (
                            <p className="text-sm"><span className="font-medium">Hike:</span> {cycle.selfAssessment?.hikeDetails?.percentage}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No completed assessments yet.</p>
                )}
              </div>
            </div>
          ) : sidebarTab === 'reviews' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Manager Reviews</h2>
              {managerReviews.length > 0 ? (
                <div className="space-y-6">
                  {managerReviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{review.cycleName}</h3>
                          <p className="text-sm text-gray-600">Reviewed by: {review.manager}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold mr-2">{review.overallRating}</span>
                          <span className="text-sm text-gray-500">/5.0</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Overall Feedback</h4>
                        <p className="text-gray-700">{review.feedback}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Strengths</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {review.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Areas for Improvement</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {review.areasForImprovement.map((area, i) => (
                              <li key={i}>{area}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Detailed Feedback</h4>
                        <div className="space-y-4">
                          {review.goals.map((goal, i) => (
                            <div key={`goal-${i}`} className="border-l-4 border-blue-200 pl-4">
                              <h5 className="font-medium">{goal.title}</h5>
                              <p className="text-sm text-gray-600">Rating: {goal.rating}/5</p>
                              <p className="text-gray-700 mt-1">{goal.feedback}</p>
                            </div>
                          ))}
                          
                          {review.projects.map((project, i) => (
                            <div key={`project-${i}`} className="border-l-4 border-green-200 pl-4">
                              <h5 className="font-medium">{project.name}</h5>
                              <p className="text-sm text-gray-600">Rating: {project.rating}/5</p>
                              <p className="text-gray-700 mt-1">{project.feedback}</p>
                            </div>
                          ))}

                          {review.skills?.map((skill, i) => (
                            <div key={`skill-${i}`} className="border-l-4 border-purple-200 pl-4">
                              <h5 className="font-medium">{skill.name}</h5>
                              <p className="text-sm text-gray-600">Rating: {skill.rating}/5</p>
                              <p className="text-gray-700 mt-1">{skill.feedback}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {review.hikeRecommendation && (
                        <div className="mt-6 bg-blue-50 p-4 rounded">
                          <h4 className="font-medium mb-2">Hike Recommendation</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Percentage</p>
                              <p className="font-medium">{review.hikeRecommendation.percentage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <p className="font-medium capitalize">{review.hikeRecommendation.status}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-600">Justification</p>
                              <p className="text-gray-700">{review.hikeRecommendation.justification}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No manager reviews available yet.</p>
              )}
            </div>
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

              {currentReviewCycle && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-6">
                    Current Review Status: {currentReviewCycle.name}
                  </h2>

                  <div className="relative">
                    {/* Segmented Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 flex z-0">
                      {currentReviewCycle.milestones.map((milestone, index) => {
                        if (index === currentReviewCycle.milestones.length - 1) return null;

                        const current = currentReviewCycle.milestones[index];
                        const next = currentReviewCycle.milestones[index + 1];

                        // Only show blue if the current milestone is completed
                        const isCompleted = current.status === 'completed';

                        return (
                          <div
                            key={`line-${index}`}
                            className={`flex-1 h-1 ${
                              isCompleted ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {/* Milestones */}
                    <div className="relative flex justify-between items-start z-10">
                      {currentReviewCycle.milestones.map((milestone, index) => {
                        const isCompleted = milestone.status === 'completed';
                        const isInProgress = milestone.status === 'in-progress';

                        return (
                          <div key={milestone.id} className="flex flex-col items-center w-1/4 text-center">
                            {/* Circle */}
                            <div
                              className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 text-sm font-semibold
                                ${isCompleted
                                  ? 'bg-green-500 text-white'
                                  : isInProgress
                                  ? 'bg-blue-500 text-white animate-pulse'
                                  : 'bg-gray-300 text-gray-600'
                                }`}
                            >
                              {isCompleted ? '✓' : index + 1}
                            </div>

                            {/* Title */}
                            <p
                              className={`text-sm font-medium mb-1
                                ${isCompleted
                                  ? 'text-green-600'
                                  : isInProgress
                                  ? 'text-blue-600'
                                  : 'text-gray-500'
                                }`}
                            >
                              {milestone.title}
                            </p>

                            {/* Due Date */}
                            <p className="text-xs text-gray-500 mb-1">{milestone.dueDate}</p>

                            {/* Start Now Button */}
                            {isInProgress && (
                              <button
                                onClick={() => handleManageClick(currentReviewCycle.id)}
                                className="mt-1 text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                              >
                                Start Now
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
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