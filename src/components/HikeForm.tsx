import React, { useState, useEffect } from 'react';
import { FaUserTie, FaPlus, FaTrash, FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Define the interfaces
interface ReviewLevel {
  id?: number;
  name: string;
  deadline: string;
  reviewerId: number | null;
}

interface Reviewer {
  id: number;
  name: string;
  role: string;
}

interface Rating {
  id: number;
  name: string;
  description: string;
  number: number;
}

interface AssessmentQuestion {
  id?: number;
  question: string;
}

interface AssessmentCategory {
  id?: number;
  name: string;
  questions: AssessmentQuestion[];
}

interface NewHikeCycleFormProps {
  onCancel: () => void;
  onPublish: (data: any) => void;
}

interface SelectedOption {
  id: number;
  name: string;
  type: string;
}

interface CustomField {
  id: string;
  label: string;
  dataType: 'text' | 'number' | 'date' | 'textarea' | 'select';
  placeholder: string;
  position: number;
  options?: string[];
  isRequired: boolean;
}

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
  // Existing state
  const [cycleName, setCycleName] = useState('');
  const [cycleDeadline, setCycleDeadline] = useState('');
  const [reviewPeriod, setReviewPeriod] = useState({
    startDate: '',
    endDate: ''
  });
  const [reviewLevels, setReviewLevels] = useState<ReviewLevel[]>([]);
  const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
  const [description, setDescription] = useState('');
  const [newLevelName, setNewLevelName] = useState('');
  const [showManagerDropdown, setShowManagerDropdown] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [showCycleTypeDropdown, setShowCycleTypeDropdown] = useState(false);
  const [cycleType, setCycleType] = useState<{ id: number; name: string } | null>(null);
  const [cycleTypeOptions, setCycleTypeOptions] = useState<{ id: number; name: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [groupedReviewers, setGroupedReviewers] = useState<Record<string, Reviewer[]>>({});
  const [selectionType, setSelectionType] = useState<string>('');
  const [assessmentTypes, setAssessmentTypes] = useState<{ id: number; type: string }[]>([]);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>('');
  const [dynamicOptions, setDynamicOptions] = useState<{ id: number; name: string }[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<Rating[]>([]);
  const [selectedDynamicOptions, setSelectedDynamicOptions] = useState<SelectedOption[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
  const navigate = useNavigate();

  // Custom fields state
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newField, setNewField] = useState<Omit<CustomField, 'id' | 'position'>>({
    label: '',
    dataType: 'text',
    placeholder: '',
    options: [],
    isRequired: false
  });
  const [activeFieldTab, setActiveFieldTab] = useState<'formFields' | 'customFields'>('formFields');

  // Fetch data effects
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch ratings
        const ratingsResponse = await fetch('https://localhost:7000/api/Rating');
        if (!ratingsResponse.ok) throw new Error('Failed to fetch ratings');
        setRatings(await ratingsResponse.json());

        // Fetch assessment types
        const assessmentTypesResponse = await fetch('https://localhost:7000/api/AssessmentType');
        if (!assessmentTypesResponse.ok) throw new Error('Failed to fetch assessment types');
        setAssessmentTypes(await assessmentTypesResponse.json());

        // Fetch categories
        const categoriesResponse = await fetch('https://localhost:7000/api/CategoryMaster');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        setCategoryOptions(await categoriesResponse.json());

        // Fetch reviewers
        const reviewersResponse = await fetch("https://localhost:7000/api/ReviewLevel/reviewers");
        if (!reviewersResponse.ok) throw new Error("Failed to fetch reviewers");
        const reviewersData = await reviewersResponse.json();
        setReviewers(reviewersData);

        // Group reviewers by role
        const grouped = reviewersData.reduce((acc: Record<string, Reviewer[]>, reviewer: Reviewer) => {
          if (!acc[reviewer.role]) acc[reviewer.role] = [];
          acc[reviewer.role].push(reviewer);
          return acc;
        }, {});
        setGroupedReviewers(grouped);

        // Fetch cycle types
        const cycleTypesResponse = await fetch('https://localhost:7000/api/CycleType');
        if (!cycleTypesResponse.ok) throw new Error('Failed to fetch cycle types');
        setCycleTypeOptions(await cycleTypesResponse.json());

      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    setSelectionType(selectedAssessmentType);
  }, [selectedAssessmentType]);

  useEffect(() => {
    const fetchOptionsByType = async () => {
      if (!selectedAssessmentType) return;

      try {
        const response = await fetch(`https://localhost:7000/api/AssessmentType/${selectedAssessmentType}`);
        if (!response.ok) throw new Error('Failed to fetch options');
        setDynamicOptions(await response.json());
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptionsByType();
  }, [selectedAssessmentType]);

  // Custom field functions
  const handleAddField = () => {
    const newCustomField: CustomField = {
      id: Date.now().toString(),
      ...newField,
      position: customFields.length > 0 ? Math.max(...customFields.map(f => f.position)) + 1 : 1
    };
    
    setCustomFields([...customFields, newCustomField]);
    setNewField({ 
      label: '', 
      dataType: 'text', 
      placeholder: '', 
      options: [], 
      isRequired: false 
    });
    setShowAddFieldModal(false);
  };

  const removeField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = customFields.findIndex(f => f.id === id);
    if (index === -1) return;

    const newFields = [...customFields];
    const newPosition = direction === 'up' ? index - 1 : index + 1;

    if (newPosition >= 0 && newPosition < newFields.length) {
      [newFields[index].position, newFields[newPosition].position] = 
        [newFields[newPosition].position, newFields[index].position];
      
      setCustomFields(newFields.sort((a, b) => a.position - b.position));
    }
  };

  // Form functions
  const handleLevelChange = (id: number, field: keyof ReviewLevel, value: string | number) => {
    setReviewLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === id ? { ...level, [field]: value } : level
      )
    );
  };

  const addReviewLevel = () => {
    if (newLevelName.trim()) {
      setReviewLevels([
        ...reviewLevels,
        {
          id: reviewLevels.length + 1,
          name: newLevelName,
          deadline: '',
          reviewerId: null 
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
            { id: (category.questions.length > 0 ? Math.max(...category.questions.map(q => q.id || 0)) : 0) + 1, question: '' }
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

  const handleCycleTypeSelect = (type: { id: number; name: string }) => {
    setCycleType(type);
    setShowCycleTypeDropdown(false);
  };

  const handleOptionSelect = (id: number) => {
    const option = dynamicOptions.find(opt => opt.id === id);
    if (!option) return;

    const alreadySelected = selectedDynamicOptions.some(opt => opt.id === id && opt.type === selectionType);
    if (!alreadySelected) {
      setSelectedDynamicOptions(prev => [...prev, { ...option, type: selectionType }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!cycleType) return alert('Please select a review cycle type');
    if (!reviewPeriod.startDate || !reviewPeriod.endDate) return alert('Please select review period dates');
    if (!selectedAssessmentType) return alert('Please select an assessment type');
    if (selectedRatings.length === 0) return alert('Please select at least one rating');
    
    const hasEmptyQuestion = assessmentCategories.some(
      category => category.questions.some(q => !q.question.trim())
    );
    if (hasEmptyQuestion) return alert('Please enter all assessment questions');

    const hasEmptyCategoryId = assessmentCategories.some(
      category => !category.id
    );
    if (hasEmptyCategoryId) return alert('Please select all category masters');

    // Prepare data to send
    const dataToSend = {
      cycleName,
      cycleTypeId: cycleType.id,
      cycleDeadline,
      reviewPeriodStartDate: reviewPeriod.startDate,
      reviewPeriodEndDate: reviewPeriod.endDate,
      description,
      reviewLevels: reviewLevels.map(level => ({
        name: level.name,
        deadline: level.deadline,
        reviewerId: level.reviewerId
      })),
      assessmentCategories: assessmentCategories.map(category => ({
        categoryMasterId: category.id,
        questions: category.questions.map(q => q.question)
      })),
      selectedAssessmentTypeOptions: assessmentTypes
        .map(type => {
          const matchingOptions = selectedDynamicOptions.filter(opt => opt.type === type.type);
          return matchingOptions.length > 0 ? {
            assessmentTypeId: type.id,
            selectedOptionIds: matchingOptions.map(opt => opt.id)
          } : null;
        })
        .filter(Boolean),
      ratings: selectedRatings.map(r => r.id),
      customFields: customFields.map(field => ({
        label: field.label,
        dataType: field.dataType,
        placeholder: field.placeholder,
        position: field.position,
        isRequired: field.isRequired,
        options: field.options || []
      })),
    };

    try {
      const response = await fetch('https://localhost:7000/api/HikeCycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create hike cycle');
      }

      const result = await response.json();
      onPublish(result);
      alert('Hike Cycle created successfully!');
    } catch (error: any) {
      console.error('Error publishing hike cycle:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Add Field Modal Component
  const AddFieldModal = ({ 
    onClose, 
    onAdd,
    field,
    onChange
  }: {
    onClose: () => void;
    onAdd: () => void;
    field: Omit<CustomField, 'id' | 'position'>;
    onChange: (field: Omit<CustomField, 'id' | 'position'>) => void;
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Add Custom Field</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Field Label*</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={field.label}
                onChange={(e) => onChange({ ...field, label: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Data Type*</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={field.dataType}
                onChange={(e) => onChange({ 
                  ...field, 
                  dataType: e.target.value as 'text' | 'number' | 'date' | 'textarea' | 'select' 
                })}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="textarea">Text Area</option>
                <option value="select">Dropdown</option>
              </select>
            </div>
            
            {field.dataType === 'select' && (
              <div>
                <label className="block text-sm text-gray-500 mb-1">Options (comma separated)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={field.options?.join(', ') || ''}
                  onChange={(e) => onChange({ 
                    ...field, 
                    options: e.target.value.split(',').map(opt => opt.trim()) 
                  })}
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Placeholder Text</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={field.placeholder}
                onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRequired"
                checked={field.isRequired}
                onChange={(e) => onChange({ ...field, isRequired: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isRequired" className="text-sm text-gray-700">
                Required Field
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onAdd}
              disabled={!field.label}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              Add Field
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-6xl mx-auto">
      {/* Top-left Back Arrow */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <FaArrowLeft className="mr-2" />
          Back to Hike Cycles
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaUserTie className="mr-2" size={20} /> New Performance Review Cycle
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information Section */}
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
                  value={cycleType?.name || ''}
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
                  {cycleTypeOptions.map((type) => (
                    <div
                      key={type.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCycleTypeSelect(type)}
                    >
                      {type.name}
                    </div>
                  ))}
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
                onChange={(e) => setReviewPeriod({ ...reviewPeriod, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Review End Date*</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={reviewPeriod.endDate}
                onChange={(e) => setReviewPeriod({ ...reviewPeriod, endDate: e.target.value })}
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

          {/* Rating Selection */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Select Ratings*</label>
            <div className="flex flex-wrap gap-2">
              {ratings.map((rating) => (
                <button
                  type="button"
                  key={rating.id}
                  className={`border px-3 py-1 rounded-md text-sm ${
                    selectedRatings.some(r => r.id === rating.id)
                      ? 'bg-blue-100 border-blue-400 text-blue-800'
                      : 'bg-white border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedRatings(prev =>
                      prev.some(r => r.id === rating.id)
                        ? prev.filter(r => r.id !== rating.id)
                        : [...prev, rating]
                    );
                  }}
                >
                  {rating.name} ({rating.number})
                </button>
              ))}
            </div>

            {selectedRatings.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-semibold text-gray-600 mb-1">Selected Ratings:</div>
                <div className="flex flex-col gap-2">
                  {selectedRatings.map((rating) => (
                    <div
                      key={rating.id}
                      className="flex justify-between items-center px-4 py-2 rounded border text-gray-800 bg-gray-50 shadow-sm"
                    >
                      <div>
                        <span className="font-bold">{rating.name}</span> - {rating.description}
                        <span className="text-sm text-gray-500 ml-1">({rating.number})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedRatings(prev => prev.filter(r => r.id !== rating.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assignment Type */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Select Assignment Type*</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedAssessmentType}
              onChange={(e) => setSelectedAssessmentType(e.target.value)}
              required
            >
              <option value="">-- Select Assessment Type --</option>
              {assessmentTypes.map((type) => (
                <option key={type.id} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>
          </div>

          {selectionType && (
            <div className="mt-2 relative">
              <label className="block text-sm text-gray-500 mb-1">
                Select {selectionType}(s)
              </label>
              <div className="border border-gray-300 rounded p-2 max-h-48 overflow-auto bg-white">
                {dynamicOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      selectedDynamicOptions.some(opt => opt.id === option.id && opt.type === selectionType)
                        ? 'text-gray-400 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDynamicOptions.length > 0 && (
  <div className="mt-4 space-y-4">
    {Array.from(new Set(selectedDynamicOptions.map(opt => opt.type))).map(type => {
      const optionsOfType = selectedDynamicOptions.filter(opt => opt.type === type);
      return (
        <div key={type}>
          <div className="text-sm font-semibold text-gray-600 mb-1">
            Selected {type}(s):
          </div>
          <div className="flex flex-wrap gap-2">
            {optionsOfType.map(option => (
              <span
                key={option.id}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {option.name}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedDynamicOptions(prev =>
                      prev.filter(opt => !(opt.id === option.id && opt.type === type))
                    )
                  }
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      );
    })}
  </div>
)}


          {/* Default Assessment Fields Preview */}
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

          {/* Form Builder Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                type="button"
                onClick={() => setActiveFieldTab('formFields')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeFieldTab === 'formFields'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Form Fields
              </button>
              <button
                type="button"
                onClick={() => setActiveFieldTab('customFields')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeFieldTab === 'customFields'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Custom Fields
              </button>
            </nav>
          </div>

          {/* Form Fields Content */}
          {activeFieldTab === 'formFields' ? (
            <>
              {/* Review Levels */}
              <div>
                <h3 className="font-medium mb-4">Review Levels</h3>
                <div className="space-y-4">
                  {reviewLevels.map(level => (
                    <div key={level.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded relative">
                      <button
                        type="button"
                        onClick={() => removeReviewLevel(level.id!)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        disabled={reviewLevels.length <= 1}
                      >
                        <FaTrash size={14} />
                      </button>

                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Level Name*</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={level.name}
                          onChange={(e) => handleLevelChange(level.id!, 'name', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Review Deadline*</label>
                        <input
                          type="date"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={level.deadline}
                          onChange={(e) => handleLevelChange(level.id!, 'deadline', e.target.value)}
                          min={reviewPeriod.startDate}
                          max={cycleDeadline}
                          required
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm text-gray-500 mb-1">Reviewer*</label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded pr-8"
                            value={reviewers.find((r) => r.id === level.reviewerId)?.name || ''}
                            onClick={() => setShowManagerDropdown(level.id!)}
                            readOnly
                            required
                          />
                          <FaChevronDown
                            className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                            onClick={() => setShowManagerDropdown(level.id!)}
                          />
                        </div>

                        {showManagerDropdown === level.id && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                            {Object.entries(groupedReviewers).map(([role, users]) => (
                              <div key={role}>
                                <div className="text-xs text-gray-500 font-semibold px-3 py-1 bg-gray-100">
                                  {role}
                                </div>
                                {users.map((reviewer) => (
                                  <div
                                    key={reviewer.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      handleLevelChange(level.id!, 'reviewerId', reviewer.id);
                                      setShowManagerDropdown(null);
                                    }}
                                  >
                                    {reviewer.name}
                                  </div>
                                ))}
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

              {/* Assessment Questions */}
              <div>
                <h3 className="font-medium mb-4">Employee Assessment Questions</h3>

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
                              onClick={() => handleCategorySelect(category.name)}
                            >
                              {category.name}
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

                {assessmentCategories.length > 0 ? (
                  <div className="space-y-6">
                    {assessmentCategories.map((category) => (
                      <div
                        key={category.id}
                        className="border border-gray-200 rounded p-4 relative"
                      >
                        <button
                          type="button"
                          onClick={() => removeAssessmentCategory(category.id!)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={14} />
                        </button>

                        <div className="mb-4">
                          <label className="block text-sm text-gray-500 mb-1">Category Name*</label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={category.name}
                            onChange={(e) => {
                              const selectedName = e.target.value;
                              const alreadyUsed = assessmentCategories.some(
                                (c) => c.id !== category.id && c.name === selectedName
                              );
                              if (alreadyUsed) {
                                alert("This category is already selected.");
                                return;
                              }
                              setAssessmentCategories(
                                assessmentCategories.map((c) =>
                                  c.id === category.id ? { ...c, name: selectedName } : c
                                )
                              );
                            }}
                            required
                          >
                            <option value="">-- Select Category --</option>
                            {categoryOptions.map((option, index) => (
                              <option key={index} value={option.name}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-3">
                          {category.questions.map((question) => (
                            <div
                              key={question.id}
                              className="flex items-start space-x-2"
                            >
                              <div className="flex-1">
                                <label className="block text-sm text-gray-500 mb-1">Question*</label>
                                <input
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded"
                                  value={question.question}
                                  onChange={(e) =>
                                    handleQuestionChange(category.id!, question.id!, e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeQuestionFromCategory(category.id!, question.id!)
                                }
                                className="mt-6 text-red-500 hover:text-red-700"
                                disabled={category.questions.length <= 1}
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => addQuestionToCategory(category.id!)}
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
            </>
          ) : (
            /* Custom Fields Content */
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Custom Form Fields</h3>
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(true)}
                  className="flex items-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" /> Add Custom Field
                </button>
              </div>

              {customFields.length > 0 ? (
                <div className="space-y-4">
                  {customFields
                    .sort((a, b) => a.position - b.position)
                    .map((field) => (
                      <div key={field.id} className="border border-gray-200 rounded p-4 relative group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              {field.isRequired && (
                                <span className="ml-2 text-xs text-red-500">(Required)</span>
                              )}
                            </div>
                            
                            {field.dataType === 'text' && (
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder={field.placeholder}
                                disabled
                              />
                            )}
                            
                            {field.dataType === 'number' && (
                              <input
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder={field.placeholder}
                                disabled
                              />
                            )}
                            
                            {field.dataType === 'date' && (
                              <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded"
                                disabled
                              />
                            )}
                            
                            {field.dataType === 'textarea' && (
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded"
                                rows={3}
                                placeholder={field.placeholder}
                                disabled
                              />
                            )}
                            
                            {field.dataType === 'select' && (
                              <select className="w-full p-2 border border-gray-300 rounded" disabled>
                                <option value="">{field.placeholder || 'Select an option'}</option>
                                {field.options?.map((option, i) => (
                                  <option key={i} value={option}>{option}</option>
                                ))}
                              </select>
                            )}
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <button
                              type="button"
                              onClick={() => moveField(field.id, 'up')}
                              className="text-gray-500 hover:text-gray-700"
                              disabled={field.position === 1}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveField(field.id, 'down')}
                              className="text-gray-500 hover:text-gray-700"
                              disabled={field.position === customFields.length}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removeField(field.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Type: {field.dataType} {field.dataType === 'select' && `(${field.options?.length || 0} options)`}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded">
                  <p className="text-gray-500">No custom fields added yet</p>
                  <button
                    type="button"
                    onClick={() => setShowAddFieldModal(true)}
                    className="mt-4 flex items-center justify-center mx-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    <FaPlus className="mr-2" /> Add Your First Field
                  </button>
                </div>
              )}
            </div>
          )}

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

          {/* Form Actions */}
          <div className="flex space-x-4 justify-end pt-6">
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
              Publish Review Cycle
            </button>
          </div>
        </div>
      </form>

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <AddFieldModal
          onClose={() => setShowAddFieldModal(false)}
          onAdd={handleAddField}
          field={newField}
          onChange={(field) => setNewField(field)}
        />
      )}
    </div>
  );
};

export default NewHikeCycleForm;