import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import HikeCycleList from '../../components/HikeCycleList';
import NewHikeCycleForm from '../../components/HikeForm';
import DashboardCard from '../../components/DashboardCard';
import PieChart from '../../components/PieChart';
import { HikeCycle, DashboardStat } from '../../types/reviewTypes';

const AdminDashboard: React.FC = () => {
  const [showNewHikeForm, setShowNewHikeForm] = useState(false);
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [selectedCycleId, setSelectedCycleId] = useState<number>(1);
  const navigate = useNavigate();

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
    progress: 27,
    manager: "Mr. Murugan",
    milestones: [], // Added empty array
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
    title: "Quaterly Review 2025",
    id: 2,
    name: "Mid-term Review 2024",
    status: "completed",
    type: "Mid-term",
    period: "2024-07-01 to 2024-09-30",
    dueDate: "2024-09-30",
    participants: 45,
    completed: 45,
    pending: 0,
    progress: 100,
    manager: "Mr. Murugan",
    milestones: [], // Added empty array
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
        hikeCycles.reduce((sum, cycle) => sum + cycle.progress, 0) /
        hikeCycles.length
      )}%`,
      icon: '✅',
      trend: 'up'
    }
  ];

  const selectedPieData = selectedCycle?.details ? [
    { name: 'Approved', value: selectedCycle.details.approved },
    { name: 'Clarifying', value: selectedCycle.details.clarifying }, // Changed from rejected
    { name: 'Pending', value: selectedCycle.details.pendingApproval }
  ] : [];

  const handlePublish = (data: {
    reviewLevels: any[];
    customOptions: any[];
    description: string;
  }) => {
    console.log('Published Hike Cycle:', data);
    setShowNewHikeForm(false);
    navigate('/admin');
  };

  const handleHomeClick = () => {
    setShowNewHikeForm(false);
    setExpandedCycle(null);
    navigate('/admin', { replace: true });
  };

  const toggleExpand = (id: number) => {
    setExpandedCycle(expandedCycle === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onHomeClick={handleHomeClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {!showNewHikeForm ? (
            <>
              <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {summaryStats.map((stat, index) => (
                  <DashboardCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                  />
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

              <div className="mb-8 bg-white rounded-lg shadow p-6" style={{ height: 400 }}>
                <PieChart
                  data={selectedPieData}
                  title={`${selectedCycle?.name} - Status Distribution`}
                />
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Performance Review Cycles</h2>
                <button
                  onClick={() => setShowNewHikeForm(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <span>+</span> New Hike Cycle
                </button>
              </div>

              <HikeCycleList
                cycles={hikeCycles}
                expandedCycle={expandedCycle}
                onManageClick={toggleExpand}
              />

              {expandedCycle !== null && (() => {
                const cycle = hikeCycles.find(c => c.id === expandedCycle);
                if (!cycle || !cycle.details) return null;

                return (
                  <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">
                        {cycle.name} - Detailed View
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cycle.status)}`}>
                        {cycle.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <DashboardCard
                        title="Forms Submitted"
                        value={cycle.details.formsSubmitted}
                        icon="📝"
                      />
                      <DashboardCard
                        title="Approved"
                        value={cycle.details.approved}
                        icon="👍"
                        className="bg-green-50 border-l-4 border-green-500"
                      />
                      <DashboardCard
                        title="Clarifying"
                        value={cycle.details.clarifying}
                        icon="❓"
                        className="bg-purple-50 border-l-4 border-purple-500"
                      />
                      <DashboardCard
                        title="Pending Approval"
                        value={cycle.details.pendingApproval}
                        icon="⏳"
                        className="bg-yellow-50 border-l-4 border-yellow-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Departments Involved</h4>
                        <div className="flex flex-wrap gap-2">
                          {cycle.details.departments.map((dept, i) => (
                            <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Performance Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Average Rating:</span>
                            <span className="font-medium">{cycle.details.averageRating}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Completion Rate:</span>
                            <span className="font-medium">{cycle.progress}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Due Date:</span>
                            <span className="font-medium">{cycle.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <NewHikeCycleForm
              onCancel={() => {
                setShowNewHikeForm(false);
                navigate('/admin');
              }}
              onPublish={handlePublish}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;