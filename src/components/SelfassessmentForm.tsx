import React, { useState, useRef } from 'react';
import { EmployeeHikeCycle, SelfAssessment, SelfAssessmentGoal, SelfAssessmentProject, SelfAssessmentSkill } from '../types/reviewTypes';

interface SelfAssessmentFormProps {
  cycle: EmployeeHikeCycle;
  onSubmit: (assessment: SelfAssessment) => void;
  onCancel: () => void;
  managerOptions: string[];
}

// Static rating categories defined by admin/HR with additional questions for each category
const staticRatingCategories = [
  {
    name: "Quality of Work",
    description: "Accuracy, thoroughness, and effectiveness of work output",
    questions: [
      "How do you ensure the quality of your work?",
      "Describe a time when you identified and fixed a quality issue in your work",
      "What metrics or indicators do you use to measure your work quality?"
    ]
  },
  {
    name: "Productivity",
    description: "Quantity and efficiency of work completed",
    questions: [
      "What techniques do you use to maintain or improve your productivity?",
      "Describe a time when you completed a task more efficiently than expected",
      "How do you prioritize your work to maximize productivity?"
    ]
  },
  {
    name: "Technical Skills",
    description: "Proficiency in job-related technical skills",
    questions: [
      "What new technical skills have you learned this cycle? Why did you choose to learn them?",
      "How have you applied your technical skills to solve a complex problem?",
      "What technical skill do you plan to improve next and why?"
    ]
  },
  {
    name: "Communication",
    description: "Effectiveness in verbal and written communication",
    questions: [
      "Describe a situation where your communication skills made a difference in a project",
      "How do you adapt your communication style for different audiences?",
      "What feedback have you received about your communication skills and how have you worked on it?"
    ]
  },
  {
    name: "Teamwork",
    description: "Collaboration and cooperation with team members",
    questions: [
      "Describe your role in a successful team project",
      "How do you handle conflicts within a team?",
      "What do you do to foster collaboration among team members?"
    ]
  },
  {
    name: "Problem Solving",
    description: "Ability to analyze and solve problems effectively",
    questions: [
      "Describe a complex problem you solved and your approach to solving it",
      "How do you approach problems you've never encountered before?",
      "What problem-solving frameworks or methodologies do you find most effective?"
    ]
  },
  {
    name: "Initiative",
    description: "Proactiveness and willingness to take on responsibilities",
    questions: [
      "Describe a time when you took initiative beyond your regular responsibilities",
      "How do you identify opportunities to contribute beyond your assigned tasks?",
      "What self-driven projects or improvements have you implemented?"
    ]
  },
  {
    name: "Adaptability",
    description: "Flexibility in handling change and new challenges",
    questions: [
      "Describe a significant change you adapted to and how you handled it",
      "How do you approach learning new technologies or processes?",
      "What strategies do you use to remain productive during times of change?"
    ]
  }
];

const ratingGuide = [
  { value: 1, label: "1 - Needs Improvement", description: "Performance consistently below expectations" },
  { value: 2, label: "2 - Developing", description: "Performance occasionally meets expectations but needs improvement" },
  { value: 3, label: "3 - Meets Expectations", description: "Performance consistently meets job requirements" },
  { value: 4, label: "4 - Exceeds Expectations", description: "Performance consistently exceeds job requirements" },
  { value: 5, label: "5 - Outstanding", description: "Performance is exceptional and serves as a model for others" }
];

