import React from 'react';
import { FaHome, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onHomeClick?: () => void;
  role?: 'employee' | 'manager' | 'hr';
  activeTab?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onHomeClick, role = 'employee', activeTab }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      navigate(`/${role}`);
    }
  };

  return (
    <div className="w-20 bg-white text-primary h-screen p-2 flex flex-col items-center shadow">
      {/* Company Logo */}
      <div className="mb-8 mt-4 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mb-1 border border-gray-200">
          <img
            src="/images/logo.png"
            alt="Company Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold';
              fallback.textContent = 'S';
              (e.target as HTMLImageElement).parentNode?.appendChild(fallback);
            }}
          />
        </div>
        <span className="text-xs text-center"><b>Synergech</b></span>
      </div>

      {/* Navigation Items */}
      <ul className="space-y-6 w-full">
        <li
          className={`flex flex-col items-center p-2 rounded hover:bg-gray-200 cursor-pointer transition ${
            activeTab === 'home' || activeTab === 'dashboard' ? 'bg-gray-100' : ''
          }`}
          onClick={handleHomeClick}
        >
          <FaHome size={20} />
          <span className="text-xs mt-1">Home</span>
        </li>
        
        {/* Show Hike Cycle only for HR */}
        {role === 'hr' && (
          <li
            className={`flex flex-col items-center p-2 rounded hover:bg-gray-200 cursor-pointer transition ${
              activeTab === 'hike-cycle' ? 'bg-gray-100' : ''
            }`}
            onClick={() => navigate('/hr/hike-cycle')}
          >
            <FaCheckCircle size={20} />
            <span className="text-xs mt-1">Hike Cycle</span>
          </li>
        )}
        
        {/* Show Reports only for HR */}
        {role === 'hr' && (
          <li
            className={`flex flex-col items-center p-2 rounded hover:bg-gray-200 cursor-pointer transition ${
              activeTab === 'reports' ? 'bg-gray-100' : ''
            }`}
            onClick={() => navigate('/hr/reports')}
          >
            <FaChartLine size={20} />
            <span className="text-xs mt-1">Reports</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;