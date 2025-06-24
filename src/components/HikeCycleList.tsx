import React from 'react';
import { HikeCycle } from '../types/reviewTypes';
import { FaChevronDown, FaChevronUp, FaUsers, FaCheckCircle, FaClock } from 'react-icons/fa';

interface HikeCycleListProps {
  cycles: HikeCycle[];
  expandedCycle?: number | null;
  onManageClick?: (id: number) => void;
  onViewClick?: (id: HikeCycle) => void;
}

const HikeCycleList: React.FC<HikeCycleListProps> = ({ 
  cycles, 
  expandedCycle,
  onManageClick,
  onViewClick
}) => {
  return (
    <div className="space-y-4">
      {cycles.map(cycle => (
        <div key={cycle.id} className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-lg">{cycle.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  cycle.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : cycle.status === 'active'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {cycle.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {cycle.type} • {cycle.period} • Due: {cycle.dueDate}
              </p>
              
              <div className="flex gap-4 mt-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <FaUsers className="mr-1" />
                  <span>{cycle.participants} participants</span>
                </div>
                <div className="flex items-center text-green-600">
                  <FaCheckCircle className="mr-1" />
                  <span>{cycle.completed} completed</span>
                </div>
                <div className="flex items-center text-yellow-600">
                  <FaClock className="mr-1" />
                  <span>{cycle.pending} pending</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {onManageClick && (
                <button 
                  onClick={() => onManageClick(cycle.id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
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
              )}
              {onViewClick && (
                <button 
                  onClick={() => onViewClick(cycle)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Manage Cycle
                </button>
              )}
            </div>
          </div>
          
          {expandedCycle === cycle.id && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${cycle.progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm mt-1 text-gray-600">{cycle.progress}% complete</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Milestones</h4>
                <div className="space-y-3">
                  {cycle.milestones.map(milestone => (
                    <div key={milestone.id} className="flex items-start gap-3">
                      <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in-progress' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">{milestone.title}</h5>
                          <span className="text-xs text-gray-500">Due: {milestone.dueDate}</span>
                        </div>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {onViewClick && (
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => onViewClick(cycle)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Manage Full Cycle
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HikeCycleList;