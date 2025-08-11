import React, { useState, useEffect } from 'react';
import { FaUserTie, FaPlus, FaTrash, FaChevronDown } from 'react-icons/fa';

export interface HikeCycleForm {
  id: number;
  title: string;
  description?: string;
  cycleTypeName?: string;
  assessmentSelections?: {
    type: string; // e.g., 'Department', 'Role'
    values: string[]; // Names of the selected departments/roles
    assessmentTypeId: number; // <--- This was missing/different in your ADashboard.tsx's type
    selectedOptionIds: number[]; // <--- This was missing/different in your ADashboard.tsx's type
  }[];
  reviewPeriodStartDate?: string;
  reviewPeriodEndDate?: string;
  cycleDeadline?: string;
  createdAt: string;
  status: 'pending_approval' | 'published';
  reviewLevels?: {
    id?: number;
    reviewOrder: number;
    name: string;
    reviewerName: string;
    reviewerId: number;
    deadline: string;
  }[];
  assessmentCategories?: {
    categoryName: string;
    categoryMasterId: number; // Ensure this is also present if used
    questions: string[];
  }[];
  cycleTypeId?: number;
  ratings?: {
    id: number;
    name: string;
    description: string;
    number: number;
  }[];
  hikeCycleId?: number; // Added for the main form if it's for an existing cycle
}

// ... rest of your ADashboard.tsx code
interface ReviewLevel {
  id?: number;
  name: string;
  deadline: string;
  reviewerId: number | null;
  reviewOrder: number;
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

interface CustomField {
  id: string;
  label: string;
  dataType: 'text' | 'number' | 'date' | 'textarea' | 'select';
  placeholder: string;
  position: number;
  options?: string[];
  isRequired: boolean;
}


interface AssessmentQuestion {
  id?: number; // Optional, for client-side keying
  question: string;
}

interface AssessmentCategory {
  id?: number; // Optional, for client-side keying
  name: string; // Display name
  categoryMasterId?: number; // Actual ID for backend
  questions: AssessmentQuestion[];
}

interface NewHikeCycleFormProps {
  onCancel: () => void;
  onPublish: (data: HikeCycleForm) => void; // Changed type to HikeCycleForm
  userDepartment: string;
  userRole: string;
  initialData?: HikeCycleForm | null;
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
      rating: 0,
    },
  ],
  projects: [
    {
      name: 'Project Contribution',
      description: 'Evaluate contributions to key projects',
      rating: 0,
    },
  ],
  skills: [
    {
      category: 'Technical Skills',
      rating: 0,
    },
  ],
};

