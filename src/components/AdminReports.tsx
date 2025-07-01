import React, { useState } from 'react';
import { HikeCycle } from '../types/reviewTypes';
import { CSVLink } from 'react-csv';
import { FaFileCsv, FaFilter, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

const AdminReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  // Filter cycles based on search and status
  const filteredCycles = hikeCycles.filter(cycle => {
    const matchesSearch = cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cycle.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cycle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Prepare CSV data
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
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Performance Review Reports</h1>
        
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
                        {cycle.details?.averageRating || '-'}
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
                                <p><span className="font-medium">Forms Submitted:</span> {cycle.details?.formsSubmitted}</p>
                                <p><span className="font-medium">Approved:</span> {cycle.details?.approved}</p>
                                <p><span className="font-medium">Pending Approval:</span> {cycle.details?.pendingApproval}</p>
                                <p><span className="font-medium">Needs Clarification:</span> {cycle.details?.clarifying}</p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                              <h3 className="font-semibold mb-2">Performance Metrics</h3>
                              <div className="space-y-2">
                                <p><span className="font-medium">Average Rating:</span> {cycle.details?.averageRating}/5</p>
                                <p><span className="font-medium">Participants:</span> {cycle.participants}</p>
                                <p><span className="font-medium">Completed:</span> {cycle.completed}</p>
                                <p><span className="font-medium">Pending:</span> {cycle.pending}</p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                              <h3 className="font-semibold mb-2">Cycle Information</h3>
                              <div className="space-y-2">
                                <p><span className="font-medium">Manager:</span> {cycle.manager}</p>
                                <p><span className="font-medium">Due Date:</span> {cycle.dueDate}</p>
                                <p><span className="font-medium">Departments:</span> {cycle.details?.departments.join(', ')}</p>
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
};

export default AdminReports;