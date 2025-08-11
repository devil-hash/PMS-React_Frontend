import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://localhost:7000/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: username, password })
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

     const data = await response.json();
const { role, department } = data;

// ✅ Save full user data
localStorage.setItem("loggedInUser", JSON.stringify(data));

let normalizedRole = '';
if (role.toLowerCase().includes('admin')) {
  normalizedRole = 'admin';
} else if (role.toLowerCase().includes('manager')) {
  normalizedRole = 'manager';
} else if (role.toLowerCase().includes('hr')) {
  normalizedRole = 'hr';
} else {
  normalizedRole = 'employee';
}

localStorage.setItem('userRole', normalizedRole);
localStorage.setItem('userDepartment', department.toLowerCase());

      // Redirect based on normalized role and department
      if (normalizedRole === 'admin') {
        navigate('/admin');
      } else if (department.toLowerCase() === 'human resource') {
        navigate('/hr');
      } else if (normalizedRole === 'manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }

    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
