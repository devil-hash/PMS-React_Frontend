// Sidebar.tsx
import React from 'react';
import { 
  FaHome,
  FaFileAlt, 
  FaClipboardCheck, 
  FaChartLine, 
  FaTasks,
  FaUserCog,
  FaUsers,
  FaListAlt,
  FaPenFancy,
  FaStar
} from 'react-icons/fa';
import { HiOutlineTemplate } from 'react-icons/hi';

export type Tab =
  | 'dashboard'
  | 'forms'
  | 'review-cycles'
  | 'reports'
  | 'approvals'
  | 'settings'
  | 'users'
  | 'templates'
  | 'performance-review'
  | 'assessments'
  | 'reviews';

interface SidebarProps {
  onHomeClick?: () => void;
  role?: 'employee' | 'manager' | 'hr' | 'admin';
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onHomeClick, 
  role = 'employee', 
  activeTab,
  onTabChange 
}) => {
  const handleTabClick = (tab: Tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="w-20 bg-white text-gray-600 h-screen p-2 flex flex-col items-center shadow-lg border-r border-gray-100">
      {/* Logo */}
      <div className="mb-8 mt-4 flex flex-col items-center group">
        <div className="w-10 h-10 rounded-lg overflow-hidden mb-1 flex items-center justify-center">
          <img
            src="/images/logo.png"
            alt="Company Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold';
              fallback.textContent = 'S';
              (e.target as HTMLImageElement).parentNode?.appendChild(fallback);
            }}
          />
        </div>
        <span className="text-xs text-center font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
          Synergech
        </span>
      </div>

      {/* Navigation */}
      <ul className="space-y-3 w-full flex flex-col items-center">
        {/* Home */}
        <li
          className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
            activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : ''
          }`}
          onClick={() => {
            if (onHomeClick) onHomeClick();
            handleTabClick('dashboard');
          }}
        >
          <FaHome 
            size={18} 
            className={`group-hover:text-blue-600 ${activeTab === 'dashboard' ? 'text-blue-600' : ''}`} 
          />
          <span className="text-xs mt-1.5 group-hover:text-blue-600">
            Home
          </span>
        </li>

        {/* Admin Tabs */}
        {role === 'admin' && (
          <>
            <SidebarItem icon={<HiOutlineTemplate size={18} />} label="Forms" tab="forms" activeTab={activeTab} onClick={handleTabClick} />
            <SidebarItem icon={<FaClipboardCheck size={16} />} label="Approvals" tab="approvals" activeTab={activeTab} onClick={handleTabClick} />
            <SidebarItem icon={<FaChartLine size={16} />} label="Reports" tab="reports" activeTab={activeTab} onClick={handleTabClick} />
            <SidebarItem icon={<FaListAlt size={16} />} label="Templates" tab="templates" activeTab={activeTab} onClick={handleTabClick} />
          </>
        )}
        
        {/* HR Tabs */}
        {role === 'hr' && (
          <>
            <SidebarItem icon={<HiOutlineTemplate size={18} />} label="Forms" tab="forms" activeTab={activeTab} onClick={handleTabClick} />
            <SidebarItem icon={<FaTasks size={16} />} label="Reviews" tab="review-cycles" activeTab={activeTab} onClick={handleTabClick} />
            <SidebarItem icon={<FaChartLine size={16} />} label="Reports" tab="reports" activeTab={activeTab} onClick={handleTabClick} />
            <SidebarItem icon={<FaListAlt size={16} />} label="Templates" tab="templates" activeTab={activeTab} onClick={handleTabClick} />
          </>
        )}

        {/* Manager Tabs */}
        {role === 'manager' && (
          <>
            <SidebarItem icon={<FaTasks size={16} />} label="Reviews" tab="performance-review" activeTab={activeTab} onClick={handleTabClick} />
            <SidebarItem icon={<FaChartLine size={16} />} label="Reports" tab="reports" activeTab={activeTab} onClick={handleTabClick} />
          </>
        )}

        {/* Employee Tabs */}
        {role === 'employee' && (
          <>
            <SidebarItem icon={<FaPenFancy size={16} />} label="Assessments" tab="assessments" activeTab={activeTab} onClick={handleTabClick} />
            <SidebarItem icon={<FaStar size={16} />} label="Reviews" tab="reviews" activeTab={activeTab} onClick={handleTabClick} />
          </>
        )}
      </ul>
    </div>
  );
};

// Reusable Sidebar Item
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  tab: Tab;
  activeTab?: Tab;
  onClick: (tab: Tab) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, tab, activeTab, onClick }) => (
  <li
    className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
      activeTab === tab ? 'bg-blue-50 text-blue-600' : ''
    }`}
    onClick={() => onClick(tab)}
  >
    <div className={`group-hover:text-blue-600 ${activeTab === tab ? 'text-blue-600' : ''}`}>
      {icon}
    </div>
    <span className="text-xs mt-1.5 group-hover:text-blue-600">
      {label}
    </span>
  </li>
);

export default Sidebar;