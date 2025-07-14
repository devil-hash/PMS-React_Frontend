// pages/Admin/ReviewCycles.tsx
import React, { useState } from 'react';
import HikeCycleList from '../components/HikeCycleList';
import { HikeCycle } from '../types/reviewTypes';

const ReviewCycles: React.FC = () => {
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);

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
    milestones: [
      {
        id: 1,
        title: "Self Evaluation",
        description: "Employees complete self-assessment",
        dueDate: "2024-02-15",
        status: "completed"
      },
      {
        id: 2,
        title: "Manager Review",
        description: "Managers complete evaluations",
        dueDate: "2024-03-15",
        status: "in-progress"
      }
    ],
    details: {
      formsSubmitted: 38,
      approved: 12,
      clarifying: 5,
      pendingApproval: 21,
      averageRating: 3.8,
      averageHike: "8.5%",
      hikeRange: "5% - 12%",
      highestHike: "12%",
      lowestHike: "5%",
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
    milestones: [
      {
        id: 1,
        title: "Goal Setting",
        description: "Set objectives for next quarter",
        dueDate: "2024-07-15",
        status: "completed"
      },
      {
        id: 2,
        title: "Performance Review",
        description: "Complete performance evaluations",
        dueDate: "2024-08-30",
        status: "completed"
      }
    ],
    details: {
      formsSubmitted: 45,
      approved: 42,
      clarifying: 3,
      pendingApproval: 0,
      averageRating: 4.1,
      averageHike: "9.2%",
      hikeRange: "6% - 15%",
      highestHike: "15%",
      lowestHike: "6%",
      departments: ['All Departments']
    }
  }
];

  const toggleExpand = (id: number) => {
    setExpandedCycle(expandedCycle === id ? null : id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Performance Review Cycles</h1>
      <HikeCycleList 
        cycles={hikeCycles}
        expandedCycle={expandedCycle}
        onManageClick={toggleExpand}
      />
    </div>
  );
};

export default ReviewCycles;