const NewHikeCycleForm: React.FC<NewHikeCycleFormProps> = ({
  onCancel,
  onPublish,
  userDepartment,
  userRole,
  initialData,
}) => {
  const isHR = userDepartment === 'Human Resource';
  const isAdmin = userRole === 'Admin';

  // State for form fields
  const [cycleName, setCycleName] = useState('');
  const [customCycleType, setCustomCycleType] = useState(''); // Seems unused now, can remove?
  const [cycleDeadline, setCycleDeadline] = useState('');
  const [reviewPeriod, setReviewPeriod] = useState({
    startDate: '',
    endDate: '',
  });
  const [reviewLevels, setReviewLevels] = useState<ReviewLevel[]>([]);
  const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
  const [description, setDescription] = useState('');
  const [newLevelName, setNewLevelName] = useState('');
  const [showManagerDropdown, setShowManagerDropdown] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false); // Seems unused, can remove?
  const [showCycleTypeDropdown, setShowCycleTypeDropdown] = useState(false);
  const [cycleType, setCycleType] = useState<{ id: number; name: string } | null>(null);

  // Data for dropdowns/lookups
  const [cycleTypeOptions, setCycleTypeOptions] = useState<{ id: number; name: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [groupedReviewers, setGroupedReviewers] = useState<Record<string, Reviewer[]>>({});
  const [assessmentTypes, setAssessmentTypes] = useState<{ id: number; type: string }[]>([]);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>(''); // e.g., 'Role'
  const [dynamicOptions, setDynamicOptions] = useState<{ id: number; name: string }[]>([]); // Options fetched based on selectedAssessmentType
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<Rating[]>([]);
  const [selectedDynamicOptions, setSelectedDynamicOptions] = useState<SelectedOption[]>([]); // Selected departments/roles/etc.

  // Submission status (though currently not directly sent to API, implies intent)
const [submissionStatus, setSubmissionStatus] = useState<'pending_approval' | 'published'>('pending_approval');

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

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  const createdByUserId = loggedInUser?.id;

  // Derive current options for the dynamic dropdown (e.g., departments or roles)
  const currentOptions = dynamicOptions;

  // Handler for selecting dynamic options (Department, Role, etc.)
  const handleOptionSelect = (id: number, name: string) => {
    // Ensure the option is not already selected for the *current* selection type
    const alreadySelected = selectedDynamicOptions.some(
      (opt) => opt.id === id && opt.type === selectedAssessmentType
    );
    if (!alreadySelected) {
      setSelectedDynamicOptions((prev) => [
        ...prev,
        { id, name, type: selectedAssessmentType },
      ]);
    }
  };

  // Handler for changing review level fields (name, deadline, reviewerId, reviewOrder)
  const handleLevelChange = (id: number, field: string, value: any) => {
    setReviewLevels((prevLevels) => {
      const currentLevel = prevLevels.find((lvl) => lvl.id === id);
      if (!currentLevel) return prevLevels;

      if (field === 'reviewOrder') {
        const newOrder = value;
        // Find the level currently at the target newOrder
        const levelAtTargetOrder = prevLevels.find((lvl) => lvl.reviewOrder === newOrder);

        return prevLevels.map((lvl) => {
          if (lvl.id === id) {
            // Update the current level's order
            return { ...lvl, reviewOrder: newOrder };
          }
          if (levelAtTargetOrder && lvl.id === levelAtTargetOrder.id) {
            // Swap the order with the level that was at the newOrder
            return { ...lvl, reviewOrder: currentLevel.reviewOrder };
          }
          return lvl;
        });
      }

      return prevLevels.map((lvl) => (lvl.id === id ? { ...lvl, [field]: value } : lvl));
    });
  };
useEffect(() => {
  if (initialData) {
    console.log('Loading initial data:', initialData);
    // ... rest of your code
  }
}, [initialData, cycleTypeOptions, categoryOptions, assessmentTypes, isAdmin]);
  // --- Initial Data Loading (useEffect for Edit Mode) ---
  useEffect(() => {
    if (initialData) {
      console.log('Loading initial data:', initialData);
      setCycleName(initialData.title || '');
      setDescription(initialData.description || '');

      // Cycle Type
      // You'll need to find the full cycleType object from options based on initialData.cycleTypeId
      if (initialData.cycleTypeId && cycleTypeOptions.length > 0) {
        const initialCycleType = cycleTypeOptions.find((ct) => ct.id === initialData.cycleTypeId);
        setCycleType(initialCycleType || null);
      } else if (initialData.cycleTypeName) {
        // Fallback if ID is not available but name is (less reliable, but for display)
        setCycleType({ id: -1, name: initialData.cycleTypeName }); // Use a dummy ID if only name is present
      }

      // Review Period
      setReviewPeriod({
        startDate: initialData.reviewPeriodStartDate?.split('T')[0] || '', // Format for input type="date"
        endDate: initialData.reviewPeriodEndDate?.split('T')[0] || '',
      });
      setCycleDeadline(initialData.cycleDeadline?.split('T')[0] || '');

      // Review Levels
      if (initialData.reviewLevels) {
        setReviewLevels(
          initialData.reviewLevels.map((level, index) => ({
            id: level.id || index + 1, // Use existing ID or generate one for React keying
            name: level.name,
            deadline: level.deadline.split('T')[0],
            reviewerId: level.reviewerId,
            reviewOrder: level.reviewOrder,
          }))
        );
      }

      // Assessment Categories & Questions
      if (initialData.assessmentCategories) {
        const mappedCategories: AssessmentCategory[] = initialData.assessmentCategories.map(
          (cat, catIndex) => ({
            id: categoryOptions.find((opt) => opt.name === cat.categoryName)?.id || catIndex + 1, // Find master ID
            name: cat.categoryName,
            categoryMasterId: cat.categoryMasterId,
            questions: cat.questions.map((q, qIndex) => ({
              id: qIndex + 1, // Generate ID for React keying
              question: q,
            })),
          })
        );
        setAssessmentCategories(mappedCategories);
      }

      // Ratings
      if (initialData.ratings) {
        setSelectedRatings(initialData.ratings);
      }

      // Assessment Selections (Department, Role, etc.)
      if (initialData.assessmentSelections && assessmentTypes.length > 0) {
        // Assuming initialData.assessmentSelections will have assessmentTypeId
        // and selectedOptionIds
        const mappedSelections: SelectedOption[] = [];
        let initialSelectedAssessmentType = '';

        initialData.assessmentSelections.forEach((selection) => {
          const typeObject = assessmentTypes.find((at) => at.id === selection.assessmentTypeId);
          if (typeObject) {
           selection.selectedOptionIds.forEach((id, index) => {
  mappedSelections.push({
    id: id,
    name: selection.values[index], // ✅ Correctly show 'HR Executive', 'Project Manager', etc.
    type: typeObject.type,
  });
});

            // Set the first assessment type found as the selected one
            if (!initialSelectedAssessmentType) {
              initialSelectedAssessmentType = typeObject.type;
            }
          }
        });
        setSelectedDynamicOptions(mappedSelections);
        setSelectedAssessmentType(initialSelectedAssessmentType); // Set the dropdown
      }

      // Submission status (if coming from "pending_approval" for admin to publish)
   if (isAdmin && initialData.status === 'pending_approval') {
  setSubmissionStatus('published'); // ✅ lowercase
} else {
  setSubmissionStatus('pending_approval'); // ✅ lowercase
}

    }
  }, [initialData, cycleTypeOptions, categoryOptions, assessmentTypes, isAdmin]); // Add dependencies

  // --- Fetching Data for Dropdowns ---

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
      if (!selectedAssessmentType) {
        setDynamicOptions([]); // Clear options if no type is selected
        return;
      }

      try {
        // IMPORTANT: Ensure your backend endpoint is correctly designed to return options
        // for a given assessment type name (e.g., "Role", "Department").
        const response = await fetch(
          `https://localhost:7000/api/AssessmentType/${selectedAssessmentType}`
        ); // Example endpoint structure
        if (!response.ok) throw new Error('Failed to fetch options');

        const data = await response.json();
        setDynamicOptions(data); // dynamically store any options
      } catch (error) {
        console.error('Error fetching dynamic options:', error);
      }
    };

    fetchOptionsByType();
  }, [selectedAssessmentType]);

  const fetchReviewers = async () => {
    try {
      const response = await fetch('https://localhost:7000/api/ReviewLevel/reviewers');
      if (!response.ok) throw new Error('Failed to fetch reviewers');
      const data = await response.json();
      setReviewers(data);
    } catch (error) {
      console.error('Error fetching reviewers:', error);
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

  // --- Form Field Handlers ---

  const addReviewLevel = () => {
    if (newLevelName.trim()) {
      const newId = (reviewLevels.length > 0 ? Math.max(...reviewLevels.map((lvl) => lvl.id || 0)) : 0) + 1;
      const newOrder = reviewLevels.length + 1; // Assign next sequential order

      setReviewLevels([
        ...reviewLevels,
        {
          id: newId,
          name: newLevelName,
          deadline: '',
          reviewerId: null,
          reviewOrder: newOrder,
        },
      ]);
      setNewLevelName('');
    }
  };

  const removeReviewLevel = (id: number) => {
    const updated = reviewLevels
      .filter((level) => level.id !== id)
      .map((level, index) => ({ ...level, reviewOrder: index + 1 })); // Reassign order
    setReviewLevels(updated);
  };

  const addAssessmentCategory = () => {
    if (newCategoryName.trim()) {
      // Find the ID of the selected category from categoryOptions
      const selectedCategoryMaster = categoryOptions.find(
        (opt) => opt.name === newCategoryName
      );
      if (!selectedCategoryMaster) {
        alert('Please select a valid category from the dropdown or add a custom one if allowed.');
        return;
      }

      // Check if this category is already added
      const isCategoryAlreadyAdded = assessmentCategories.some(
        (cat) => cat.categoryMasterId === selectedCategoryMaster.id
      );
      if (isCategoryAlreadyAdded) {
        alert(`Category "${newCategoryName}" has already been added.`);
        return;
      }

      setAssessmentCategories([
        ...assessmentCategories,
        {
          id: assessmentCategories.length + 1, // Client-side ID for keying
          name: newCategoryName,
          categoryMasterId: selectedCategoryMaster.id, // Store the actual ID
          questions: [{ id: 1, question: '' }],
        },
      ]);
      setNewCategoryName('');
      setShowCustomCategoryInput(false);
    }
  };

  const removeAssessmentCategory = (id: number) => {
    setAssessmentCategories(assessmentCategories.filter((category) => category.id !== id));
  };

  const addQuestionToCategory = (categoryId: number) => {
    setAssessmentCategories(
      assessmentCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            questions: [
              ...category.questions,
              {
                id:
                  (category.questions.length > 0
                    ? Math.max(...category.questions.map((q) => q.id || 0))
                    : 0) + 1,
                question: '',
              }, // Generate unique ID
            ],
          };
        }
        return category;
      })
    );
  };

  const removeQuestionFromCategory = (categoryId: number, questionId: number) => {
    setAssessmentCategories(
      assessmentCategories.map((category) => {
        if (category.id === categoryId) {
          const filteredQuestions = category.questions.filter(
            (question) => question.id !== questionId
          );
          return {
            ...category,
            questions: filteredQuestions,
          };
        }
        return category;
      })
    );
  };

  const handleQuestionChange = (categoryId: number, questionId: number, value: string) => {
    setAssessmentCategories(
      assessmentCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            questions: category.questions.map((question) =>
              question.id === questionId ? { ...question, question: value } : question
            ),
          };
        }
        return category;
      })
    );
  };

  const handleCategorySelect = (categoryName: string) => {
    setNewCategoryName(categoryName);
    setShowCustomCategoryInput(false); // Hide custom input if selected from existing
    setShowCategoryDropdown(false);
  };

  const handleCycleTypeSelect = (type: { id: number; name: string }) => {
    setCycleType(type);
    setShowCycleTypeDropdown(false);
  };



  // --- Form Submission ---
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
      alert('Please select an assignment type');
      return;
    }

    if (selectedDynamicOptions.length === 0) {
      alert(`Please select at least one ${selectedAssessmentType} for assessment.`);
      return;
    }

    if (selectedRatings.length === 0) {
      alert('Please select at least one rating scale');
      return;
    }

    const hasEmptyReviewLevelFields = reviewLevels.some(
      (level) => !level.name.trim() || !level.deadline || level.reviewerId === null
    );
    if (hasEmptyReviewLevelFields) {
      alert('Please fill in all review level details (Name, Deadline, Reviewer).');
      return;
    }

    const hasEmptyCategoryMasterId = assessmentCategories.some(
      (category) => !category.categoryMasterId
    );
    if (hasEmptyCategoryMasterId) {
      alert('One or more assessment categories do not have a selected Category Master. Please re-select or add categories.');
      return;
    }

    const hasEmptyQuestion = assessmentCategories.some((category) =>
      category.questions.some((q) => !q.question.trim())
    );
    if (hasEmptyQuestion) {
      alert('Please ensure all assessment questions are filled.');
      return;
    }

    const selectedCategoryMasterIds = assessmentCategories.map(cat => cat.categoryMasterId);
    if (new Set(selectedCategoryMasterIds).size !== selectedCategoryMasterIds.length) {
      alert('Duplicate assessment categories are not allowed. Please select unique categories.');
      return;
    }

    const dataToSend = {
      hikeCycleId: initialData?.id || 0, // Include ID if editing, else 0 or omit
      cycleName,
      cycleTypeId: cycleType.id,
      cycleDeadline,
      reviewPeriodStartDate: reviewPeriod.startDate,
      reviewPeriodEndDate: reviewPeriod.endDate,
      description,
      reviewLevels: reviewLevels.map((level) => ({
        name: level.name,
        deadline: level.deadline,
        reviewerId: level.reviewerId,
        reviewOrder: level.reviewOrder,
      })),
      assessmentCategories: assessmentCategories.map((category) => ({
        categoryMasterId: category.categoryMasterId, // Use the stored ID
        questions: category.questions.map((q) => q.question),
      })),
      // This transformation maps selectedDynamicOptions back to assessmentSelections
      // Group by assessment type (e.g., 'Department', 'Role')
      selectedAssessmentTypeOptions: Array.from(
        new Set(selectedDynamicOptions.map((opt) => opt.type))
      ).map((type) => {
        const optionsForType = selectedDynamicOptions.filter((opt) => opt.type === type);
        const assessmentTypeObj = assessmentTypes.find((at) => at.type === type);
        return {
          assessmentTypeId: assessmentTypeObj?.id || 0, // Ensure valid ID
          selectedOptionIds: optionsForType.map((opt) => opt.id),
        };
      }),
      ratings: selectedRatings.map((r) => r.id),
      createdByUserId,
     status: submissionStatus === 'published' ? 'published' : 'pending_approval',
   

 // Set based on button clicked
    };

