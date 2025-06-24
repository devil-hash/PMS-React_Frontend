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

/* Template Types */
export interface Template {
  id: number;
  name: string;
  type: 'Annual' | 'Quarterly' | 'Mid-term';
  description: string;
  fields: string[];
}

/* Compensation Types */
export interface CompensationReportEntry {
  employeeId: number;
  employeeName: string;
  department: string;
  previousSalary: number;
  hikePercent: number;
  newSalary: number;
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
}

export interface Goal {
  title: string;
  selfRating: number;
  managerRating?: number;
  description: string;
  achievement: string;
  managerComments?: string;
  documents?: ReviewDocument[];
}

export interface Project {
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

export interface SelfAssessment {
  goals: SelfAssessmentGoal[];
  projects: SelfAssessmentProject[];
  submittedDate?: string;
}

/* Milestone & Approval Types */
export interface Milestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  rating?: number;
  feedback?: string;
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

/* Hike Cycle Types */
export interface HikeCycleDetails {
  formsSubmitted: number;
  approved: number;
  clarifying: number;
  pendingApproval: number;
  averageRating: number;
  departments: string[];
}

export interface HikeCycle {
  title:string;
  id: number;
  name: string;
  status: 'pending' | 'active' | 'completed';
  type: string;
  period: string;
  dueDate: string;
  participants: number;
  completed: number;
  pending: number;
  progress: number;
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

