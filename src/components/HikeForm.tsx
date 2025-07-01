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
    cycleType: string;
    cycleDeadline: string;
    reviewPeriod: {
      startDate: string;
      endDate: string;
    };
    reviewLevels: ReviewLevel[];
    assessmentCategories: AssessmentCategory[];
    description: string;
    departments: string[];
    roles: string[];
    employees: string[];
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

const cycleTypeOptions = [
  'Annually',
  'Quarterly',
  'Mid-term',
  'Others'
];

const departmentOptions = [
  'Engineering',
  'Product',
  'Design',
  'QA',
  'HR',
  'Sales',
  'Marketing'
];

const roleOptions = [
  'Software Engineer',
  'Product Manager',
  'UX Designer',
  'QA Engineer',
  'DevOps Engineer',
  'HR Specialist',
  'Sales Executive',
  'Marketing Manager'
];

const employeeOptions = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Brown',
  'Dana White',
  'Eve Black',
  'Frank Green'
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
  const [cycleType, setCycleType] = useState('');
  const [customCycleType, setCustomCycleType] = useState('');
  const [cycleDeadline, setCycleDeadline] = useState('');
  const [reviewPeriod, setReviewPeriod] = useState({
    startDate: '',
    endDate: ''
  });
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
  const [showCycleTypeDropdown, setShowCycleTypeDropdown] = useState(false);
  const [selectionType, setSelectionType] = useState<'Department' | 'Role' | 'Employee' | ''>('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showSubDropdown, setShowSubDropdown] = useState(false);

  const addSelection = (item: string) => {
    if (selectionType === 'Department') {
      if (!selectedDepartments.includes(item)) {
        setSelectedDepartments([...selectedDepartments, item]);
      }
    } else if (selectionType === 'Role') {
      if (!selectedRoles.includes(item)) {
        setSelectedRoles([...selectedRoles, item]);
      }
    } else if (selectionType === 'Employee') {
      if (!selectedEmployees.includes(item)) {
        setSelectedEmployees([...selectedEmployees, item]);
      }
    }
  };

  const removeSelection = (type: 'Department' | 'Role' | 'Employee', item: string) => {
    if (type === 'Department') {
      setSelectedDepartments(selectedDepartments.filter(d => d !== item));
    } else if (type === 'Role') {
      setSelectedRoles(selectedRoles.filter(r => r !== item));
    } else if (type === 'Employee') {
      setSelectedEmployees(selectedEmployees.filter(e => e !== item));
    }
  };

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

  const handleCycleTypeSelect = (type: string) => {
    if (type === 'Others') {
      setCycleType('Others');
      setCustomCycleType('');
    } else {
      setCycleType(type);
      setCustomCycleType('');
    }
    setShowCycleTypeDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cycleType) {
      alert('Please select a review cycle type');
      return;
    }

    if (cycleType === 'Others' && !customCycleType.trim()) {
      alert('Please enter a custom cycle type');
      return;
    }

    if (!reviewPeriod.startDate || !reviewPeriod.endDate) {
      alert('Please select review period dates');
      return;
    }

    if (selectedDepartments.length === 0 &&
      selectedRoles.length === 0 &&
      selectedEmployees.length === 0
    ) {
      alert('Please select at least one department, role, or employee');
      return;
    }

    const hasEmptyQuestion = assessmentCategories.some(
      category => category.questions.some(question => !question.question.trim())
    );
    if (hasEmptyQuestion) {
      alert('Please enter all assessment questions');
      return;
    }

    const hasEmptyCategoryName = assessmentCategories.some(
      category => !category.name.trim()
    );
    if (hasEmptyCategoryName) {
      alert('Please enter all category names');
      return;
    }

    onPublish({
      cycleName,
      cycleType: cycleType === 'Others' ? customCycleType : cycleType,
      cycleDeadline,
      reviewPeriod,
      reviewLevels,
      assessmentCategories,
      description,
      departments: selectedDepartments,
      roles: selectedRoles,
      employees: selectedEmployees
    });
  };

  let currentOptions: string[] = [];
  if (selectionType === 'Department') currentOptions = departmentOptions;
  else if (selectionType === 'Role') currentOptions = roleOptions;
  else if (selectionType === 'Employee') currentOptions = employeeOptions;

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaUserTie className="mr-2" size={20} /> New Performance Review Cycle
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Cycle Name and Type */}
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
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">Cycle Type*</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded pr-8"
                  value={cycleType === 'Others' ? customCycleType : cycleType}
                  onClick={() => setShowCycleTypeDropdown(true)}
                  readOnly
                  placeholder="Select cycle type"
                  required
                />
                <FaChevronDown 
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowCycleTypeDropdown(!showCycleTypeDropdown)}
                />
              </div>
              {showCycleTypeDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                  {cycleTypeOptions.map((type, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCycleTypeSelect(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
              {cycleType === 'Others' && (
                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter custom cycle type"
                    value={customCycleType}
                    onChange={(e) => setCustomCycleType(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Review Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Review Start Date*</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={reviewPeriod.startDate}
                onChange={(e) => setReviewPeriod({...reviewPeriod, startDate: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Review End Date*</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={reviewPeriod.endDate}
                onChange={(e) => setReviewPeriod({...reviewPeriod, endDate: e.target.value})}
                min={reviewPeriod.startDate}
                required
              />
            </div>
          </div>

          {/* Cycle Deadline */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Cycle Deadline*</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={cycleDeadline}
              onChange={(e) => setCycleDeadline(e.target.value)}
              min={reviewPeriod.endDate}
              required
            />
            <p className="text-xs text-gray-500 mt-1">This should be after the review period ends</p>
          </div>

          {/* Selection Type */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Select Assignment Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectionType}
              onChange={e => {
                setSelectionType(e.target.value as 'Department' | 'Role' | 'Employee' | '');
                setShowSubDropdown(true);
              }}
            >
              <option value="">-- Select --</option>
              <option value="Department">Department</option>
              <option value="Role">Role</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          {/* Sub dropdown based on selectionType */}
          {selectionType && (
            <div className="mt-2 relative">
              <label className="block text-sm text-gray-500 mb-1">
                Select {selectionType}(s)
              </label>
              <div className="border border-gray-300 rounded p-2 max-h-48 overflow-auto bg-white">
                {currentOptions.map((option, idx) => {
                  const isSelected =
                    (selectionType === 'Department' && selectedDepartments.includes(option)) ||
                    (selectionType === 'Role' && selectedRoles.includes(option)) ||
                    (selectionType === 'Employee' && selectedEmployees.includes(option));

                  return (
                    <div
                      key={idx}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        isSelected ? 'text-gray-400 cursor-not-allowed' : ''
                      }`}
                      onClick={() => !isSelected && addSelection(option)}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Show selected chips */}
          {(selectedDepartments.length > 0 || selectedRoles.length > 0 || selectedEmployees.length > 0) && (
            <div className="mt-4 space-y-2">
              {selectedDepartments.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-1">Departments:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDepartments.map(d => (
                      <span
                        key={d}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {d}
                        <button
                          type="button"
                          onClick={() => removeSelection('Department', d)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedRoles.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-1">Roles:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoles.map(r => (
                      <span
                        key={r}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {r}
                        <button
                          type="button"
                          onClick={() => removeSelection('Role', r)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEmployees.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-1">Employees:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployees.map(emp => (
                      <span
                        key={emp}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {emp}
                        <button
                          type="button"
                          onClick={() => removeSelection('Employee', emp)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
                      min={reviewPeriod.startDate}
                      max={cycleDeadline}
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
                            <label className="block text-sm text-gray-500 mb-1">Question</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded"
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
                      
                      <button
                        type="button"
                        onClick={() => addQuestionToCategory(category.id)}
                        className="mt-2 bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 flex items-center"
                      >
                        <FaPlus className="mr-1" size={12} /> Add Question
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No assessment categories added yet.</p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Description / Instructions (optional)</label>
            <textarea
              rows={4}
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional info or instructions for the review cycle"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-6 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-6 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Publish
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewHikeCycleForm;