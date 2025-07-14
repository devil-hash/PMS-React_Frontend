// reviewTypes.ts

/* Document Types */
export interface ReviewDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}
// types/reviewTypes.ts
export interface RatingDropdownProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  isRequired?: boolean;
}
/* Template Types */
export interface Template {
  id: number;
  name: string;
  type: 'Annual' | 'Quarterly' | 'Mid-term';
  description: string;
  fields: string[];
}

export interface SkillQuestion {
  id: number;
  question: string;
  selfRating: number;
  managerRating: number;
  managerComments: string;
  examples?: string[];
  improvementAreas?: string[];
}

export interface SkillCategory {
  category: string;
  description?: string;
  questions: SkillQuestion[];
}

/* Review Core Types */
export interface Review {
  id: number;
  name: string;
  position: string;
  selfRating: number;
  deadline: string;
  managerRating?: number;
  goals?: Goal[];
  projects?: Project[];
  documents?: ReviewDocument[];
  feedback?: string;
  completedDate?: string;
  overallFeedback?: string;
  skills?: SkillCategory[];
}
export interface HikeRecommendation {
  percentage: string;
  justification: string;
  status: 'pending' | 'approved' | 'clarifying';
}
export interface ManagerReviewSkill {
  name: string;
  rating: number;
  feedback: string;
}
// reviewTypes.ts
export interface ManagerReview {
  id: number;
  cycleId: number;
  cycleName: string;
  manager: string;
  date: string;
  overallRating: number;
  feedback: string;
  goals: {
    title: string;
    rating: number;
    feedback: string;
  }[];
  projects: {
    name: string;
    rating: number;
    feedback: string;
  }[];
  skills?: ManagerReviewSkill[]; // Make it optional if not all reviews have it
  strengths: string[];
  areasForImprovement: string[];
  hikeRecommendation: {
    percentage: string;
    justification: string;
    status: 'approved' | 'pending' | 'clarifying';
  };
}
export interface SelfAssessmentSkill {
  name: string;
  level: string;
  improvement: string;
}

export interface SelfAssessment {
  goals: {
    title: string;
    description: string;
    achievement: string;
    rating: number;
    manager: string;
    documents: any[];
  }[];
  projects: {
    name: string;
    description: string;
    impact: string;
    role: string;
    rating: number;
    manager: string;
    documents: any[];
  }[];
  skills: SelfAssessmentSkill[];
  submittedDate ?: string;
  status?: 'pending' | 'approved' | 'clarifying';
  clarificationNotes?: string;
  hikeDetails?: HikeDetails;
}
export interface HikeDetails {
  percentage: string;
  effectiveDate: string;
  newSalary: string;
  managerApproval: string;
  hrApproval: string;
}
export interface Goal {
  id:number
  title: string;
  selfRating: number;
  managerRating?: number;
  description: string;
  achievement: string;
  managerComments?: string;
  documents?: ReviewDocument[];
}

export interface Project {
  id:number,
  title: string;
  role: string;
  selfRating: number;
  managerRating?: number;
  description: string;
  impact: string;
  managerComments?: string;
  documents?: ReviewDocument[];
}

/* Self Assessment Types */
export interface SelfAssessmentGoal {
  title: string;
  description: string;
  achievement: string;
  rating: number;
  manager: string;
  documents: File[];
}

export interface SelfAssessmentProject {
  name: string;
  description: string;
  impact: string;
  role: string;
  rating: number;
  manager: string;
  documents: File[];
}

export interface SelfAssessmentSkill {
  category: string;
  description: string;
  examples: string[];
  rating: number;
  manager: string;
  documents: File[];
   yearsOfExperience?: number;
   lastUsed?: string;
  questionAnswers: {
    question: string;
    answer: string;
  }[];
}

/* Milestone & Approval Types */
export interface Milestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  rating?: number;
}

// types/reviewTypes.ts
export type Approval = {
  id: number;
  employeeName: string;
  position: string;
  currentSalary: number;
  reviewType: string;
  submittedDate: string;
  manager: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs-clarification';
  rating: number;
  hikePercentage?: number;
  feedback?: string;
  goals: {
    title: string;
    rating: number;
    comments: string;
  }[];
  projects: {
    title: string;
    rating: number;
    comments: string;
  }[];
};
export interface FormApproval {
  id: number;
  title: string;
  type: string;
  description: string;
  createdBy: string;
  createdDate: string;
  status: 'pending' | 'approved' | 'rejected';
  formData: any;
  comments?: string;
}
/* Hike Cycle Types */
export interface HikeCycleDetails {
  formsSubmitted: number;
  approved: number;
  clarifying: number;
  pendingApproval: number;
  averageRating: number;
  averageHike?: string;
  hikeRange?: string;
  highestHike?: string;
  lowestHike?: string;
  departments: string[];
}

export interface HikeCycle {
  title: string;
  id: number;
  name: string;
  status: 'pending' | 'active' | 'completed';
  type: string;
  period: string;
  dueDate: string;
  participants: number;
  completed: number;
  pending: number;
  manager?: string;
  details?: HikeCycleDetails;
  selfAssessment?: SelfAssessment;
  milestones: Milestone[];
}

export interface EmployeeHikeCycle extends HikeCycle {
  milestones: Milestone[];
  isSubmitted: boolean;
}

/* Dashboard & UI Types */
export interface PieChartData {
  name: string;
  value: number;
}

export interface ReviewStatusItem {
  stage: string;
  status: 'pending' | 'completed' | 'in-progress';
  date: string;
  note: string;
}

export interface GoalItem {
  title: string;
  status: string;
  rating?: string;
  details: string;
}

export interface ExpectationItem {
  title: string;
  status: string;
  details: string;
}

export interface FeedbackItem {
  from: string;
  content: string;
  date: string;
}
// Example definition — adjust as per your actual structure
export interface ReviewLevel {
  levelName: string;
  approverRole: string;
}

export interface AssessmentCategory {
  name: string;
  questions: string[];
}

export interface DashboardStat {
  title: string;
  value: number | string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  className?: string;
}
export type DashboardTab = 'cycles' | 'approvals' | 'reports' | 'hike-cycle';
export type SidebarTab = DashboardTab;

/* Alias Types */
export type ReviewCycle = HikeCycle;

export type HikeFormFieldType = 'text' | 'number' | 'select' | 'textarea' | 'rating'|'Date'|'file';

export interface HikeFormField {
  id: string;
  label: string;
  type: HikeFormFieldType;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface ApprovalLevel {
  level: number;
  title: string;
  approvers: string[];
  isFinalApproval: boolean;
}

export interface HikeForm {
  id: string;
  title: string;
  description: string;
  fields: HikeFormField[];
  approvalLevels: ApprovalLevel[];
  status: FormStatus;
  createdAt: string;
  updatedAt: string;
}
export type FormStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-clarification' | 'clarification_requested';