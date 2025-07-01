// components/Sidebar.tsx
import React from 'react';
import { 
  FaHome,
  FaFileAlt, 
  FaClipboardCheck, 
  FaChartLine, 
  FaTasks,
  FaUserCog,
  FaUsers,
  FaListAlt
} from 'react-icons/fa';
import { HiOutlineTemplate } from 'react-icons/hi';

interface SidebarProps {
  onHomeClick?: () => void;
  role?: 'employee' | 'manager' | 'hr' | 'admin';
  activeTab?: "dashboard" | "forms" | "review-cycles" | "reports" | "approvals" | "settings" | "users" | "templates";
  onTabChange?: (tab: "dashboard" | "forms" | "review-cycles" | "reports" | "approvals" | "settings" | "users" | "templates") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onHomeClick, 
  role = 'employee', 
  activeTab,
  onTabChange 
}) => {
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab as any);
    }
  };

  return (
    <div className="w-20 bg-white text-gray-600 h-screen p-2 flex flex-col items-center shadow-lg border-r border-gray-100">
      {/* Company Logo */}
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

      {/* Navigation Items */}
      <ul className="space-y-3 w-full flex flex-col items-center">
        {/* Home - Common for all roles */}
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
        
        {/* Admin Specific Tabs */}
        {role === 'admin' && (
          <>
            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'forms' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('forms')}
            >
              <HiOutlineTemplate 
                size={18} 
                className={`group-hover:text-blue-600 ${activeTab === 'forms' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Forms
              </span>
            </li>
            
            
            
            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'review-cycles' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('review-cycles')}
            >
              <FaTasks 
                size={16} 
                className={`group-hover:text-blue-600 ${activeTab === 'review-cycles' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Reviews
              </span>
            </li>

            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'approvals' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('approvals')}
            >
              <FaClipboardCheck 
                size={16} 
                className={`group-hover:text-blue-600 ${activeTab === 'approvals' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Approvals
              </span>
            </li>
            
            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('reports')}
            >
              <FaChartLine 
                size={16} 
                className={`group-hover:text-blue-600 ${activeTab === 'reports' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Reports
              </span>
            </li>
            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'templates' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('templates')}
            >
              <FaListAlt 
                size={16} 
                className={`group-hover:text-blue-600 ${activeTab === 'templates' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Templates
              </span>
            </li>
          </>
        )}

        {/* HR Specific Tabs */}
        {role === 'hr' && (
          <>
            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'forms' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('forms')}
            >
              <HiOutlineTemplate 
                size={18} 
                className={`group-hover:text-blue-600 ${activeTab === 'forms' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Forms
              </span>
            </li>
            
            
            
            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'review-cycles' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('review-cycles')}
            >
              <FaTasks 
                size={16} 
                className={`group-hover:text-blue-600 ${activeTab === 'review-cycles' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Reviews
              </span>
            </li>
            
            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('reports')}
            >
              <FaChartLine 
                size={16} 
                className={`group-hover:text-blue-600 ${activeTab === 'reports' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Reports
              </span>
            </li>
            <li
              className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 w-full group ${
                activeTab === 'templates' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => handleTabClick('templates')}
            >
              <FaListAlt 
                size={16} 
                className={`group-hover:text-blue-600 ${activeTab === 'templates' ? 'text-blue-600' : ''}`} 
              />
              <span className="text-xs mt-1.5 group-hover:text-blue-600">
                Templates
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;