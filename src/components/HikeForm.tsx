import React, { useState } from 'react';
import { FaUserTie, FaPlus, FaTrash, FaChevronDown } from 'react-icons/fa';

interface ReviewLevel {
  id: number;
  name: string;
  deadline: string;
  managerName: string;
}

interface CustomOption {
  id: number;
  category: string;
  value: string;
  customCategory?: string;
}

interface NewHikeCycleFormProps {
  onCancel: () => void;
  onPublish: (data: {
    cycleName: string;
    cycleDeadline: string;
    reviewLevels: ReviewLevel[];
    customOptions: CustomOption[];
    description: string;
  }) => void;
}

const managerOptions = [
  'John Smith',
  'Sarah Johnson',
  'Michael Brown',
  'Emily Davis',
  'David Wilson'
];

const categoryOptions = [
  'Technical Skills',
  'Communication',
  'Leadership',
  'Productivity',
  'Teamwork',
  'Others'
];

const defaultAssessmentFields = {
  goals: [
    {
      title: 'Goal Achievement',
      description: 'Assess completion of assigned goals',
      rating: 0
    }
  ],
  projects: [
    {
      name: 'Project Contribution',
      description: 'Evaluate contributions to key projects',
      rating: 0
    }
  ],
  skills: [
    {
      category: 'Technical Skills',
      rating: 0
    }
  ]
};

