import React, { useState } from 'react';
import { FaUserTie, FaPlus, FaTrash, FaChevronDown } from 'react-icons/fa';

interface ReviewLevel {
  id: number;
  name: string;
  deadline: string;
  managerName: string;
}

interface AssessmentCategory {
  id: number;
  name: string;
  questions: AssessmentQuestion[];
}

interface AssessmentQuestion {
  id: number;
  question: string;
}

interface NewHikeCycleFormProps {
  onCancel: () => void;
  onPublish: (data: {
    cycleName: string;
    cycleDeadline: string;
    reviewLevels: ReviewLevel[];
    assessmentCategories: AssessmentCategory[];
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
  const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
  const [description, setDescription] = useState('');
  const [newLevelName, setNewLevelName] = useState('');
  const [showManagerDropdown, setShowManagerDropdown] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);

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

  const addAssessmentCategory = () => {
    if (newCategoryName.trim()) {
      setAssessmentCategories([
        ...assessmentCategories,
        {
          id: assessmentCategories.length + 1,
          name: newCategoryName,
          questions: [{ id: 1, question: '' }]
        }
      ]);
      setNewCategoryName('');
      setShowCustomCategoryInput(false);
    }
  };

  const removeAssessmentCategory = (id: number) => {
    setAssessmentCategories(assessmentCategories.filter(category => category.id !== id));
  };

  const addQuestionToCategory = (categoryId: number) => {
    setAssessmentCategories(assessmentCategories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          questions: [
            ...category.questions,
            { id: category.questions.length + 1, question: '' }
          ]
        };
      }
      return category;
    }));
  };

  const removeQuestionFromCategory = (categoryId: number, questionId: number) => {
    setAssessmentCategories(assessmentCategories.map(category => {
      if (category.id === categoryId) {
        const filteredQuestions = category.questions.filter(question => question.id !== questionId);
        return {
          ...category,
          questions: filteredQuestions
        };
      }
      return category;
    }));
  };

  const handleLevelChange = (id: number, field: keyof ReviewLevel, value: string) => {
    setReviewLevels(reviewLevels.map(level => 
      level.id === id ? { ...level, [field]: value } : level
    ));
  };

  const handleQuestionChange = (categoryId: number, questionId: number, value: string) => {
    setAssessmentCategories(assessmentCategories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          questions: category.questions.map(question => 
            question.id === questionId ? { ...question, question: value } : question
          )
        };
      }
      return category;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate assessment questions
    const hasEmptyQuestion = assessmentCategories.some(
      category => category.questions.some(question => !question.question.trim())
    );
    if (hasEmptyQuestion) {
      alert('Please enter all assessment questions');
      return;
    }

    // Validate category names
    const hasEmptyCategoryName = assessmentCategories.some(
      category => !category.name.trim()
    );
    if (hasEmptyCategoryName) {
      alert('Please enter all category names');
      return;
    }

    onPublish({
      cycleName,
      cycleDeadline,
      reviewLevels,
      assessmentCategories,
      description
    });
  };

  const selectManager = (levelId: number, manager: string) => {
    handleLevelChange(levelId, 'managerName', manager);
    setShowManagerDropdown(null);
  };

  const handleCategorySelect = (category: string) => {
    if (category === 'Others') {
      setNewCategoryName('');
      setShowCustomCategoryInput(true);
    } else {
      setNewCategoryName(category);
      setShowCustomCategoryInput(false);
    }
    setShowCategoryDropdown(false);
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
          
          {/* Assessment Questions Section */}
          <div>
            <h3 className="font-medium mb-4">Employee Assessment Questions</h3>
            
            {/* Add New Category Section */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Add New Category</h4>
              <div className="flex items-start space-x-4">
                <div className="flex-1 relative">
                  <label className="block text-sm text-gray-500 mb-1">Category Name*</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded pr-8"
                      placeholder="Select or enter category"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onFocus={() => setShowCategoryDropdown(true)}
                    />
                    <FaChevronDown 
                      className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    />
                  </div>
                  {showCategoryDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                      {categoryOptions.map((category, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  )}
                  {showCustomCategoryInput && (
                    <div className="mt-2">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter custom category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={addAssessmentCategory}
                className="mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 flex items-center"
                disabled={!newCategoryName.trim()}
              >
                <FaPlus className="mr-2" size={14} /> Add Category
              </button>
            </div>
            
            {/* Existing Categories */}
            {assessmentCategories.length > 0 ? (
              <div className="space-y-6">
                {assessmentCategories.map(category => (
                  <div key={category.id} className="border border-gray-200 rounded p-4 relative">
                    <button
                      type="button"
                      onClick={() => removeAssessmentCategory(category.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                    
                    <div className="mb-4">
                      <label className="block text-sm text-gray-500 mb-1">Category Name*</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={category.name}
                        onChange={(e) => {
                          setAssessmentCategories(assessmentCategories.map(c => 
                            c.id === category.id ? { ...c, name: e.target.value } : c
                          ));
                        }}
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {category.questions.map(question => (
                        <div key={question.id} className="flex items-start space-x-2">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-500 mb-1">Question*</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded"
                              placeholder="Enter the assessment question"
                              value={question.question}
                              onChange={(e) => handleQuestionChange(category.id, question.id, e.target.value)}
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestionFromCategory(category.id, question.id)}
                            className="mt-6 text-red-500 hover:text-red-700"
                            disabled={category.questions.length <= 1}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => addQuestionToCategory(category.id)}
                      className="mt-3 bg-gray-100 text-gray-800 py-1 px-3 rounded hover:bg-gray-200 flex items-center text-sm"
                    >
                      <FaPlus className="mr-1" size={12} /> Add Question
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No categories added yet</p>
            )}
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