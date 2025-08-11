// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MicrosoftLoginButton from './components/MicrosoftLoginButton';
import AdminDashboard from './pages/Admin/ADashboard';
import ManagerDashboard from './pages/Manager/MDashboard';
import EmployeeDashboard from './pages/Employee/EDashboard';
import HRDashboard from './pages/HR/HDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center h-screen">
              <MicrosoftLoginButton />
            </div>
          } />
          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="/manager" element={<ManagerDashboard />} />
          </Route>
          
       <Route element={
  <ProtectedRoute
    allowedDepartments={['human resource']}
    excludeRoles={['admin']}
  />
}>
  <Route path="/hr" element={<HRDashboard />} />
</Route>

          
          <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;