const NewHikeCycleForm: React.FC<NewHikeCycleFormProps> = ({ onCancel, onPublish }) => {
  const [cycleName, setCycleName] = useState('');
  const [cycleDeadline, setCycleDeadline] = useState('');
  const [reviewLevels, setReviewLevels] = useState<ReviewLevel[]>([
    { id: 1, name: 'Level 1', deadline: '', managerName: '' },
    { id: 2, name: 'Level 2', deadline: '', managerName: '' }
  ]);
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [description, setDescription] = useState('');
  const [newLevelName, setNewLevelName] = useState('');
  const [showManagerDropdown, setShowManagerDropdown] = useState<number | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<number | null>(null);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState<number | null>(null);

  const addReviewLevel = () => {
    if (newLevelName.trim()) {
      setReviewLevels([
        ...reviewLevels,
        {
          id: reviewLevels.length + 1,
          name: newLevelName,
          deadline: '',
          managerName: ''
        }
      ]);
      setNewLevelName('');
    }
  };

  const removeReviewLevel = (id: number) => {
    if (reviewLevels.length > 1) {
      setReviewLevels(reviewLevels.filter(level => level.id !== id));
    }
  };

  const addCustomOption = () => {
    setCustomOptions([
      ...customOptions,
      {
        id: customOptions.length + 1,
        category: '',
        value: '',
        customCategory: ''
      }
    ]);
  };

  const removeCustomOption = (id: number) => {
    setCustomOptions(customOptions.filter(option => option.id !== id));
    if (showCustomCategoryInput === id) {
      setShowCustomCategoryInput(null);
    }
  };

  const handleLevelChange = (id: number, field: keyof ReviewLevel, value: string) => {
    setReviewLevels(reviewLevels.map(level => 
      level.id === id ? { ...level, [field]: value } : level
    ));
  };

  const handleOptionChange = (id: number, field: keyof CustomOption, value: string) => {
    setCustomOptions(customOptions.map(option => 
      option.id === id ? { ...option, [field]: value } : option
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate custom categories for empty when shown
    const hasEmptyCustomCategory = customOptions.some(
      option => showCustomCategoryInput === option.id && !option.customCategory?.trim()
    );
    if (hasEmptyCustomCategory) {
      alert('Please enter a name for your custom category');
      return;
    }

    onPublish({
      cycleName,
      cycleDeadline,
      reviewLevels,
      customOptions: customOptions.map(option => ({
        ...option,
        category:
          option.category === 'Others' && option.customCategory
            ? option.customCategory
            : option.category
      })),
      description
    });
  };

  const selectManager = (levelId: number, manager: string) => {
    handleLevelChange(levelId, 'managerName', manager);
    setShowManagerDropdown(null);
  };

  const selectCategory = (optionId: number, category: string) => {
    setCustomOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === optionId
          ? {
              ...option,
              category,
              customCategory: category === 'Others' ? option.customCategory || '' : ''
            }
          : option
      )
    );

    if (category === 'Others') {
      setShowCustomCategoryInput(optionId);
    } else {
      setShowCustomCategoryInput(null);
    }

    setShowCategoryDropdown(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaUserTie className="mr-2" size={20} /> New Performance Review Cycle
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Cycle Name and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Cycle Name*</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={cycleName}
                onChange={(e) => setCycleName(e.target.value)}
                required
                placeholder="e.g., Annual Review 2023"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Cycle Deadline*</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={cycleDeadline}
                onChange={(e) => setCycleDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Default Self-Assessment Preview */}
          <div>
            <h3 className="font-medium mb-4">Default Assessment Fields</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Included by default:</h4>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-600 mb-1">Goals Section</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {defaultAssessmentFields.goals.map((goal, index) => (
                    <li key={`goal-${index}`} className="text-sm text-gray-600">
                      <span className="font-medium">{goal.title}</span> - {goal.description}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-600 mb-1">Projects Section</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {defaultAssessmentFields.projects.map((project, index) => (
                    <li key={`project-${index}`} className="text-sm text-gray-600">
                      <span className="font-medium">{project.name}</span> - {project.description}
                    </li>
                  ))}
                </ul>
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                These standard fields will be automatically included in all employee assessments.
              </p>
            </div>
          </div>

          {/* Review Levels */}
          <div>
            <h3 className="font-medium mb-4">Review Levels</h3>
            <div className="space-y-4">
              {reviewLevels.map(level => (
                <div key={level.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded relative">
                  <button
                    type="button"
                    onClick={() => removeReviewLevel(level.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    disabled={reviewLevels.length <= 1}
                  >
                    <FaTrash size={14} />
                  </button>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Level Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={level.name}
                      onChange={(e) => handleLevelChange(level.id, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Review Deadline</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={level.deadline}
                      onChange={(e) => handleLevelChange(level.id, 'deadline', e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm text-gray-500 mb-1">Manager Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded pr-8"
                        value={level.managerName}
                        onChange={(e) => handleLevelChange(level.id, 'managerName', e.target.value)}
                        onClick={() => setShowManagerDropdown(level.id)}
                        required
                      />
                      <FaChevronDown 
                        className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                        onClick={() => setShowManagerDropdown(level.id)}
                      />
                    </div>
                    {showManagerDropdown === level.id && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                        {managerOptions.map((manager, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectManager(level.id, manager)}
                          >
                            {manager}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder="Enter new level name"
                  value={newLevelName}
                  onChange={(e) => setNewLevelName(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addReviewLevel}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 flex items-center"
                >
                  <FaPlus className="mr-2" size={14} /> Add Level
                </button>
              </div>
            </div>
          </div>
          
          {/* Custom Review Options */}
          <div>
            <h3 className="font-medium mb-4">Custom Review Options</h3>
            {customOptions.length > 0 ? (
              <div className="space-y-4">
                {customOptions.map(option => (
                  <div key={option.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded relative">
                    <button
                      type="button"
                      onClick={() => removeCustomOption(option.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                    <div className="relative">
                      <label className="block text-sm text-gray-500 mb-1">Category</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded pr-8"
                          placeholder="Select category"
                          value={
                            option.category === 'Others'
                              ? option.customCategory || 'Others'
                              : option.category
                          }
                          readOnly
                          onClick={() => {
                            setShowCategoryDropdown(option.id);
                            if (option.category === 'Others') {
                              setShowCustomCategoryInput(option.id);
                            }
                          }}
                        />
                        <FaChevronDown 
                          className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                          onClick={() => setShowCategoryDropdown(option.id)}
                        />
                      </div>
                      {showCategoryDropdown === option.id && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                          {categoryOptions.map((category, index) => (
                            <div
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectCategory(option.id, category)}
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      )}
                      {showCustomCategoryInput === option.id && (
                        <div className="mt-2">
                          <label className="block text-sm text-gray-500 mb-1">Custom Category Name*</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter your custom category"
                            value={option.customCategory || ''}
                            onChange={(e) => handleOptionChange(option.id, 'customCategory', e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Value</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter option value"
                        value={option.value}
                        onChange={(e) => handleOptionChange(option.id, 'value', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">0 Option(s)</p>
            )}
            <button
              type="button"
              onClick={addCustomOption}
              className="mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 flex items-center"
            >
              <FaPlus className="mr-2" size={14} /> Add Option
            </button>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              placeholder="Describe the objectives and expectations for this review cycle..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 flex items-center"
          >
            <FaUserTie className="mr-2" size={16} /> Publish Cycle
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewHikeCycleForm;
