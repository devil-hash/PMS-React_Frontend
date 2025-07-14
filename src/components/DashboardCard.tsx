import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, trend = 'neutral', icon }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && (
          <span className="text-2xl">{icon}</span>
        )}
      </div>
      {trend !== 'neutral' && (
        <div className={`mt-2 flex items-center text-sm ${trendColor}`}>
          <span className="mr-1">{trendIcon}</span>
          <span>5% from last month</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;