console.log("➡️ cycleTypeId being sent:", dataToSend.cycleTypeId);

    console.log('🟡 Submitting data to API:', dataToSend);

    const apiUrl = initialData
      ? `https://localhost:7000/api/HikeCycle/${initialData.id}` // PUT for existing
      : 'https://localhost:7000/api/HikeCycle'; // POST for new
    const httpMethod = initialData ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method: httpMethod,
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
          errorMessage = errorData.message || JSON.stringify(errorData); // More detailed error
        } catch (parseErr) {
          console.error('🔴 Failed to parse error response:', parseErr);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Hike Cycle operation successful:', result);
      onPublish(result); // Pass the updated/created HikeCycleForm data
      alert(`Hike Cycle ${initialData ? 'updated' : 'created'} successfully!`);
    } catch (error: any) {
      console.error('❌ Error submitting hike cycle:', error.message);
      alert(`Failed to ${initialData ? 'update' : 'create'} hike cycle: ${error.message}`);
    }
  };


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


  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaUserTie className="mr-2" size={20} />{' '}
        {initialData ? 'Edit Performance Review Cycle' : 'New Performance Review Cycle'}
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
                        setCycleType(type);
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
                        <span className="font-bold">{rating.name}</span> -{' '}
                        <span>{rating.description}</span>{' '}
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

          {/* Sub dropdown based on selectionType */}
          {selectedAssessmentType && (
            <div className="mt-2 relative">
              <label className="block text-sm text-gray-500 mb-1">
                Select {selectedAssessmentType}(s)
              </label>
              <div className="border border-gray-300 rounded p-2 max-h-48 overflow-auto bg-white">
                {currentOptions.length === 0 && (
                  <p className="text-gray-500 text-sm">No options available for this type.</p>
                )}
                {currentOptions.map((option) => {
                  // Check if this option (id and type) is already selected
                  const isSelected = selectedDynamicOptions.some(
                    (opt) => opt.id === option.id && opt.type === selectedAssessmentType
                  );

                  return (
                    <div
                      key={option.id}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        isSelected ? 'text-gray-400 cursor-not-allowed' : ''
                      }`}
                      onClick={() => !isSelected && handleOptionSelect(option.id, option.name)}
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
              {/* Group by type: Department, Role, etc. */}
              {Array.from(new Set(selectedDynamicOptions.map((opt) => opt.type))).map((type) => {
                const optionsOfType = selectedDynamicOptions.filter((opt) => opt.type === type);
                return optionsOfType.length > 0 ? (
                  <div key={type}>
                    <div className="text-sm font-semibold text-gray-600 mb-1">
                      Selected {type}(s):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {optionsOfType.map((option) => (
                        <span
                          key={`${option.type}-${option.id}`} // Unique key
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {option.name}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedDynamicOptions((prev) =>
                                prev.filter(
                                  (opt) => !(opt.id === option.id && opt.type === type)
                                )
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

     {activeFieldTab === 'formFields' ? (<>
          {/* Review Levels */}
          <div>
            <h3 className="font-medium mb-4">Review Levels</h3>
            <div className="space-y-4">
              {reviewLevels.map((level) => (
                <div
                  key={level.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded relative"
                >
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

                  {/* Order (read-only) */}
                  <div className="relative">
                    <label className="block text-sm text-gray-500 mb-1">Order</label>
                    <select
                      className="appearance-none w-full p-2 border border-gray-300 rounded bg-white text-gray-800 pr-8"
                      value={level.reviewOrder}
                      onChange={(e) =>
                        handleLevelChange(level.id!, 'reviewOrder', parseInt(e.target.value, 10))
                      }
                      required
                    >
                      {Array.from({ length: reviewLevels.length }, (_, i) => i + 1).map(
                        (orderNum) => (
                          <option key={orderNum} value={orderNum}>
                            Order {orderNum}
                          </option>
                        )
                      )}
                    </select>

                    {/* Dropdown icon */}
                    <FaChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
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
                      onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        setShowCategoryDropdown(true); // Show dropdown on change
                      }}
                      onFocus={() => setShowCategoryDropdown(true)}
                    />
                    <FaChevronDown
                      className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    />
                  </div>

                  {showCategoryDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                      {categoryOptions
                        .filter(
                          (cat) =>
                            cat.name.toLowerCase().includes(newCategoryName.toLowerCase()) &&
                            !assessmentCategories.some((ac) => ac.categoryMasterId === cat.id)
                        ) // Filter already added
                        .map((category) => (
                          <div
                            key={category.id} // Use category.id for key
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleCategorySelect(category.name);
                              setShowCategoryDropdown(false);
                            }}
                          >
                            {category.name}
                          </div>
                        ))}
                      {/* Option to add custom category if it doesn't exist */}
                      {newCategoryName.trim() &&
                        !categoryOptions.some((cat) => cat.name === newCategoryName) && (
                          <div
                            className="p-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                            onClick={() => {
                              // If you want to allow truly custom categories not in master, handle it here.
                              // Currently, `addAssessmentCategory` relies on `categoryOptions` for ID.
                              // For simplicity, I'll remove the `Others` option and rely on direct input.
                              // If 'Others' is needed, you'd need a separate flow to create a new CategoryMaster in the DB.
                              setNewCategoryName(newCategoryName.trim());
                              setShowCustomCategoryInput(false); // No special custom input needed if we just use the text field
                              setShowCategoryDropdown(false);
                            }}
                          >
                            Add "{newCategoryName}" as new category
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={addAssessmentCategory}
                className="mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 flex items-center"
                disabled={!newCategoryName.trim() || !categoryOptions.some(opt => opt.name === newCategoryName) || assessmentCategories.some(ac => ac.name === newCategoryName)}
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
                        value={category.name} // Display name
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          const selectedMaster = categoryOptions.find(
                            (opt) => opt.name === selectedName
                          );

                          const alreadyUsed = assessmentCategories.some(
                            (c) => c.id !== category.id && c.categoryMasterId === selectedMaster?.id
                          );
                          if (alreadyUsed) {
                            alert('This category is already selected.');
                            return;
                          }
                          setAssessmentCategories(
                            assessmentCategories.map((c) =>
                              c.id === category.id
                                ? { ...c, name: selectedName, categoryMasterId: selectedMaster?.id }
                                : c
                            )
                          );
                        }}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {categoryOptions.map((option) => (
                          <option key={option.id} value={option.name}>
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
          </div></>):(
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

          {/* Buttons */}
         {/* Buttons */}
<div className="flex space-x-4 justify-end">
  {/* Cancel button - Common for all roles accessing this form */}
  <button
    type="button"
    onClick={onCancel}
    className="py-2 px-6 border border-gray-300 rounded hover:bg-gray-100"
  >
    Cancel
  </button>

  {/* HR (non-admin) — Send to Admin */}
  {isHR && !isAdmin && (
    <button
      type="submit"
      onClick={() => setSubmissionStatus('pending_approval')} // Ensure status is set correctly
      className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Send to Admin
    </button>
  )}

  {/* Admin — Publish */}
  {isAdmin && (
    <button
      type="submit"
      onClick={() => setSubmissionStatus('published')}
      className="py-2 px-6 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Publish
    </button>
  )}
</div>

        </div>
      </form>
    </div>
  );
};

export default NewHikeCycleForm;