const SelfAssessmentForm: React.FC<SelfAssessmentFormProps> = ({ 
  cycle, 
  onSubmit, 
  onCancel,
  managerOptions 
}) => {
  const [assessment, setAssessment] = useState<SelfAssessment>(() => {
    const defaultManager = managerOptions[0] || '';
    return cycle.selfAssessment || {
      goals: [{
        title: '',
        description: '',
        achievement: '',
        rating: 0,
        manager: defaultManager,
        documents: []
      } as SelfAssessmentGoal],
      projects: [{
        name: '',
        description: '',
        impact: '',
        role: '',
        rating: 0,
        manager: defaultManager,
        documents: []
      } as SelfAssessmentProject],
      // Initialize skills with all static rating categories and their questions
      skills: staticRatingCategories.map(category => ({
  name: category.name,
  level: '',       // Add default value
  improvement: '', // Add default value
  rating: 0,       // Additional property - will need to update interface
  manager: defaultManager, // Additional property
  documents: [],   // Additional property
  questionAnswers: category.questions.map(question => ({
    question,
    answer: ''
  }))             // Additional property
} as unknown as SelfAssessmentSkill))
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingGuide, setShowRatingGuide] = useState(false);
  const [activeRatingField, setActiveRatingField] = useState<{type: 'goal' | 'project' | 'skill', index: number} | null>(null);
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    assessment.goals.forEach((goal, index) => {
      if (!goal.title.trim()) {
        errors[`goal-${index}-title`] = 'Title is required';
      }
      if (!goal.description.trim()) {
        errors[`goal-${index}-description`] = 'Description is required';
      }
      if (!goal.achievement.trim()) {
        errors[`goal-${index}-achievement`] = 'Achievement is required';
      }
      if (goal.rating < 1 || goal.rating > 5) {
        errors[`goal-${index}-rating`] = 'Valid rating (1-5) is required';
      }
      if (!goal.manager) {
        errors[`goal-${index}-manager`] = 'Manager is required';
      }
    });

    assessment.projects.forEach((project, index) => {
      if (!project.name.trim()) {
        errors[`project-${index}-name`] = 'Project name is required';
      }
      if (!project.description.trim()) {
        errors[`project-${index}-description`] = 'Description is required';
      }
      if (!project.impact.trim()) {
        errors[`project-${index}-impact`] = 'Impact is required';
      }
      if (!project.role.trim()) {
        errors[`project-${index}-role`] = 'Role is required';
      }
      if (project.rating < 1 || project.rating > 5) {
        errors[`project-${index}-rating`] = 'Valid rating (1-5) is required';
      }
      if (!project.manager) {
        errors[`project-${index}-manager`] = 'Manager is required';
      }
    });

    assessment.skills.forEach((skill, index) => {
      if (!skill.category.trim()) {
        errors[`skill-${index}-category`] = 'Category is required';
      }
      if (!skill.description.trim()) {
        errors[`skill-${index}-description`] = 'Description is required';
      }
      if (skill.rating < 1 || skill.rating > 5) {
        errors[`skill-${index}-rating`] = 'Valid rating (1-5) is required';
      }
      if (!skill.manager) {
        errors[`skill-${index}-manager`] = 'Manager is required';
      }
      // Validate question answers
      skill.questionAnswers.forEach((qa, qIndex) => {
        if (!qa.answer.trim()) {
          errors[`skill-${index}-question-${qIndex}`] = 'Answer is required';
        }
      });
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoalChange = (index: number, field: keyof SelfAssessmentGoal, value: string | number | File[]) => {
    const updatedGoals = [...assessment.goals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setAssessment({ ...assessment, goals: updatedGoals });
    
    if (formErrors[`goal-${index}-${field}`]) {
      const newErrors = { ...formErrors };
      delete newErrors[`goal-${index}-${field}`];
      setFormErrors(newErrors);
    }
  };

  const handleProjectChange = (index: number, field: keyof SelfAssessmentProject, value: string | number | File[]) => {
    const updatedProjects = [...assessment.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setAssessment({ ...assessment, projects: updatedProjects });
    
    if (formErrors[`project-${index}-${field}`]) {
      const newErrors = { ...formErrors };
      delete newErrors[`project-${index}-${field}`];
      setFormErrors(newErrors);
    }
  };

  const handleSkillChange = (index: number, field: keyof SelfAssessmentSkill, value: any) => {
    const updatedSkills = [...assessment.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setAssessment({ ...assessment, skills: updatedSkills });
    
    if (formErrors[`skill-${index}-${field}`]) {
      const newErrors = { ...formErrors };
      delete newErrors[`skill-${index}-${field}`];
      setFormErrors(newErrors);
    }
  };

  const handleQuestionAnswerChange = (skillIndex: number, questionIndex: number, answer: string) => {
    const updatedSkills = [...assessment.skills];
    updatedSkills[skillIndex].questionAnswers[questionIndex].answer = answer;
    setAssessment({ ...assessment, skills: updatedSkills });
    
    if (formErrors[`skill-${skillIndex}-question-${questionIndex}`]) {
      const newErrors = { ...formErrors };
      delete newErrors[`skill-${skillIndex}-question-${questionIndex}`];
      setFormErrors(newErrors);
    }
  };

  const handleRatingChange = (type: 'goal' | 'project' | 'skill', index: number, value: number) => {
    if (value < 0) value = 0;
    if (value > 5) value = 5;
    
    if (type === 'goal') {
      handleGoalChange(index, 'rating', value);
    } else if (type === 'project') {
      handleProjectChange(index, 'rating', value);
    } else {
      handleSkillChange(index, 'rating', value);
    }
  };

  const toggleRatingGuide = (type: 'goal' | 'project' | 'skill', index: number) => {
    setActiveRatingField({ type, index });
    setShowRatingGuide(!showRatingGuide || 
      (activeRatingField?.type !== type || activeRatingField?.index !== index));
  };

  const selectRating = (value: number) => {
    if (activeRatingField) {
      handleRatingChange(activeRatingField.type, activeRatingField.index, value);
      setShowRatingGuide(false);
    }
  };

  const handleDocumentUpload = (
    type: 'goal' | 'project' | 'skill',
    index: number,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    if (type === 'goal') {
      handleGoalChange(index, 'documents', [
        ...assessment.goals[index].documents,
        ...fileArray
      ]);
    } else if (type === 'project') {
      handleProjectChange(index, 'documents', [
        ...assessment.projects[index].documents,
        ...fileArray
      ]);
    } else {
      handleSkillChange(index, 'documents', [
        ...assessment.skills[index].documents,
        ...fileArray
      ]);
    }
  };

  const removeDocument = (
    type: 'goal' | 'project' | 'skill',
    index: number,
    docIndex: number
  ) => {
    if (type === 'goal') {
      const updatedDocs = [...assessment.goals[index].documents];
      updatedDocs.splice(docIndex, 1);
      handleGoalChange(index, 'documents', updatedDocs);
    } else if (type === 'project') {
      const updatedDocs = [...assessment.projects[index].documents];
      updatedDocs.splice(docIndex, 1);
      handleProjectChange(index, 'documents', updatedDocs);
    } else {
      const updatedDocs = [...assessment.skills[index].documents];
      updatedDocs.splice(docIndex, 1);
      handleSkillChange(index, 'documents', updatedDocs);
    }
  };

  const triggerFileInput = (type: 'goal' | 'project' | 'skill', index: number) => {
    const key = `${type}-${index}`;
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key]?.click();
    }
  };

  const addGoal = () => {
    setAssessment({
      ...assessment,
      goals: [
        ...assessment.goals,
        {
          title: '',
          description: '',
          achievement: '',
          rating: 0,
          manager: managerOptions[0] || '',
          documents: []
        }
      ]
    });
  };

  const removeGoal = (index: number) => {
    if (assessment.goals.length > 1) {
      const updatedGoals = [...assessment.goals];
      updatedGoals.splice(index, 1);
      setAssessment({ ...assessment, goals: updatedGoals });
      
      const newErrors = { ...formErrors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`goal-${index}`)) {
          delete newErrors[key];
        }
      });
      setFormErrors(newErrors);
    }
  };

  const addProject = () => {
    setAssessment({
      ...assessment,
      projects: [
        ...assessment.projects,
        {
          name: '',
          description: '',
          impact: '',
          role: '',
          rating: 0,
          manager: managerOptions[0] || '',
          documents: []
        }
      ]
    });
  };

  const removeProject = (index: number) => {
    const updatedProjects = [...assessment.projects];
    updatedProjects.splice(index, 1);
    setAssessment({ ...assessment, projects: updatedProjects });
    
    const newErrors = { ...formErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`project-${index}`)) {
        delete newErrors[key];
      }
    });
    setFormErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...assessment,
        submittedDate: new Date().toISOString()
      });
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (fieldPrefix: string, index: number, field: string) => {
    return formErrors[`${fieldPrefix}-${index}-${field}`] || null;
  };

  const renderDocumentSection = (type: 'goal' | 'project' | 'skill', index: number, documents: File[]) => (
    <div className="mt-4">
      <label className="block text-sm text-gray-600 mb-2">Supporting Documents</label>
      <div className="space-y-2">
        {documents.map((doc, docIndex) => (
          <div key={docIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <div className="flex items-center truncate">
              <span className="text-blue-600 mr-2">📄</span>
              <span className="truncate">{doc.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({(doc.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeDocument(type, index, docIndex)}
              className="text-red-500 hover:text-red-700 ml-2"
              aria-label="Remove document"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        ref={el => fileInputRefs.current[`${type}-${index}`] = el}
        onChange={(e) => handleDocumentUpload(type, index, e.target.files)}
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
      />
      <button
        type="button"
        onClick={() => triggerFileInput(type, index)}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
      >
        <span className="mr-1">+</span> Add Documents (PDF, Word, Excel, Images)
      </button>
    </div>
  );

  const renderRatingInput = (type: 'goal' | 'project' | 'skill', index: number, currentRating: number) => (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          className={`w-20 p-2 border rounded ${getError(type, index, 'rating') ? 'border-red-500' : ''}`}
          value={currentRating || ''}
          onChange={(e) => handleRatingChange(
            type, 
            index, 
            e.target.value === '' ? 0 : parseFloat(e.target.value)
          )}
          required
        />
        <button
          type="button"
          onClick={() => toggleRatingGuide(type, index)}
          className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          View Rating Guide
        </button>
      </div>
      {showRatingGuide && activeRatingField?.type === type && activeRatingField?.index === index && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg p-4">
          <h4 className="font-medium mb-2">Rating Guide</h4>
          <ul className="space-y-2 text-sm">
            {ratingGuide.map(item => (
              <li 
                key={item.value} 
                className={`p-2 rounded cursor-pointer ${currentRating === item.value ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => selectRating(item.value)}
              >
                <div className="font-medium">{item.label}</div>
                <div className="text-gray-600">{item.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {getError(type, index, 'rating') && (
        <p className="text-red-500 text-xs mt-1">{getError(type, index, 'rating')}</p>
      )}
    </div>
  );

  const renderSkillQuestions = (skillIndex: number, questions: {question: string, answer: string}[]) => {
    return (
      <div className="mt-4 space-y-4">
        <h6 className="font-medium text-sm">Category-Specific Questions:</h6>
        {questions.map((qa, qIndex) => (
          <div key={qIndex} className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">{qa.question}*</label>
            <textarea
              className={`w-full p-2 border rounded ${getError('skill', skillIndex, `question-${qIndex}`) ? 'border-red-500' : ''}`}
              rows={3}
              value={qa.answer}
              onChange={(e) => handleQuestionAnswerChange(skillIndex, qIndex, e.target.value)}
              required
            />
            {getError('skill', skillIndex, `question-${qIndex}`) && (
              <p className="text-red-500 text-xs mt-1">{getError('skill', skillIndex, `question-${qIndex}`)}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4">
        {cycle.name} - Self Assessment
        <span className="ml-2 text-sm font-normal text-yellow-600">
          Due: {cycle.dueDate}
        </span>
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Goals & Achievements</h4>
            <button
              type="button"
              onClick={addGoal}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <span className="text-xl mr-1">+</span> Add Goal
            </button>
          </div>
          
          {assessment.goals.map((goal, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg relative">
              {assessment.goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label="Remove goal"
                >
                  ×
                </button>
              )}
              
              <h5 className="font-medium mb-2">Goal #{index + 1}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Title*</label>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded ${getError('goal', index, 'title') ? 'border-red-500' : ''}`}
                    value={goal.title}
                    onChange={(e) => handleGoalChange(index, 'title', e.target.value)}
                    required
                  />
                  {getError('goal', index, 'title') && (
                    <p className="text-red-500 text-xs mt-1">{getError('goal', index, 'title')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Rating (1-5)*</label>
                  {renderRatingInput('goal', index, goal.rating)}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Description*</label>
                <textarea
                  className={`w-full p-2 border rounded ${getError('goal', index, 'description') ? 'border-red-500' : ''}`}
                  rows={3}
                  value={goal.description}
                  onChange={(e) => handleGoalChange(index, 'description', e.target.value)}
                  required
                />
                {getError('goal', index, 'description') && (
                  <p className="text-red-500 text-xs mt-1">{getError('goal', index, 'description')}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Achievement & Impact*</label>
                <textarea
                  className={`w-full p-2 border rounded ${getError('goal', index, 'achievement') ? 'border-red-500' : ''}`}
                  rows={3}
                  value={goal.achievement}
                  onChange={(e) => handleGoalChange(index, 'achievement', e.target.value)}
                  required
                />
                {getError('goal', index, 'achievement') && (
                  <p className="text-red-500 text-xs mt-1">{getError('goal', index, 'achievement')}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Responsible Manager*</label>
                <select
                  className={`w-full p-2 border rounded ${getError('goal', index, 'manager') ? 'border-red-500' : ''}`}
                  value={goal.manager}
                  onChange={(e) => handleGoalChange(index, 'manager', e.target.value)}
                  required
                >
                  <option value="">Select manager</option>
                  {managerOptions.map(manager => (
                    <option key={manager} value={manager}>{manager}</option>
                  ))}
                </select>
                {getError('goal', index, 'manager') && (
                  <p className="text-red-500 text-xs mt-1">{getError('goal', index, 'manager')}</p>
                )}
              </div>

              {/* Document Upload for Goal */}
              {renderDocumentSection('goal', index, goal.documents)}
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Projects & Contributions</h4>
            <button
              type="button"
              onClick={addProject}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <span className="text-xl mr-1">+</span> Add Project
            </button>
          </div>
          
          {assessment.projects.map((project, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg relative">
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                aria-label="Remove project"
              >
                ×
              </button>
              
              <h5 className="font-medium mb-2">Project #{index + 1}</h5>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Project Name*</label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded ${getError('project', index, 'name') ? 'border-red-500' : ''}`}
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                  required
                />
                {getError('project', index, 'name') && (
                  <p className="text-red-500 text-xs mt-1">{getError('project', index, 'name')}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Description*</label>
                <textarea
                  className={`w-full p-2 border rounded ${getError('project', index, 'description') ? 'border-red-500' : ''}`}
                  rows={3}
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  required
                />
                {getError('project', index, 'description') && (
                  <p className="text-red-500 text-xs mt-1">{getError('project', index, 'description')}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Your Impact*</label>
                <textarea
                  className={`w-full p-2 border rounded ${getError('project', index, 'impact') ? 'border-red-500' : ''}`}
                  rows={3}
                  value={project.impact}
                  onChange={(e) => handleProjectChange(index, 'impact', e.target.value)}
                  required
                />
                {getError('project', index, 'impact') && (
                  <p className="text-red-500 text-xs mt-1">{getError('project', index, 'impact')}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Your Role*</label>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded ${getError('project', index, 'role') ? 'border-red-500' : ''}`}
                    value={project.role}
                    onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                    required
                  />
                  {getError('project', index, 'role') && (
                    <p className="text-red-500 text-xs mt-1">{getError('project', index, 'role')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Rating (1-5)*</label>
                  {renderRatingInput('project', index, project.rating)}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">Responsible Manager*</label>
                <select
                  className={`w-full p-2 border rounded ${getError('project', index, 'manager') ? 'border-red-500' : ''}`}
                  value={project.manager}
                  onChange={(e) => handleProjectChange(index, 'manager', e.target.value)}
                  required
                >
                  <option value="">Select manager</option>
                  {managerOptions.map(manager => (
                    <option key={manager} value={manager}>{manager}</option>
                  ))}
                </select>
                {getError('project', index, 'manager') && (
                  <p className="text-red-500 text-xs mt-1">{getError('project', index, 'manager')}</p>
                )}
              </div>

              {/* Document Upload for Project */}
              {renderDocumentSection('project', index, project.documents)}
            </div>
          ))}
        </div>

        {/* Skills Section - Now with static categories and questions */}
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-4">Skills & Competencies</h4>
          <div className="text-sm text-gray-600 mb-4">
            Please rate yourself on each of the following predefined skill categories and answer the related questions:
          </div>
          
          {assessment.skills.map((skill, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg">
              <h5 className="font-medium mb-2">{skill.category}</h5>
              <div className="text-sm text-gray-600 mb-3">{skill.description}</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Rating (1-5)*</label>
                  {renderRatingInput('skill', index, skill.rating)}
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Examples of Application</label>
                <textarea
                  className={`w-full p-2 border rounded ${getError('skill', index, 'examples') ? 'border-red-500' : ''}`}
                  rows={3}
                  value={skill.examples}
                  onChange={(e) => handleSkillChange(index, 'examples', e.target.value)}
                  placeholder="Provide specific examples of how you demonstrated this skill"
                />
                {getError('skill', index, 'examples') && (
                  <p className="text-red-500 text-xs mt-1">{getError('skill', index, 'examples')}</p>
                )}
              </div>

              {/* Category-specific questions */}
              {renderSkillQuestions(index, skill.questionAnswers)}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin mr-2">↻</span>
                Submitting...
              </>
            ) : 'Submit Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelfAssessmentForm;