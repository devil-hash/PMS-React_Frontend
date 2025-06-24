import React, { useState } from 'react';

interface Goal {
  id: number;
  description: string;
  rating: number;
}

interface Project {
  id: number;
  name: string;
  role: string;
  rating: number;
}

const EmployeeSelfReview: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [newGoalRating, setNewGoalRating] = useState(3);
  const [newProject, setNewProject] = useState({
    name: '',
    role: '',
    rating: 3
  });

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, {
        id: Date.now(),
        description: newGoal,
        rating: newGoalRating
      }]);
      setNewGoal('');
      setNewGoalRating(3);
    }
  };

  const addProject = () => {
    if (newProject.name.trim() && newProject.role.trim()) {
      setProjects([...projects, {
        id: Date.now(),
        ...newProject
      }]);
      setNewProject({
        name: '',
        role: '',
        rating: 3
      });
    }
  };

  const removeGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const removeProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const submitReview = () => {
    // In a real app, this would submit to your backend
    console.log({ goals, projects });
    alert('Review submitted successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Self Performance Review</h2>
      
      <div className="mb-8">
        <h3 className="font-medium mb-2">Goals Achieved</h3>
        <div className="space-y-4 mb-4">
          {goals.map(goal => (
            <div key={goal.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
              <div>
                <p>{goal.description}</p>
                <p className="text-sm text-gray-600">Rating: {goal.rating}/5</p>
              </div>
              <button 
                onClick={() => removeGoal(goal.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Goal description"
            className="flex-1 p-2 border border-gray-300 rounded"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded"
            value={newGoalRating}
            onChange={(e) => setNewGoalRating(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <button
            onClick={addGoal}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Goal
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-medium mb-2">Projects Involved</h3>
        <div className="space-y-4 mb-4">
          {projects.map(project => (
            <div key={project.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
              <div>
                <p>{project.name}</p>
                <p className="text-sm text-gray-600">Role: {project.role}</p>
                <p className="text-sm text-gray-600">Rating: {project.rating}/5</p>
              </div>
              <button 
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Project name"
            className="p-2 border border-gray-300 rounded"
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Your role"
            className="p-2 border border-gray-300 rounded"
            value={newProject.role}
            onChange={(e) => setNewProject({...newProject, role: e.target.value})}
          />
          <select
            className="p-2 border border-gray-300 rounded"
            value={newProject.rating}
            onChange={(e) => setNewProject({...newProject, rating: parseInt(e.target.value)})}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <button
          onClick={addProject}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>
      
      <button
        onClick={submitReview}
        className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
        disabled={goals.length === 0 && projects.length === 0}
      >
        Submit Review
      </button>
    </div>
  );
};

export default EmployeeSelfReview;