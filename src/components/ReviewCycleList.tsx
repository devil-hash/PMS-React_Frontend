import React from 'react';
import { HikeCycle } from '../types/reviewTypes';

interface ReviewCycleListProps {
  cycles: HikeCycle[];
}

const ReviewCycleList: React.FC<ReviewCycleListProps> = ({ cycles }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {cycles.length === 0 ? (
        <p className="text-gray-500">No review cycles found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cycles.map((cycle) => (
                <tr key={cycle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cycle.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(cycle.status)}`}>
                      {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {cycle.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {cycle.participants}
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewCycleList;