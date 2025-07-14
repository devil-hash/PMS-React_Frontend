import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any user session data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Redirect to Microsoft sign-in page (assuming it's your login route)
    navigate('/'); // Or the specific route where your MicrosoftLoginButton is rendered
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>
      <div className="relative">
        <div 
          className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        >
          <span className="text-sm text-gray-600">U</span>
        </div>
        
        {showProfileDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <div 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              Profile
            </div>
            <div 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;