import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import EmployeeReviewList from '../../components/EmployeeReviewList';
import PieChart from '../../components/PieChart';
import { FaFileCsv, FaFilter, FaSearch, FaChartBar, FaChartLine, FaChartPie, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Review, SkillCategory, SkillQuestion } from '../../types/reviewTypes';
import { CSVLink } from 'react-csv';


interface RatingDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

type RatingOption = {
  value: number;
  label: string;
  definition: string;
};

const ratingOptions: RatingOption[] = [
  { 
    value: 1, 
    label: "1 - Poor", 
    definition: "Performance is consistently below expectations. Significant improvement is needed." 
  },
  { 
    value: 2, 
    label: "2 - Fair", 
    definition: "Performance occasionally meets expectations but often falls short. Improvement is needed." 
  },
  { 
    value: 3, 
    label: "3 - Good", 
    definition: "Performance meets expectations. Consistently delivers required results." 
  },
  { 
    value: 4, 
    label: "4 - Very Good", 
    definition: "Performance frequently exceeds expectations. Delivers high quality results." 
  },
  { 
    value: 5, 
    label: "5 - Excellent", 
    definition: "Performance consistently exceeds expectations. Exceptional quality and initiative." 
  }
];

const RatingDropdown: React.FC<RatingDropdownProps> = ({ value, onChange }) => {
  const [showGuide, setShowGuide] = useState(false);
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative">
          <select 
            className="border border-gray-300 rounded p-2 pr-8 appearance-none bg-white"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          >
            {ratingOptions.map((option: RatingOption) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="text-gray-500 hover:text-gray-700 text-sm"
          aria-label="Show rating guide"
        >
          {showGuide ? 'Hide Guide' : 'Show Guide'}
        </button>
      </div>
      
      {/* Enhanced Rating Guide */}
      {showGuide && (
        <div className="absolute z-10 mt-1 w-72 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <h4 className="font-semibold mb-2 text-sm">Rating Scale Guide</h4>
          <ul className="space-y-2 text-xs">
            {ratingOptions.map((option) => (
              <li key={option.value} className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-gray-600">{option.definition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface TeamReviewCycle {
  id: number;
  name: string;
  type: string;
  status: 'active' | 'completed';
  period: string;
  dueDate: string;
  participants: number;
  completed: number;
  pending: number;
  manager: string;
  details: {
    formsSubmitted: number;
    approved: number;
    clarifying: number;
    pendingApproval: number;
    averageRating: number;
    departments: string[];
  };
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      borderRadius: number;
      barPercentage: number;
    }[];
  };
}

interface ReportData {
  Name: string;
  Type: string;
  Status: string;
  Period: string;
  'Due Date': string;
  Participants: number;
  Completed: number;
  'Average Rating'?: number;
  'Forms Submitted'?: number;
  Approved?: number;
  'Pending Approval'?: number;
  Clarifying?: number;
}

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reviews' | 'reports'>('dashboard');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<'goals' | 'projects' | 'overall' | 'skills'>('goals');
  const [isViewingCompletedReview, setIsViewingCompletedReview] = useState(false);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<number>(1);

  const stats = [
    { title: 'Team Members', value: 8, icon: '👥', trend: 'up' },
    { title: 'Pending Reviews', value: 5, icon: '⏳', trend: 'down' },
    { title: 'Completed Reviews', value: 3, icon: '✅', trend: 'up' },
    { title: 'Average Team Rating', value: 4.1, icon: '⭐', trend: 'neutral' },
  ] as const;

  const [pendingReviews, setPendingReviews] = useState<Review[]>([
    { 
      id: 1, 
      name: 'John Doe', 
      position: 'Senior Frontend Developer', 
      selfRating: 4, 
      deadline: '2023-06-25',
      goals: [
        {
          id:1,
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
          id:1,
          title: 'Customer Dashboard Redesign',
          role: 'Lead Frontend Developer',
          selfRating: 4,
          description: 'Complete redesign of customer-facing dashboard with modern UI/UX',
          impact: 'Improved user satisfaction by 40% based on surveys',
          managerRating: 4.5,
          managerComments: 'The redesign was very well received by users. Great attention to detail in the UI implementation.'
        }
      ],
      skills: [
        {
          category: 'Technical Skills',
          description: 'Evaluation of core technical competencies',
          questions: [
            {
              id:1,
              question: 'Demonstrates strong proficiency in React and TypeScript',
              selfRating: 4,
              managerRating: 4.5,
              managerComments: 'John has excellent technical skills and is a go-to resource for complex React issues',
              examples: ['Implemented complex state management solution'],
              improvementAreas: ['Could explore more advanced TypeScript patterns']
            },
            {
              id:2,
              question: 'Ability to debug and solve complex problems',
              selfRating: 4,
              managerRating: 4,
              managerComments: 'Consistently solves difficult technical challenges',
              examples: ['Resolved critical production issue within 2 hours'],
              improvementAreas: ['Document solutions more thoroughly']
            }
          ]
        },
        {
          category: 'Communication',
          description: 'Effectiveness in team communication',
          questions: [
            {
              id:3,
              question: 'Clearly communicates technical concepts to team members',
              selfRating: 3,
              managerRating: 3.5,
              managerComments: 'Could improve documentation of complex solutions',
              examples: ['Led knowledge sharing session on new framework'],
              improvementAreas: ['More detailed technical documentation']
            }
          ]
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
          id:1,
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
          id:1,
          title: 'Mobile App Redesign',
          role: 'Lead Designer',
          selfRating: 4,
          description: 'Complete visual refresh of mobile application',
          impact: 'Increased user engagement by 25%',
          managerRating: 4,
          managerComments: 'The redesign significantly improved engagement metrics. Well done!'
        }
      ],
      skills: [
        {
          category: 'UI/UX Design',
          description: 'Core design skills and user experience',
          questions: [
            {
              id:1,
              question: 'Creates intuitive and user-friendly interfaces',
              selfRating: 4,
              managerRating: 4.5,
              managerComments: 'Jane has an excellent eye for design and usability',
              examples: ['Redesigned checkout flow increased conversion by 15%'],
              improvementAreas: ['More A/B testing of design variations']
            }
          ]
        },
        {
          category: 'Collaboration',
          description: 'Working with cross-functional teams',
          questions: [
            {
              id:1,
              question: 'Works effectively with developers to implement designs',
              selfRating: 3,
              managerRating: 3,
              managerComments: 'Could provide more detailed design specifications',
              examples: ['Improved handoff process with dev team'],
              improvementAreas: ['More detailed design system documentation']
            }
          ]
        }
      ]
    },
  ]);

  const [completedReviews, setCompletedReviews] = useState<Review[]>([
    { 
      id: 4, 
      name: 'Sarah Williams', 
      position: 'Product Manager', 
      selfRating: 4, 
      managerRating: 4.5,
      deadline: '2023-05-15',
      goals: [
        {
          id:1,
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
          id:1,
          title: 'Feature Launch',
          role: 'Product Lead',
          selfRating: 5,
          description: 'Successfully launch new product feature',
          impact: 'Increased user retention by 15%',
          managerRating: 4.5,
          managerComments: 'Feature launch was very successful with positive user feedback'
        }
      ],
      skills: [
        {
          category: 'Product Management',
          description: 'Core product management competencies',
          questions: [
            {
              id :2,
              question: 'Effectively prioritizes product features',
              selfRating: 4,
              managerRating: 4.5,
              managerComments: 'Excellent prioritization skills based on business value',
              examples: ['Implemented new prioritization framework'],
              improvementAreas: ['More data-driven prioritization']
            }
          ]
        },
        {
          category: 'Leadership',
          description: 'Team leadership and guidance',
          questions: [
            {
              id:3,
              question: 'Motivates and guides the product team',
              selfRating: 4,
              managerRating: 4,
              managerComments: 'Strong leadership skills demonstrated',
              examples: ['Led team through challenging product pivot'],
              improvementAreas: ['More frequent 1:1s with team members']
            }
          ]
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
          id:1,
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
          id:2,
          title: 'Infrastructure Upgrade',
          role: 'Lead DevOps',
          selfRating: 4,
          description: 'Upgrade server infrastructure to latest version',
          impact: 'Improved system stability and reduced downtime',
          managerRating: 4,
          managerComments: 'Smooth infrastructure upgrade with minimal downtime'
        }
      ],
      skills: [
        {
          category: 'Technical Skills',
          description: 'DevOps technical expertise',
          questions: [
            {
              id:2,
              question: 'Maintains and improves deployment infrastructure',
              selfRating: 4,
              managerRating: 4,
              managerComments: 'Solid technical skills in DevOps area',
              examples: ['Implemented automated rollback system'],
              improvementAreas: ['More documentation of infrastructure changes']
            }
          ]
        },
        {
          category: 'Communication',
          description: 'Technical communication skills',
          questions: [
            {
              id:2,
              question: 'Documents processes and changes clearly',
              selfRating: 3,
              managerRating: 3,
              managerComments: 'Could improve documentation of infrastructure changes',
              examples: ['Created new onboarding docs for DevOps'],
              improvementAreas: ['More detailed change logs']
            }
          ]
        }
      ],
      overallFeedback: 'David made good progress on his goals but could benefit from more proactive communication about challenges faced.'
    },
  ]);

  const teamReviewCycles: TeamReviewCycle[] = [
    {
      id: 1,
      name: "Annual Review 2024 - Engineering Team",
      type: "Annual",
      status: "active",
      period: "2024-01-01 to 2024-03-31",
      dueDate: "2024-03-31",
      participants: 12,
      completed: 5,
      pending: 7,
      manager: "Mr. Murugan",
      details: {
        formsSubmitted: 10,
        approved: 3,
        clarifying: 2,
        pendingApproval: 5,
        averageRating: 3.9,
        departments: ['Engineering']
      },
      chartData: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Technical Skills',
            data: [3.8, 4.0, 4.1],
            backgroundColor: ['#3b82f6'],
            borderColor: ['#2563eb'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Communication',
            data: [3.5, 3.6, 3.7],
            backgroundColor: ['#10b981'],
            borderColor: ['#059669'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Productivity',
            data: [3.9, 4.0, 4.1],
            backgroundColor: ['#f59e0b'],
            borderColor: ['#d97706'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Teamwork',
            data: [4.0, 4.1, 4.1],
            backgroundColor: ['#8b5cf6'],
            borderColor: ['#7c3aed'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          }
        ]
      }
    },
    {
      id: 2,
      name: "Mid-term Review 2024 - Engineering Team",
      type: "Mid-term",
      status: "completed",
      period: "2024-07-01 to 2024-09-30",
      dueDate: "2024-09-30",
      participants: 12,
      completed: 12,
      pending: 0,
      manager: "Mr. Murugan",
      details: {
        formsSubmitted: 12,
        approved: 11,
        clarifying: 1,
        pendingApproval: 0,
        averageRating: 4.2,
        departments: ['Engineering']
      },
      chartData: {
        labels: ['Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Technical Skills',
            data: [4.0, 4.1, 4.2],
            backgroundColor: ['#3b82f6'],
            borderColor: ['#2563eb'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Communication',
            data: [3.8, 3.9, 4.0],
            backgroundColor: ['#10b981'],
            borderColor: ['#059669'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Productivity',
            data: [4.1, 4.2, 4.2],
            backgroundColor: ['#f59e0b'],
            borderColor: ['#d97706'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Teamwork',
            data: [4.1, 4.2, 4.3],
            backgroundColor: ['#8b5cf6'],
            borderColor: ['#7c3aed'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          }
        ]
      }
    },
    {
      id: 3,
      name: "Q1 Performance Review 2025 - Engineering Team",
      type: "Quarterly",
      status: "completed",
      period: "2025-01-01 to 2025-03-31",
      dueDate: "2025-03-31",
      participants: 15,
      completed: 15,
      pending: 0,
      manager: "Mr. Murugan",
      details: {
        formsSubmitted: 15,
        approved: 14,
        clarifying: 1,
        pendingApproval: 0,
        averageRating: 4.3,
        departments: ['Engineering']
      },
      chartData: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Technical Skills',
            data: [4.2, 4.3, 4.4],
            backgroundColor: ['#3b82f6'],
            borderColor: ['#2563eb'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Communication',
            data: [4.0, 4.1, 4.2],
            backgroundColor: ['#10b981'],
            borderColor: ['#059669'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Productivity',
            data: [4.2, 4.3, 4.4],
            backgroundColor: ['#f59e0b'],
            borderColor: ['#d97706'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'Teamwork',
            data: [4.3, 4.3, 4.4],
            backgroundColor: ['#8b5cf6'],
            borderColor: ['#7c3aed'],
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
          }
        ]
      }
    }
  ];

  const pieChartData = [
    { name: 'Pending', value: pendingReviews.length, color: '#3B82F6' },
    { name: 'Completed', value: completedReviews.length, color: '#10B981' },
    { name: 'Overdue', value: 2, color: '#F59E0B' }
  ];

  const handleHomeClick = () => {
    navigate('/manager', { replace: true });
    setActiveTab('dashboard');
  };

  const handleTabChange = (tab: 'dashboard' | 'reviews' | 'reports') => {
    setActiveTab(tab);
  };

  const handleReviewClick = (review: Review, isCompleted: boolean) => {
    setSelectedReview(review);
    setIsViewingCompletedReview(isCompleted);
    setActiveReviewTab('goals');
    setOverallFeedback(review.overallFeedback || '');
  };

  const handleCycleChange = (cycleId: number) => {
    setSelectedCycle(cycleId);
  };

  const handleSkillRatingChange = (reviewId: number, categoryIndex: number, questionIndex: number, value: number) => {
    const updatedReviews = pendingReviews.map(review => {
      if (review.id === reviewId) {
        const updatedSkills = [...review.skills || []];
        const updatedCategory = {...updatedSkills[categoryIndex]};
        const updatedQuestions = [...updatedCategory.questions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          managerRating: value
        };
        
        updatedCategory.questions = updatedQuestions;
        updatedSkills[categoryIndex] = updatedCategory;
        
        return {
          ...review,
          skills: updatedSkills
        };
      }
      return review;
    });
    
    setPendingReviews(updatedReviews);
    
    if (selectedReview && selectedReview.id === reviewId) {
      const updatedSelectedReview = updatedReviews.find(r => r.id === reviewId);
      if (updatedSelectedReview) {
        setSelectedReview(updatedSelectedReview);
      }
    }
  };

  const handleSkillCommentsChange = (reviewId: number, categoryIndex: number, questionIndex: number, comments: string) => {
    const updatedReviews = pendingReviews.map(review => {
      if (review.id === reviewId) {
        const updatedSkills = [...review.skills || []];
        const updatedCategory = {...updatedSkills[categoryIndex]};
        const updatedQuestions = [...updatedCategory.questions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          managerComments: comments
        };
        
        updatedCategory.questions = updatedQuestions;
        updatedSkills[categoryIndex] = updatedCategory;
        
        return {
          ...review,
          skills: updatedSkills
        };
      }
      return review;
    });
    
    setPendingReviews(updatedReviews);
    
    if (selectedReview && selectedReview.id === reviewId) {
      const updatedSelectedReview = updatedReviews.find(r => r.id === reviewId);
      if (updatedSelectedReview) {
        setSelectedReview(updatedSelectedReview);
      }
    }
  };

  const handleSkillImprovementChange = (
    reviewId: number, 
    categoryIndex: number, 
    questionIndex: number, 
    improvement: string
  ) => {
    const updatedReviews = pendingReviews.map(review => {
      if (review.id === reviewId) {
        const updatedSkills = [...review.skills || []];
        const updatedCategory = {...updatedSkills[categoryIndex]};
        const updatedQuestions = [...updatedCategory.questions];
        
        const improvementsArray = improvement.split('\n').filter(line => line.trim() !== '');
        
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          improvementAreas: improvementsArray
        };
        
        updatedCategory.questions = updatedQuestions;
        updatedSkills[categoryIndex] = updatedCategory;
        
        return {
          ...review,
          skills: updatedSkills
        };
      }
      return review;
    });
    
    setPendingReviews(updatedReviews);
    
    if (selectedReview && selectedReview.id === reviewId) {
      const updatedSelectedReview = updatedReviews.find(r => r.id === reviewId);
      if (updatedSelectedReview) {
        setSelectedReview(updatedSelectedReview);
      }
    }
  };

  const handleGoalRatingChange = (reviewId: number, goalIndex: number, value: number) => {
    const updatedReviews = pendingReviews.map(review => {
      if (review.id === reviewId) {
        if (!review.goals) return review;

        const updatedGoals = [...review.goals];
        updatedGoals[goalIndex] = {
          ...updatedGoals[goalIndex],
          managerRating: value
        };
        return {
          ...review,
          goals: updatedGoals
        };
      }
      return review;
    });

    setPendingReviews(updatedReviews);

    if (selectedReview?.id === reviewId) {
      const updatedSelectedReview = updatedReviews.find(r => r.id === reviewId);
      if (updatedSelectedReview) {
        setSelectedReview(updatedSelectedReview);
      }
    }
  };

  const handleGoalCommentsChange = (reviewId: number, goalIndex: number, comments: string) => {
    const updatedReviews = pendingReviews.map(review => {
      if (review.id === reviewId) {
        if (!review.goals) return review;

        const updatedGoals = [...review.goals];
        updatedGoals[goalIndex] = {
          ...updatedGoals[goalIndex],
          managerComments: comments
        };
        return {
          ...review,
          goals: updatedGoals
        };
      }
      return review;
    });

    setPendingReviews(updatedReviews);

    if (selectedReview?.id === reviewId) {
      const updatedSelectedReview = updatedReviews.find(r => r.id === reviewId);
      if (updatedSelectedReview) {
        setSelectedReview(updatedSelectedReview);
      }
    }
  };

  const handleProjectRatingChange = (reviewId: number, projectIndex: number, value: number) => {
    const updatedReviews = pendingReviews.map(review => {
      if (review.id === reviewId) {
        if (!review.projects) return review;

        const updatedProjects = [...review.projects];
        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],
          managerRating: value
        };
        return {
          ...review,
          projects: updatedProjects
        };
      }
      return review;
    });

    setPendingReviews(updatedReviews);

    if (selectedReview?.id === reviewId) {
      const updatedSelectedReview = updatedReviews.find(r => r.id === reviewId);
      if (updatedSelectedReview) {
        setSelectedReview(updatedSelectedReview);
      }
    }
  };

  const handleProjectCommentsChange = (reviewId: number, projectIndex: number, comments: string) => {
    const updatedReviews = pendingReviews.map(review => {
      if (review.id === reviewId) {
        if (!review.projects) return review;

        const updatedProjects = [...review.projects];
        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],
          managerComments: comments
        };
        return {
          ...review,
          projects: updatedProjects
        };
      }
      return review;
    });

    setPendingReviews(updatedReviews);

    if (selectedReview?.id === reviewId) {
      const updatedSelectedReview = updatedReviews.find(r => r.id === reviewId);
      if (updatedSelectedReview) {
        setSelectedReview(updatedSelectedReview);
      }
    }
  };

  const renderRatingDisplay = (rating: number) => {
    const option = ratingOptions.find(opt => opt.value === rating) || ratingOptions[2];
    return (
      <div className="flex items-center">
        <span className="font-medium">{rating} - </span>
        <span className="ml-1">{option.label.split('- ')[1]}</span>
      </div>
    );
  };

  const renderReportsContent = () => {
    const filteredCycles = teamReviewCycles.filter(cycle => {
      const matchesSearch = cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cycle.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || cycle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const csvData: ReportData[] = filteredCycles.map(cycle => ({
      Name: cycle.name,
      Type: cycle.type,
      Status: cycle.status,
      Period: cycle.period,
      'Due Date': cycle.dueDate,
      Participants: cycle.participants,
      Completed: cycle.completed,
      'Average Rating': cycle.details?.averageRating,
      'Forms Submitted': cycle.details?.formsSubmitted,
      Approved: cycle.details?.approved,
      'Pending Approval': cycle.details?.pendingApproval,
      Clarifying: cycle.details?.clarifying
    }));

    const toggleExpand = (id: number) => {
      setExpandedCycle(expandedCycle === id ? null : id);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">Team Performance Reports</h2>

          <div className="flex flex-col md:flex-row md:justify-end gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
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

            <div className="relative w-full md:w-48">
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
              filename={`team-performance-reviews-${new Date().toISOString().slice(0, 10)}.csv`}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <FaFileCsv /> Export CSV
            </CSVLink>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                                  <p><span className="font-medium">Forms Submitted:</span> {cycle.details.formsSubmitted} ({Math.round((cycle.details.formsSubmitted / cycle.participants) * 100)}%)</p>
                                  <p><span className="font-medium">Approved:</span> {cycle.details.approved}</p>
                                  <p><span className="font-medium">Pending Approval:</span> {cycle.details.pendingApproval}</p>
                                  <p><span className="font-medium">Needs Clarification:</span> {cycle.details.clarifying}</p>
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded shadow">
                                <h3 className="font-semibold mb-2">Performance Metrics</h3>
                                <div className="space-y-2">
                                  <p><span className="font-medium">Average Rating:</span> {cycle.details.averageRating.toFixed(1)}/5</p>
                                  <p><span className="font-medium">Completion Rate:</span> {Math.round((cycle.completed / cycle.participants) * 100)}%</p>
                                  <p><span className="font-medium">Approval Rate:</span> {cycle.details.formsSubmitted > 0 ? Math.round((cycle.details.approved / cycle.details.formsSubmitted) * 100) : 0}%</p>
                                  <p><span className="font-medium">Team Members:</span> {cycle.participants}</p>
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded shadow">
                                <h3 className="font-semibold mb-2">Cycle Information</h3>
                                <div className="space-y-2">
                                  <p><span className="font-medium">Manager:</span> {cycle.manager}</p>
                                  <p><span className="font-medium">Due Date:</span> {cycle.dueDate}</p>
                                  <p><span className="font-medium">Departments:</span> {cycle.details.departments.join(', ')}</p>
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
                      No matching review cycles found for your team
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Employee Reviews</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EmployeeReviewList 
                  title="Pending Your Review" 
                  reviews={pendingReviews} 
                  status="pending"
                  onReviewClick={(review: Review) => handleReviewClick(review, false)}
                />
              </div>
              <div>
                <EmployeeReviewList 
                  title="Completed Reviews" 
                  reviews={completedReviews} 
                  status="completed"
                  onReviewClick={(review: Review) => handleReviewClick(review, true)}
                />
              </div>
            </div>
          </div>
        );

      case 'reports':
        return renderReportsContent();

      default: // Dashboard
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Performance Overview</h1>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index: number) => (
                <DashboardCard 
                  key={index} 
                  title={stat.title} 
                  value={stat.value} 
                  icon={stat.icon}
                  trend={stat.trend}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
  <div className="bg-white rounded-lg shadow p-4 w-full h-80">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <FaChartPie className="text-blue-500" /> Review Status
    </h3>
    <div className="w-full" style={{ height: 320 }}>
      <PieChart data={pieChartData} />
    </div>
  </div>
</div>


          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        role="manager"
        activeTab={activeTab === 'reviews' ? 'performance-review' : activeTab === 'reports' ? 'reports' : 'dashboard'}
        onTabChange={(tab) => {
          if (tab === "performance-review") {
            handleTabChange('reviews');
          } else if (tab === "reports") {
            handleTabChange('reports');
          } else {
            handleTabChange('dashboard');
          }
        }}
        onHomeClick={handleHomeClick}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedReview.name}</h2>
                  <p className="text-gray-600">{selectedReview.position}</p>
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
                      className={`py-2 px-4 ${activeReviewTab === 'skills' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('skills')}
                    >
                      <span className="mr-2">📊</span>Skills
                    </button>
                    <button
                      className={`py-2 px-4 ${activeReviewTab === 'overall' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('overall')}
                    >
                      <span className="mr-2">📝</span>Overall
                    </button>
                  </div>

                  {activeReviewTab === 'goals' && (
                    <div className="space-y-6">
                      {selectedReview.goals?.map((goal, index: number) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold mb-2">🎯 {goal.title}</h3>
                          <p className="text-gray-700 mb-2"><strong>Description:</strong> {goal.description}</p>
                          <p className="text-gray-700 mb-2"><strong>Achievement:</strong> {goal.achievement}</p>
                          <div className="mt-3 space-y-2">
                            <p className="text-sm">Self Rating: {renderRatingDisplay(goal.selfRating)}</p>
                            <p className="text-sm">Your Rating: {renderRatingDisplay(goal.managerRating || 0)}</p>
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
                      {selectedReview.projects?.map((project, index: number) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold mb-2">📂 {project.title}</h3>
                          <p className="text-gray-600 mb-2">Role: {project.role}</p>
                          <p className="text-gray-700 mb-2"><strong>Description:</strong> {project.description}</p>
                          <p className="text-gray-700 mb-2"><strong>Impact:</strong> {project.impact}</p>
                          <div className="mt-3 space-y-2">
                            <p className="text-sm">Self Rating: {renderRatingDisplay(project.selfRating)}</p>
                            <p className="text-sm">Your Rating: {renderRatingDisplay(project.managerRating || 0)}</p>
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-sm font-medium text-gray-700">Your Feedback:</p>
                              <p className="text-sm text-gray-600">{project.managerComments}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeReviewTab === 'skills' && (
                    <div className="space-y-6">
                      {selectedReview.skills?.map((skillCategory: SkillCategory, index: number) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold mb-3">📊 {skillCategory.category}</h3>
                          <p className="text-gray-600 mb-3">{skillCategory.description}</p>
                          <div className="space-y-4">
                            {skillCategory.questions.map((question: SkillQuestion, qIndex: number) => (
                              <div key={qIndex} className="bg-gray-50 p-4 rounded">
                                <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Self Rating</p>
                                    {renderRatingDisplay(question.selfRating)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Your Rating</p>
                                    {renderRatingDisplay(question.managerRating || 0)}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-gray-700">Examples:</p>
                                  <p className="text-sm text-gray-600">{question.examples}</p>
                                </div>
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-gray-700">Areas for Improvement:</p>
                                  <p className="text-sm text-gray-600">{question.improvementAreas}</p>
                                </div>
                                <div className="bg-blue-50 p-2 rounded">
                                  <p className="text-xs font-medium text-gray-700">Your Comments:</p>
                                  <p className="text-xs text-gray-600">{question.managerComments}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeReviewTab === 'overall' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold mb-2">📝 Overall Feedback</h3>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Overall Rating</p>
                          {renderRatingDisplay(selectedReview.managerRating || 0)}
                        </div>
                        <p className="text-gray-700">{selectedReview.overallFeedback}</p>
                      </div>
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
                      className={`py-2 px-4 ${activeReviewTab === 'skills' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setActiveReviewTab('skills')}
                    >
                      <span className="mr-2">📊</span>Skills Review
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
                      {selectedReview.goals?.map((goal, index: number) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold mb-3">🎯 {goal.title}</h3>
                          <p className="text-gray-700 mb-3"><strong>Description:</strong> {goal.description}</p>
                          <p className="text-gray-700 mb-3"><strong>Achievement:</strong> {goal.achievement}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm text-gray-500 mb-1">Employee Self Rating</label>
                              {renderRatingDisplay(goal.selfRating)}
                            </div>
                            <div>
                              <label className="block text-sm text-gray-500 mb-1">Your Rating</label>
                              <RatingDropdown
                                value={goal.managerRating || 0}
                                onChange={(value) => handleGoalRatingChange(selectedReview.id, index, value)}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Your Comments</label>
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded"
                              rows={3}
                              placeholder="Provide feedback on this goal"
                              value={goal.managerComments || ''}
                              onChange={(e) => handleGoalCommentsChange(selectedReview.id, index, e.target.value)}
                            ></textarea>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          onClick={() => setActiveReviewTab('projects')}
                        >
                          Next: Projects Review
                        </button>
                      </div>
                    </div>
                  )}

                  {activeReviewTab === 'projects' && (
                    <div className="space-y-6">
                      {selectedReview.projects?.map((project, index: number) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold mb-3">📂 {project.title}</h3>
                          <p className="text-gray-600 mb-2">Role: {project.role}</p>
                          <p className="text-gray-700 mb-3"><strong>Description:</strong> {project.description}</p>
                          <p className="text-gray-700 mb-3"><strong>Impact:</strong> {project.impact}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm text-gray-500 mb-1">Employee Self Rating</label>
                              {renderRatingDisplay(project.selfRating)}
                            </div>
                            <div>
                              <label className="block text-sm text-gray-500 mb-1">Your Rating</label>
                              <RatingDropdown
                                value={project.managerRating || 0}
                                onChange={(value) => handleProjectRatingChange(selectedReview.id, index, value)}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Your Comments</label>
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded"
                              rows={3}
                              placeholder="Provide feedback on this project"
                              value={project.managerComments || ''}
                              onChange={(e) => handleProjectCommentsChange(selectedReview.id, index, e.target.value)}
                            ></textarea>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                          onClick={() => setActiveReviewTab('goals')}
                        >
                          Back to Goals
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          onClick={() => setActiveReviewTab('skills')}
                        >
                          Next: Skills Review
                        </button>
                      </div>
                    </div>
                  )}

                  {activeReviewTab === 'skills' && selectedReview && (
                    <div className="space-y-6">
                      {selectedReview.skills?.map((skillCategory: SkillCategory, categoryIndex: number) => (
                        <div key={categoryIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <h3 className="text-lg font-semibold mb-4">📊 {skillCategory.category}</h3>
                          <p className="text-gray-600 mb-4">{skillCategory.description}</p>
                          <div className="space-y-4">
                            {skillCategory.questions.map((question: SkillQuestion, questionIndex: number) => (
                              <div key={questionIndex} className="bg-gray-50 p-4 rounded">
                                <p className="font-medium text-gray-800 mb-3">{question.question}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm text-gray-500 mb-1">Employee Self Rating</label>
                                    {renderRatingDisplay(question.selfRating)}
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-500 mb-1">Your Rating</label>
                                    <RatingDropdown
                                      value={question.managerRating || 0}
                                      onChange={(value) => handleSkillRatingChange(
                                        selectedReview.id,
                                        categoryIndex,
                                        questionIndex,
                                        value
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm text-gray-500 mb-1">Examples Provided</label>
                                  <p className="text-sm text-gray-700">{question.examples}</p>
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm text-gray-500 mb-1">Your Comments</label>
                                  <textarea 
                                    className="w-full p-2 border border-gray-300 rounded"
                                    rows={3}
                                    placeholder="Provide detailed feedback on this skill"
                                    value={question.managerComments || ''}
                                    onChange={(e) => handleSkillCommentsChange(
                                      selectedReview.id,
                                      categoryIndex,
                                      questionIndex,
                                      e.target.value
                                    )}
                                  ></textarea>
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-500 mb-1">Suggested Improvements</label>
                                  <textarea 
                                    className="w-full p-2 border border-gray-300 rounded"
                                    rows={2}
                                    placeholder="Suggest areas for improvement"
                                    value={question.improvementAreas || ''}
                                    onChange={(e) => handleSkillImprovementChange(
                                      selectedReview.id,
                                      categoryIndex,
                                      questionIndex,
                                      e.target.value
                                    )}
                                  ></textarea>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                          onClick={() => setActiveReviewTab('projects')}
                        >
                          Back to Projects
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          onClick={() => setActiveReviewTab('overall')}
                        >
                          Next: Overall Feedback
                        </button>
                      </div>
                    </div>
                  )}

                  {activeReviewTab === 'overall' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold mb-3">📝 Overall Feedback for {selectedReview.name}</h3>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-500 mb-1">Your Overall Rating</label>
                          <RatingDropdown
                            value={selectedReview.managerRating || 0}
                            onChange={(value) => {
                              const updatedReview = {
                                ...selectedReview,
                                managerRating: value
                              };
                              setSelectedReview(updatedReview);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Your Overall Feedback</label>
                          <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={5}
                            placeholder="Provide overall feedback for this employee's performance"
                            value={overallFeedback}
                            onChange={(e) => setOverallFeedback(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                          onClick={() => setActiveReviewTab('skills')}
                        >
                          Back to Skills
                        </button>
                        <div className="flex gap-4">
                          <button 
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setSelectedReview(null);
                              setIsViewingCompletedReview(false);
                            }}
                          >
                            Cancel
                          </button>
                          <button 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={() => {
                              // Save the review and mark as completed
                              const updatedPending = pendingReviews.filter(r => r.id !== selectedReview.id);
                              const updatedCompleted = [...completedReviews, {
                                ...selectedReview,
                                managerRating: selectedReview.managerRating || calculateOverallRating(selectedReview),
                                overallFeedback
                              }];
                              
                              setPendingReviews(updatedPending);
                              setCompletedReviews(updatedCompleted);
                              setSelectedReview(null);
                              setIsViewingCompletedReview(false);
                            }}
                          >
                            Complete Review
                          </button>
                        </div>
                      </div>
                    </div>
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

function calculateOverallRating(review: Review): number {
  let total = 0;
  let count = 0;

  // Add goals ratings
  if (review.goals) {
    review.goals.forEach(goal => {
      if (goal.managerRating) {
        total += goal.managerRating;
        count++;
      }
    });
  }

  // Add projects ratings
  if (review.projects) {
    review.projects.forEach(project => {
      if (project.managerRating) {
        total += project.managerRating;
        count++;
      }
    });
  }

  // Add skills ratings
  if (review.skills) {
    review.skills.forEach(skill => {
      skill.questions.forEach(question => {
        if (question.managerRating) {
          total += question.managerRating;
          count++;
        }
      });
    });
  }

  return count > 0 ? parseFloat((total / count).toFixed(1)) : 0;
}

export default ManagerDashboard;
