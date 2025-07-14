import React, { useState } from 'react';
import { FaUserTie, FaPlus, FaTrash, FaChevronDown } from 'react-icons/fa';
import { useEffect } from 'react';
// Define the interfaces based on your C# DTOs
interface ReviewLevel {
  id?: number;
  name: string;
  deadline: string;
  reviewerId: number | null;
}

interface Reviewer {
  id: number;
  name: string;
  role: string; // 💡 to accept all role names
}

interface Rating {
  id: number;
  name: string;
  description: string;
  number: number;
}

interface AssessmentQuestion {
  id?: number; // Optional
  question: string;
}

interface AssessmentCategory {
  id?: number; // Optional
  name: string;
  questions: AssessmentQuestion[];
}

interface NewHikeCycleFormProps {
  onCancel: () => void;
  onPublish: (data: any) => void; // Keeping 'any' for now, will map to DTO below
}

interface SelectedOption {
  id: number;
  name: string;
  type: string; // e.g., 'Department', 'Role'
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
  const [cycleName, setCycleName] = useState('');
  
  const [customCycleType, setCustomCycleType] = useState('');
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


  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [cycleTypeOptions, setCycleTypeOptions] = useState<{ id: number; name: string }[]>([]);
const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
const [reviewers, setReviewers] = useState<Reviewer[]>([]);
const [groupedReviewers, setGroupedReviewers] = useState<Record<string, Reviewer[]>>({});

const [departmentOptions, setDepartmentOptions] = useState<{ id: number; name: string }[]>([]);
const [roleOptions, setRoleOptions] = useState<{ id: number; name: string }[]>([]);

const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
const [selectedRoles, setSelectedRoles] = useState<number[]>([]);


const [selectionType, setSelectionType] = useState<string>(''); // now dynamic

const [assessmentTypes, setAssessmentTypes] = useState<{ id: number; type: string }[]>([]);
const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>(''); // e.g., 'Role'

const [dynamicOptions, setDynamicOptions] = useState<{ id: number; name: string }[]>([]);

const [ratings, setRatings] = useState<Rating[]>([]);
const [selectedRatings, setSelectedRatings] = useState<Rating[]>([]);
 const [selectedDynamicOptions, setSelectedDynamicOptions] = useState<SelectedOption[]>([]);
  // const [showSubDropdown, setShowSubDropdown] = useState(false); // Not explicitly used for controlling visibility
 // Already likely imported

 const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
const handleOptionSelect = (id: number) => {
  const option = currentOptions.find(opt => opt.id === id);
  if (!option) return;

  const alreadySelected = selectedDynamicOptions.some(opt => opt.id === id && opt.type === selectionType);
  if (!alreadySelected) {
    setSelectedDynamicOptions(prev => [...prev, { ...option, type: selectionType }]);
  }
};

useEffect(() => {
  const fetchRatings = async () => {
    try {
      const response = await fetch('https://localhost:7000/api/Rating');
      if (!response.ok) throw new Error('Failed to fetch ratings');
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  fetchRatings();
}, []);


useEffect(() => {
  setSelectionType(selectedAssessmentType); // keep it synced
}, [selectedAssessmentType]);


 useEffect(() => {
  const fetchAssessmentTypes = async () => {
    try {
      const response = await fetch('https://localhost:7000/api/AssessmentType');
      if (!response.ok) throw new Error('Failed to fetch assessment types');
      const data = await response.json();
      setAssessmentTypes(data); // example: [{ id: 1, type: "Role" }, ...]
    } catch (error) {
      console.error('Error fetching assessment types:', error);
    }
  };

  fetchAssessmentTypes();
}, []);


useEffect(() => {
  const fetchOptionsByType = async () => {
    if (!selectedAssessmentType) return;

    try {
      const response =await fetch(`https://localhost:7000/api/AssessmentType/${selectedAssessmentType}`)

      if (!response.ok) throw new Error('Failed to fetch options');

      const data = await response.json();
      setDynamicOptions(data); // dynamically store any options
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  fetchOptionsByType();
}, [selectedAssessmentType]);


const fetchReviewers = async () => {
  try {
    const response = await fetch("https://localhost:7000/api/ReviewLevel/reviewers"); // ✅ FIXED endpoint
    if (!response.ok) throw new Error("Failed to fetch reviewers");
    const data = await response.json();
    setReviewers(data);
    console.log("Reviewers fetched:", data); // You should now see all reviewers
  } catch (error) {
    console.error("Error fetching reviewers:", error);
  }
};


 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7000/api/CategoryMaster');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategoryOptions(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  fetchCategories();
}, []);

useEffect(() => {
  fetchReviewers();
}, []);

useEffect(() => {
  const grouped = reviewers.reduce((acc: Record<string, Reviewer[]>, reviewer) => {
    if (!acc[reviewer.role]) {
      acc[reviewer.role] = [];
    }
    acc[reviewer.role].push(reviewer);
    return acc;
  }, {});

  setGroupedReviewers(grouped);
}, [reviewers]);

useEffect(() => {
  const fetchCycleTypes = async () => {
    try {
      const response = await fetch('https://localhost:7000/api/CycleType');
      if (!response.ok) {
        throw new Error('Failed to fetch cycle types');
      }
      const data = await response.json();
      setCycleTypeOptions(data); 
    } catch (error) {
      console.error('Error fetching cycle types:', error);
    }
  };

  fetchCycleTypes();
}, []);

 const removeSelection = (type: 'Department' | 'Role', id: number) => {
  if (type === 'Department') {
    setSelectedDepartments(prev => prev.filter(d => d !== id));
  } else if (type === 'Role') {
    setSelectedRoles(prev => prev.filter(r => r !== id));
  }
};

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
            { id: (category.questions.length > 0 ? Math.max(...category.questions.map(q => q.id || 0)) : 0) + 1, question: '' } // Generate unique ID
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
  setCycleType(type); // 👈 Store full object
  setCustomCycleType('');
  setShowCycleTypeDropdown(false);
};


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!cycleType) {
    alert('Please select a review cycle type');
    return;
  }

  if (!reviewPeriod.startDate || !reviewPeriod.endDate) {
    alert('Please select review period dates');
    return;
  }

  if (!selectedAssessmentType) {
    alert('Please select an assessment type');
    return;
  }

  if (selectedRatings.length === 0) {
    alert('Please select at least one rating');
    return;
  }

  const hasEmptyQuestion = assessmentCategories.some(
    category => category.questions.some(q => !q.question.trim())
  );
  if (hasEmptyQuestion) {
    alert('Please enter all assessment questions');
    return;
  }

  const hasEmptyCategoryId = assessmentCategories.some(
    category => !category.id
  );
  if (hasEmptyCategoryId) {
    alert('Please select all category masters');
    return;
  }

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
      if (matchingOptions.length === 0) return null;

