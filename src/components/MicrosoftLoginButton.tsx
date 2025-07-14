// src/components/MicrosoftLoginButton.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';

const MicrosoftLoginButton: React.FC = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  if (showLoginForm) {
    return <LoginForm />;
  }

  return (
    <div className="text-center">
      <button
        onClick={() => setShowLoginForm(true)}
        className="flex items-center justify-center gap-2 bg-white text-gray-800 py-2 px-4 rounded hover:bg-gray-100 border border-gray-300 mx-auto"
      >
        <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 10.5H1V1H10.5V10.5Z" fill="#F25022"/>
          <path d="M20 10.5H10.5V1H20V10.5Z" fill="#7FBA00"/>
          <path d="M10.5 20H1V10.5H10.5V20Z" fill="#00A4EF"/>
          <path d="M20 20H10.5V10.5H20V20Z" fill="#FFB900"/>
        </svg>
        Sign in with Microsoft
      </button>
    </div>
  );
};

export default MicrosoftLoginButton;