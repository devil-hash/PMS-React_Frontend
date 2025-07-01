// pages/Admin/AdminForm.tsx
import React from 'react';
import NewHikeCycleForm from '../components/HikeForm';
import { useNavigate } from 'react-router-dom';

const AdminForm: React.FC = () => {
  const navigate = useNavigate();

  const handlePublish = (data: any) => {
    console.log('Published Hike Cycle:', data);
    navigate('/admin/review-cycles');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Create New Hike Cycle</h1>
      <div className="bg-white p-6 rounded shadow">
        <NewHikeCycleForm 
          onCancel={() => navigate('/admin')}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
};

export default AdminForm;