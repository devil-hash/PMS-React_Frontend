import React from 'react';

const TeamPerformanceChart: React.FC = () => {
  const performanceData = [
    { name: 'John Doe', selfRating: 4, managerRating: 4.5 },
    { name: 'Jane Smith', selfRating: 3, managerRating: 3.5 },
    { name: 'Mike Johnson', selfRating: 5, managerRating: 4.8 },
    { name: 'Sarah Williams', selfRating: 4, managerRating: 4.5 },
    { name: 'David Brown', selfRating: 3, managerRating: 3.5 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="h-64">
        <div className="flex items-end h-48 space-x-2">
          {performanceData.map((employee, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex items-end w-full justify-center space-x-1">
                <div 
                  className="w-3 bg-blue-400 rounded-t"
                  style={{ height: `${employee.selfRating * 15}px` }}
                  title={`Self: ${employee.selfRating}`}
                ></div>
                <div 
                  className="w-3 bg-green-500 rounded-t"
                  style={{ height: `${employee.managerRating * 15}px` }}
                  title={`Manager: ${employee.managerRating}`}
                ></div>
              </div>
              <span className="text-xs mt-2 text-center truncate w-full" title={employee.name}>
                {employee.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 mr-1"></div>
            <span className="text-xs">Self</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 mr-1"></div>
            <span className="text-xs">Manager</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformanceChart;