import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import EmployeeReviewList from '../../components/EmployeeReviewList';
import TeamPerformanceChart from '../../components/TeamPerformanceChart';
import ProjectReview from '../../components/ProjectReview';
import GoalReview from '../../components/GoalReview';
import OverallReview from '../../components/OverallReview';
import { Review } from '../../types/reviewTypes';

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<'newReview' | 'teamGoals' | 'reports' | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<'goals' | 'projects' | 'overall'>('goals');
  const [isViewingCompletedReview, setIsViewingCompletedReview] = useState(false);
  
  const stats = [
    { title: 'Team Members', value: 8, icon: '👥' },
    { title: 'Pending Reviews', value: 5, icon: '⏳' },
    { title: 'Completed Reviews', value: 3, icon: '✅' },
    { title: 'Average Team Rating', value: 4.1, icon: '⭐' },
  ];

  const pendingReviews: Review[] = [
    { 
      id: 1, 
      name: 'John Doe', 
      position: 'Senior Frontend Developer', 
      selfRating: 4, 
      deadline: '2023-06-25',
      goals: [
        {
          title: 'Improve React Performance',
          selfRating: 4,
          description: 'Optimize existing React components to improve application performance by 20%',
          achievement: 'Successfully implemented memoization and lazy loading, achieving 25% performance improvement',
          managerRating: 4,
          managerComments: 'Excellent work on performance optimization. The implementation was thorough and well-documented.'
        }
      ],
      projects: [
        {
          title: 'Customer Dashboard Redesign',
          role: 'Lead Frontend Developer',
          selfRating: 4,
          description: 'Complete redesign of customer-facing dashboard with modern UI/UX',
          impact: 'Improved user satisfaction by 40% based on surveys',
          managerRating: 4.5,
          managerComments: 'The redesign was very well received by users. Great attention to detail in the UI implementation.'
        }
      ]
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      position: 'UX Designer', 
      selfRating: 3, 
      deadline: '2023-06-26',
      goals: [
        {
          title: 'Improve Design System',
          selfRating: 3,
          description: 'Update design system components for better consistency',
          achievement: 'Created 15 new components and documented usage guidelines',
          managerRating: 3.5,
          managerComments: 'Good progress on the design system. Could improve documentation with more examples.'
        }
      ],
      projects: [
        {
          title: 'Mobile App Redesign',
          role: 'Lead Designer',
          selfRating: 4,
          description: 'Complete visual refresh of mobile application',
          impact: 'Increased user engagement by 25%',
          managerRating: 4,
          managerComments: 'The redesign significantly improved engagement metrics. Well done!'
        }
      ]
    },
  ];

  const completedReviews: Review[] = [
    { 
      id: 4, 
      name: 'Sarah Williams', 
      position: 'Product Manager', 
      selfRating: 4, 
      managerRating: 4.5,
      deadline: '2023-05-15',
      goals: [
        {
          title: 'Product Roadmap Completion',
          selfRating: 4,
          description: 'Deliver complete product roadmap for Q2',
          achievement: 'Completed roadmap with 100% stakeholder approval',
          managerRating: 4.5,
          managerComments: 'Excellent roadmap planning and stakeholder management'
        }
      ],
      projects: [
        {
          title: 'Feature Launch',
          role: 'Product Lead',
          selfRating: 5,
          description: 'Successfully launch new product feature',
          impact: 'Increased user retention by 15%',
          managerRating: 4.5,
          managerComments: 'Feature launch was very successful with positive user feedback'
        }
      ],
      overallFeedback: 'Sarah has performed exceptionally well this quarter, delivering all planned features on time and exceeding expectations in stakeholder management.'
    },
    { 
      id: 5, 
      name: 'David Brown', 
      position: 'DevOps Engineer', 
      selfRating: 3, 
      managerRating: 3.5,
      deadline: '2023-05-20',
      goals: [
        {
          title: 'CI/CD Pipeline Improvement',
          selfRating: 3,
          description: 'Reduce deployment times by 30%',
          achievement: 'Achieved 25% reduction in deployment times',
          managerRating: 3.5,
          managerComments: 'Good progress on pipeline improvements, though fell slightly short of target'
        }
      ],
      projects: [
        {
          title: 'Infrastructure Upgrade',
          role: 'Lead DevOps',
          selfRating: 4,
          description: 'Upgrade server infrastructure to latest version',
          impact: 'Improved system stability and reduced downtime',
          managerRating: 4,
          managerComments: 'Smooth infrastructure upgrade with minimal downtime'
        }
      ],
      overallFeedback: 'David made good progress on his goals but could benefit from more proactive communication about challenges faced.'
    },
  ];

  const teamGoals = [
    { title: 'Improve Code Quality', progress: 65, target: 'Reduce bugs by 25%' },
    { title: 'Increase Velocity', progress: 45, target: 'Deliver 10% more features' },
    { title: 'Team Training', progress: 80, target: 'Complete all training modules' },
  ];

  const reports = [
    { title: 'Q2 Performance Summary', date: '2023-06-15', type: 'PDF' },
    { title: 'Team Skill Matrix', date: '2023-05-30', type: 'Excel' },
    { title: 'Employee Engagement Survey', date: '2023-04-20', type: 'PDF' },
  ];

  const handleHomeClick = () => {
    navigate('/manager', { replace: true });
  };

  const handleActionClick = (action: 'newReview' | 'teamGoals' | 'reports') => {
    setActiveAction(activeAction === action ? null : action);
  };

  const handleReviewClick = (review: Review, isCompleted: boolean) => {
    setSelectedReview(review);
    setIsViewingCompletedReview(isCompleted);
    setActiveReviewTab('goals');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onHomeClick={handleHomeClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">Manager Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <DashboardCard 
                key={index} 
                title={stat.title} 
                value={stat.value} 
                icon={stat.icon}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Employee Reviews</h2>
              <div className="space-y-6">
                <EmployeeReviewList 
                  title="Pending Your Review" 
                  reviews={pendingReviews} 
                  status="pending"
                  onReviewClick={(review) => handleReviewClick(review, false)}
                />
                <EmployeeReviewList 
                  title="Completed Reviews" 
                  reviews={completedReviews} 
                  status="completed"
                  onReviewClick={(review) => handleReviewClick(review, true)}
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
              <TeamPerformanceChart />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                className={`py-2 px-4 rounded transition-colors ${
                  activeAction === 'teamGoals' 
                    ? 'bg-green-700 text-white' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                } flex items-center gap-2`}
                onClick={() => handleActionClick('teamGoals')}
              >
                <span>🎯</span> View Team Goals
              </button>
              <button 
                className={`py-2 px-4 rounded transition-colors ${
                  activeAction === 'reports' 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } flex items-center gap-2`}
                onClick={() => handleActionClick('reports')}
              >
                <span>📊</span> Generate Reports
              </button>
            </div>
          </div>

          {activeAction && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {activeAction === 'newReview' && 'Start New Review'}
                {activeAction === 'teamGoals' && 'Team Goals'}
                {activeAction === 'reports' && 'Available Reports'}
              </h3>
              
              {activeAction === 'newReview' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Select Employee</label>
                    <select className="border border-gray-300 rounded p-2">
                      <option>John Doe (Software Engineer)</option>
                      <option>Jane Smith (UX Designer)</option>
                      <option>Mike Johnson (QA Engineer)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Review Type</label>
                    <select className="border border-gray-300 rounded p-2">
                      <option>Quarterly Performance Review</option>
                      <option>Annual Performance Review</option>
                      <option>Project Completion Review</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Deadline</label>
                    <input type="date" className="border border-gray-300 rounded p-2" />
                  </div>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4 flex items-center gap-2">
                    <span>📝</span> Create Review
                  </button>
                </div>
              )}

              {activeAction === 'teamGoals' && (
                <div className="space-y-6">
                  {teamGoals.map((goal, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        <span className="text-sm font-medium">
                          {goal.progress}% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">Target: {goal.target}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeAction === 'reports' && (
                <div className="space-y-6">
                  {reports.map((report, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {report.date}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">{report.type}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          <span>⬇️</span> Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedReview.name}</h2>
                  <p className="text-gray-600">{selectedReview.position}</p>
                  {isViewingCompletedReview && (
                    <div className="mt-2">
                      <p className="text-sm">Self Rating: {selectedReview.selfRating}/5</p>
                      <p className="text-sm">Your Rating: {selectedReview.managerRating}/5</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setSelectedReview(null);
                    setIsViewingCompletedReview(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isViewingCompletedReview ? (
                <>
                  <div className="flex border-b mb-6">
                    <button
                      className={`py-2 px-4 ${activeReviewTab === 'goals' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('goals')}
                    >
                      <span className="mr-2">🎯</span>Goals
                    </button>
                    <button
                      className={`py-2 px-4 ${activeReviewTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('projects')}
                    >
                      <span className="mr-2">📂</span>Projects
                    </button>
                    <button
                      className={`py-2 px-4 ${activeReviewTab === 'overall' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('overall')}
                    >
                      <span className="mr-2">📝</span>Overall Feedback
                    </button>
                  </div>

                  {activeReviewTab === 'goals' && (
                    <div className="space-y-6">
                      {selectedReview.goals?.map((goal, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold mb-2">🎯 {goal.title}</h3>
                          <p className="text-gray-700 mb-2"><strong>Description:</strong> {goal.description}</p>
                          <p className="text-gray-700 mb-2"><strong>Achievement:</strong> {goal.achievement}</p>
                          <div className="mt-3 space-y-2">
                            <p className="text-sm">Self Rating: {goal.selfRating}/5</p>
                            <p className="text-sm">Your Rating: {goal.managerRating}/5</p>
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-sm font-medium text-gray-700">Your Feedback:</p>
                              <p className="text-sm text-gray-600">{goal.managerComments}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeReviewTab === 'projects' && (
                    <div className="space-y-6">
                      {selectedReview.projects?.map((project, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold mb-2">📂 {project.title}</h3>
                          <p className="text-gray-600 mb-2">Role: {project.role}</p>
                          <p className="text-gray-700 mb-2"><strong>Description:</strong> {project.description}</p>
                          <p className="text-gray-700 mb-2"><strong>Impact:</strong> {project.impact}</p>
                          <div className="mt-3 space-y-2">
                            <p className="text-sm">Self Rating: {project.selfRating}/5</p>
                            <p className="text-sm">Your Rating: {project.managerRating}/5</p>
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-sm font-medium text-gray-700">Your Feedback:</p>
                              <p className="text-sm text-gray-600">{project.managerComments}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeReviewTab === 'overall' && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="text-lg font-semibold mb-2">📝 Overall Feedback</h3>
                      <p className="text-gray-700">{selectedReview.overallFeedback}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex border-b mb-6">
                    <button
                      className={`py-2 px-4 ${activeReviewTab === 'goals' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('goals')}
                    >
                      <span className="mr-2">🎯</span>Goals Review
                    </button>
                    <button
                      className={`py-2 px-4 ${activeReviewTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('projects')}
                    >
                      <span className="mr-2">📂</span>Projects Review
                    </button>
                    <button
                      className={`py-2 px-4 ${activeReviewTab === 'overall' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('overall')}
                    >
                      <span className="mr-2">📝</span>Overall Feedback
                    </button>
                  </div>

                  {activeReviewTab === 'goals' && (
                    <div className="space-y-8">
                      {selectedReview.goals?.map((goal, index) => (
                        <GoalReview key={index} goal={goal} />
                      ))}
                    </div>
                  )}

                  {activeReviewTab === 'projects' && (
                    <div className="space-y-8">
                      {selectedReview.projects?.map((project, index) => (
                        <ProjectReview key={index} project={project} />
                      ))}
                    </div>
                  )}

                  {activeReviewTab === 'overall' && (
                    <OverallReview employee={{
                      name: selectedReview.name,
                      position: selectedReview.position
                    }} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;