      return {
        assessmentTypeId: type.id,
        selectedOptionIds: matchingOptions.map(opt => opt.id)
      };
    })
    .filter(Boolean),
  ratings: selectedRatings.map(r => r.id),
  
};



  console.log('🟡 Submitting data to API:', dataToSend);

  try {
    const response = await fetch('https://localhost:7000/api/HikeCycle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    console.log('🟢 Raw response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Something went wrong with the API call.';
      try {
        const errorData = await response.json();
        console.error('🔴 API error response:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseErr) {
        console.error('🔴 Failed to parse error response');
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Hike Cycle published successfully:', result);
    onPublish(result);
    alert('Hike Cycle created successfully!');
  } catch (error: any) {
    console.error('❌ Error publishing hike cycle:', error.message);
    alert(`Failed to create hike cycle: ${error.message}`);
  }
};

const currentOptions = dynamicOptions;


  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaUserTie className="mr-2" size={20} /> New Performance Review Cycle
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
         {/* Cycle Name and Type */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Cycle Name Input */}
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

  {/* Cycle Type Dropdown */}
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

    {/* Dropdown options */}
    {showCycleTypeDropdown && (
      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
        {cycleTypeOptions.map((type) => (
          <div
            key={type.id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setCycleType(type); // ✅ Set full object
              setShowCycleTypeDropdown(false);
            }}
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

{/* Rating Selection Section */}
<div>
  <label className="block text-sm text-gray-500 mb-1">Select Ratings</label>
  <div className="flex flex-wrap gap-2">
    {ratings.map((rating) => (
      <button
        type="button"
        key={rating.id}
        className={`border px-3 py-1 rounded-md text-sm ${
          selectedRatings.find((r) => r.id === rating.id)
            ? 'bg-blue-100 border-blue-400 text-blue-800'
            : 'bg-white border-gray-300'
        }`}
        onClick={() => {
          const alreadySelected = selectedRatings.find((r) => r.id === rating.id);
          if (alreadySelected) {
            setSelectedRatings(selectedRatings.filter((r) => r.id !== rating.id));
          } else {
            setSelectedRatings([...selectedRatings, rating]);
          }
        }}
      >
        {rating.name} ({rating.number})
      </button>
    ))}
  </div>

  {/* Show Selected Ratings */}

{selectedRatings.length > 0 && (
  <div className="mt-4 space-y-2">
    <div className="text-sm font-semibold text-gray-600 mb-1">Selected Ratings:</div>
    <div className="flex flex-col gap-2">
      {selectedRatings.map((rating) => (
        <div
          key={rating.id}
          className="flex justify-between items-center px-4 py-2 rounded border text-gray-800 bg-[rgb(249_250_251)] shadow-sm"
        >
          <div>
            <span className="font-bold">{rating.name}</span> -{" "}
            <span>{rating.description}</span>{" "}
            <span className="text-sm text-gray-500 ml-1">({rating.number})</span>
          </div>
          <button
            type="button"
            className="text-red-500 hover:text-red-700"
            onClick={() =>
              setSelectedRatings(selectedRatings.filter((r) => r.id !== rating.id))
            }
          >
            <FaTrash size={14} />
          </button>
        </div>
      ))}
    </div>
  </div>
)}


</div>


         {/* Selection Type */}
<div>
  <label className="block text-sm text-gray-500 mb-1">Select Assignment Type</label>
<select
  className="w-full p-2 border border-gray-300 rounded"
  value={selectedAssessmentType}
  onChange={(e) => setSelectedAssessmentType(e.target.value)}
>
  <option value="">-- Select Assessment Type --</option>
  {assessmentTypes.map((type) => (
    <option key={type.id} value={type.type}>
      {type.type}
    </option>
  ))}
</select>

</div>

{/* Sub dropdown based on selectionType  */}
{selectionType && (
  <div className="mt-2 relative">
    <label className="block text-sm text-gray-500 mb-1">
      Select {selectionType}(s)
    </label>
    <div className="border border-gray-300 rounded p-2 max-h-48 overflow-auto bg-white">
      {currentOptions.map((option) => {
        const isSelected = selectedOptionIds.includes(option.id);

        return (
          <div
            key={option.id}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${
              isSelected ? 'text-gray-400 cursor-not-allowed' : ''
            }`}
            onClick={() => !isSelected && handleOptionSelect(option.id)}
          >
            {option.name}
          </div>
        );
      })}
    </div>
  </div>
)}

{/* Show selected chips */}
{selectedDynamicOptions.length > 0 && (
  <div className="mt-4 space-y-4">
    {['Department', 'Role'].map((type) => {
      const optionsOfType = selectedDynamicOptions.filter(opt => opt.type === type);
      return optionsOfType.length > 0 ? (
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
      ) : null;
    })}
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

        {/* Level Name */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Level Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={level.name}
            onChange={(e) => handleLevelChange(level.id!, 'name', e.target.value)}
            required
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Review Deadline</label>
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

        {/* Reviewer dropdown grouped by role */}
        <div className="relative">
          <label className="block text-sm text-gray-500 mb-1">Reviewer</label>
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

    {/* Add new level */}
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
                onClick={() => {
                  handleCategorySelect(category.name); // Pass string
                  setShowCategoryDropdown(false);
                }}
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

  {/* Existing Categories */}
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
                  <label className="block text-sm text-gray-500 mb-1">Question</label>
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