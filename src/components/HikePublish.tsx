import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HikeForm, HikeFormField, ApprovalLevel, FormStatus, HikeFormFieldType } from '../types/reviewTypes';
import NewHikeCycleForm from '../components/HikeForm'; 

const HikePublish: React.FC<{
  forms: HikeForm[];
  pendingApprovals: HikeForm[];
  onSave: (form: HikeForm) => void;
  onPublish: (form: HikeForm) => void;
  onApprove: (formId: string) => void;
  onReject: (formId: string, reason: string) => void;
}> = ({ forms, pendingApprovals, onSave, onPublish, onApprove, onReject }) => {
  const [activeTab, setActiveTab] = useState<'forms' | 'approvals'>('forms');
  const [activeForm, setActiveForm] = useState<HikeForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFieldType, setNewFieldType] = useState<HikeFormFieldType>('text');
  const [newApprovalLevel, setNewApprovalLevel] = useState<Omit<ApprovalLevel, 'level'>>({
    title: '',
    approvers: [],
    isFinalApproval: false
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [showNewHikeForm, setShowNewHikeForm] = useState(false);

  // Static data for pending approvals
  const staticPendingApprovals: HikeForm[] = [
    {
      id: uuidv4(),
      title: '2023 Annual Performance Review',
      description: 'Form for annual employee performance evaluations',
      fields: [
        { id: uuidv4(), label: 'Cycle Name', type: 'text', required: true },
        { id: uuidv4(), label: 'Cycle Deadline', type: 'Date', required: true, },
        { id: uuidv4(), label: 'Goal Section', type: 'textarea', required: true },
        { id: uuidv4(), label: 'Project Section', type: 'textarea', required: true },
         {id: uuidv4(), label: 'Communication', type: 'number', required: true ,min: 1, max: 5},
         {id: uuidv4(), label: 'Team Work', type: 'number', required: true,min: 1, max: 5 },
         {id: uuidv4(), label: 'Behaviour', type: 'number', required: true ,min: 1, max: 5},
         {id: uuidv4(), label: 'Upload Document', type: 'file', required: true ,min: 1, max: 5},
      ],
      approvalLevels: [
        {
          level: 1,
          title: 'Manager Review',
          approvers: ['John Doe', 'Jane Smith'],
          isFinalApproval: false
        },
        {
          level: 2,
          title: 'Manager Head Review',
          approvers: ['Managing HIgher Officials'],
          isFinalApproval: false
        },
        {
          level: 3,
          title: 'HR Approval',
          approvers: ['HR Department'],
          isFinalApproval: true
        }
      ],
      status: 'pending_approval',
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2023-01-15T10:30:00Z'
    },
    {
      id: uuidv4(),
      title: 'Q3 Promotion Cycle',
      description: 'Form for promotion recommendations and approvals',
      fields: [
        { id: uuidv4(), label: 'Current Position', type: 'text', required: true },
        { id: uuidv4(), label: 'Recommended Position', type: 'text', required: true },
        { id: uuidv4(), label: 'Justification', type: 'textarea', required: true },
        { id: uuidv4(), label: 'Salary Adjustment %', type: 'number', required: false, min: 0, max: 50 }
      ],
      approvalLevels: [
        {
          level: 1,
          title: 'Department Head',
          approvers: ['Department Heads'],
          isFinalApproval: false
        },
        {
          level: 2,
          title: 'Compensation Committee',
          approvers: ['Comp Team'],
          isFinalApproval: false
        },
        {
          level: 3,
          title: 'HR Final Approval',
          approvers: ['HR Director'],
          isFinalApproval: true
        }
      ],
      status: 'pending_approval',
      createdAt: '2023-06-20T14:15:00Z',
      updatedAt: '2023-06-20T14:15:00Z'
    }
  ];

  // Combine props with static data
  const allPendingApprovals = [...staticPendingApprovals, ...pendingApprovals];

  const statusClasses: Record<FormStatus, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    pending_approval: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-gray-100 text-gray-800'
  };

  // Form Management Functions
  const handleCreateNew = () => {
    setShowNewHikeForm(true);
  };

  const handlePublishNewHikeForm = (data: any) => {
    const newForm: HikeForm = {
      id: uuidv4(),
      title: data.cycleName,
      description: data.description,
      fields: data.customOptions.map((option: any) => ({
        id: uuidv4(),
        required: false,
        label: option.value,
        type: 'text' // Default type, can be customized
      })),
      approvalLevels: data.reviewLevels.map((level: any, index: number) => ({
        level: index + 1,
        title: level.name,
        approvers: [level.managerName],
        isFinalApproval: index === data.reviewLevels.length - 1
      })),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setActiveForm(newForm);
    setIsEditing(true);
    setShowNewHikeForm(false);
    onSave(newForm);
  };

  const handleCancelNewHikeForm = () => {
    setShowNewHikeForm(false);
  };

  const handleAddField = () => {
    if (!activeForm) return;
    
    const baseField = {
      id: uuidv4(),
      required: false,
      label: 'New Field',
      type: newFieldType
    };

    let field: HikeFormField;
    switch (newFieldType) {
      case 'text':
        field = { ...baseField };
        break;
      case 'number':
        field = { ...baseField, min: 0, max: 100 };
        break;
      case 'select':
        field = { ...baseField, options: ['Option 1', 'Option 2'] };
        break;
      case 'textarea':
        field = { ...baseField };
        break;
      case 'rating':
        field = { ...baseField, min: 1, max: 5 };
        break;
      default:
        throw new Error(`Invalid field type: ${newFieldType}`);
    }

    setActiveForm({
      ...activeForm,
      fields: [...activeForm.fields, field]
    });
  };

  const handleFieldChange = (fieldId: string, updates: Partial<HikeFormField>) => {
    if (!activeForm) return;
    
    setActiveForm({
      ...activeForm,
      fields: activeForm.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    });
  };

  const handleRemoveField = (fieldId: string) => {
    if (!activeForm) return;
    
    setActiveForm({
      ...activeForm,
      fields: activeForm.fields.filter(field => field.id !== fieldId)
    });
  };

  const handleAddApprovalLevel = () => {
    if (!activeForm) return;
    
    if (!newApprovalLevel.title || newApprovalLevel.approvers.length === 0) {
      alert('Please fill in all required fields for approval level');
      return;
    }
    
    const newLevel: ApprovalLevel = {
      level: activeForm.approvalLevels.length + 1,
      ...newApprovalLevel
    };
    
    setActiveForm({
      ...activeForm,
      approvalLevels: [...activeForm.approvalLevels, newLevel]
    });
    
    setNewApprovalLevel({
      title: '',
      approvers: [],
      isFinalApproval: false
    });
  };

  const handleRemoveApprovalLevel = (level: number) => {
    if (!activeForm) return;
    
    if (activeForm.approvalLevels.length <= 1) {
      alert('You must have at least one approval level');
      return;
    }
    
    const newLevels = activeForm.approvalLevels
      .filter(l => l.level !== level)
      .map((l, idx) => ({ ...l, level: idx + 1 }));
    
    setActiveForm({
      ...activeForm,
      approvalLevels: newLevels
    });
  };

  const handlePublish = () => {
    if (!activeForm) return;
    if (activeForm.fields.length === 0) {
      alert('Please add at least one field to the form');
      return;
    }
    if (activeForm.approvalLevels.length === 0) {
      alert('Please add at least one approval level');
      return;
    }
    onPublish(activeForm);
    setActiveForm(null);
  };

  const handleApproveForm = (formId: string) => {
    // Update the form status to approved
    const approvedForm = allPendingApprovals.find(form => form.id === formId);
    if (approvedForm) {
      const updatedForm = { ...approvedForm, status: 'approved' };
      onApprove(formId);
       // This will make the form available to everyone
    }
    setActiveForm(null);
  };

  const handleRejectForm = (formId: string) => {
    if (!rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    onReject(formId, rejectionReason);
    setActiveForm(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {showNewHikeForm && (
        <NewHikeCycleForm 
          onCancel={handleCancelNewHikeForm} 
          onPublish={handlePublishNewHikeForm} 
        />
      )}

      {!showNewHikeForm && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Hike Form Management</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('approvals')}
                className={`py-2 px-4 rounded ${activeTab === 'approvals' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Form Approvals 
              </button>
              <button
                onClick={handleCreateNew}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Create New Form
              </button>
            </div>
          </div>

          {activeTab === 'forms' ? (
            <>
              {forms.length > 0 && !activeForm && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fields</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Levels</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {forms.map(form => (
                        <tr key={form.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{form.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{form.fields.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{form.approvalLevels.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[form.status]}`}>
                              {form.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            <button
                              onClick={() => {
                                setActiveForm(form);
                                setIsEditing(false);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View
                            </button>
                            {form.status === 'draft' && (
                              <>
                                <button
                                  onClick={() => {
                                    setActiveForm(form);
                                    setIsEditing(true);
                                  }}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (form.fields.length === 0) {
                                      alert('Please add at least one field to the form');
                                      return;
                                    }
                                    if (form.approvalLevels.length === 0) {
                                      alert('Please add at least one approval level');
                                      return;
                                    }
                                    onPublish(form);
                                  }}
                                  className="text-purple-600 hover:text-purple-800"
                                >
                                  Publish
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeForm && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                      {isEditing ? 'Editing: ' : 'Viewing: '} {activeForm.title}
                    </h3>
                    <div className="space-x-2">
                      {isEditing && (
                        <button
                          onClick={() => {
                            onSave(activeForm);
                            setIsEditing(false);
                          }}
                          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      )}
                      {isEditing && activeForm.status === 'draft' && (
                        <button
                          onClick={handlePublish}
                          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                        >
                          Publish for Approval
                        </button>
                      )}
                      <button
                        onClick={() => setActiveForm(null)}
                        className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                      >
                        Back to List
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Form Title*</label>
                        <input
                          type="text"
                          value={activeForm.title}
                          onChange={(e) => setActiveForm({ ...activeForm, title: e.target.value })}
                          className="border rounded px-3 py-2 w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={activeForm.description}
                          onChange={(e) => setActiveForm({ ...activeForm, description: e.target.value })}
                          className="border rounded px-3 py-2 w-full"
                          rows={3}
                        />
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="text-md font-semibold mb-4">Form Fields</h4>
                        
                        <div className="space-y-4 mb-6">
                          {activeForm.fields.map(field => (
                            <div key={field.id} className="border rounded p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Label*</label>
                                  <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => handleFieldChange(field.id, { label: e.target.value })}
                                    className="border rounded px-3 py-2 w-full"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                  <select
                                    value={field.type}
                                    onChange={(e) => handleFieldChange(field.id, { type: e.target.value as HikeFormFieldType })}
                                    className="border rounded px-3 py-2 w-full"
                                  >
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="select">Dropdown</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="rating">Rating</option>
                                  </select>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`required-${field.id}`}
                                    checked={field.required}
                                    onChange={(e) => handleFieldChange(field.id, { required: e.target.checked })}
                                    className="mr-2"
                                  />
                                  <label htmlFor={`required-${field.id}`} className="text-sm font-medium text-gray-700">
                                    Required
                                  </label>
                                </div>
                              </div>

                              {field.type === 'select' && (
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Options* (one per line)</label>
                                  <textarea
                                    value={field.options?.join('\n') || ''}
                                    onChange={(e) => handleFieldChange(field.id, { 
                                      options: e.target.value.split('\n').filter(opt => opt.trim()) 
                                    })}
                                    className="border rounded px-3 py-2 w-full"
                                    rows={3}
                                    required
                                  />
                                </div>
                              )}

                              {(field.type === 'number' || field.type === 'rating') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
                                    <input
                                      type="number"
                                      value={field.min || ''}
                                      onChange={(e) => handleFieldChange(field.id, { min: parseInt(e.target.value) || undefined })}
                                      className="border rounded px-3 py-2 w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
                                    <input
                                      type="number"
                                      value={field.max || ''}
                                      onChange={(e) => handleFieldChange(field.id, { max: parseInt(e.target.value) || undefined })}
                                      className="border rounded px-3 py-2 w-full"
                                    />
                                  </div>
                                </div>
                              )}

                              <button
                                onClick={() => handleRemoveField(field.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove Field
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="border rounded p-4 mb-6 bg-gray-50">
                          <h5 className="text-sm font-semibold mb-3">Add New Field</h5>
                          <div className="flex items-end gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                              <select
                                value={newFieldType}
                                onChange={(e) => setNewFieldType(e.target.value as HikeFormFieldType)}
                                className="border rounded px-3 py-2 w-full"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="select">Dropdown</option>
                                <option value="textarea">Text Area</option>
                                <option value="rating">Rating</option>
                              </select>
                            </div>
                            <button
                              onClick={handleAddField}
                              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                            >
                              Add Field
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="text-md font-semibold mb-4">Approval Levels</h4>
                        
                        <div className="space-y-4 mb-6">
                          {activeForm.approvalLevels.map(level => (
                            <div key={level.level} className="border rounded p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Level {level.level} Title*</label>
                                  <input
                                    type="text"
                                    value={level.title}
                                    onChange={(e) => {
                                      const newLevels = activeForm.approvalLevels.map(l => 
                                        l.level === level.level ? { ...l, title: e.target.value } : l
                                      );
                                      setActiveForm({ ...activeForm, approvalLevels: newLevels });
                                    }}
                                    className="border rounded px-3 py-2 w-full"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Approvers* (one per line)</label>
                                  <textarea
                                    value={level.approvers.join('\n')}
                                    onChange={(e) => {
                                      const newLevels = activeForm.approvalLevels.map(l => 
                                        l.level === level.level ? { 
                                          ...l, 
                                          approvers: e.target.value.split('\n').filter(opt => opt.trim()) 
                                        } : l
                                      );
                                      setActiveForm({ ...activeForm, approvalLevels: newLevels });
                                    }}
                                    className="border rounded px-3 py-2 w-full"
                                    rows={3}
                                    required
                                  />
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`final-approval-${level.level}`}
                                    checked={level.isFinalApproval}
                                    onChange={(e) => {
                                      const newLevels = activeForm.approvalLevels.map(l => 
                                        l.level === level.level ? { ...l, isFinalApproval: e.target.checked } : l
                                      );
                                      setActiveForm({ ...activeForm, approvalLevels: newLevels });
                                    }}
                                    className="mr-2"
                                  />
                                  <label htmlFor={`final-approval-${level.level}`} className="text-sm font-medium text-gray-700">
                                    Final Approval Level
                                  </label>
                                </div>
                              </div>

                              <button
                                onClick={() => handleRemoveApprovalLevel(level.level)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove Level
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="border rounded p-4 bg-gray-50">
                          <h5 className="text-sm font-semibold mb-3">Add Approval Level</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                              <input
                                type="text"
                                value={newApprovalLevel.title}
                                onChange={(e) => setNewApprovalLevel({ ...newApprovalLevel, title: e.target.value })}
                                className="border rounded px-3 py-2 w-full"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Approvers* (one per line)</label>
                              <textarea
                                value={newApprovalLevel.approvers.join('\n')}
                                onChange={(e) => setNewApprovalLevel({ 
                                  ...newApprovalLevel, 
                                  approvers: e.target.value.split('\n').filter(opt => opt.trim()) 
                                })}
                                className="border rounded px-3 py-2 w-full"
                                rows={3}
                                required
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="new-final-approval"
                                checked={newApprovalLevel.isFinalApproval}
                                onChange={(e) => setNewApprovalLevel({ ...newApprovalLevel, isFinalApproval: e.target.checked })}
                                className="mr-2"
                              />
                              <label htmlFor="new-final-approval" className="text-sm font-medium text-gray-700">
                                Final Approval Level
                              </label>
                            </div>
                          </div>
                          <button
                            onClick={handleAddApprovalLevel}
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                          >
                            Add Approval Level
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-semibold mb-2">Description</h4>
                        <p className="text-gray-700 whitespace-pre-line">
                          {activeForm.description || 'No description provided'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold mb-3">Form Fields ({activeForm.fields.length})</h4>
                        <div className="space-y-3">
                          {activeForm.fields.length > 0 ? (
                            activeForm.fields.map((field, index) => (
                              <div key={field.id} className="border rounded p-4">
                                <div className="font-medium">
                                  {index + 1}. {field.label}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                </div>
                                <div className="text-sm text-gray-500 capitalize mt-1">
                                  Type: {field.type}
                                  {field.type === 'select' && (
                                    <div className="mt-1">
                                      Options: {field.options?.join(', ')}
                                    </div>
                                  )}
                                  {(field.type === 'number' || field.type === 'rating') && (
                                    <div className="mt-1">
                                      Range: {field.min || '0'} to {field.max || '100'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No fields defined</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold mb-3">Approval Workflow ({activeForm.approvalLevels.length} levels)</h4>
                        <div className="space-y-3">
                          {activeForm.approvalLevels.length > 0 ? (
                            activeForm.approvalLevels.map(level => (
                              <div key={level.level} className="border rounded p-4">
                                <div className="flex justify-between">
                                  <div>
                                    <span className="font-medium">Level {level.level}: {level.title}</span>
                                    {level.isFinalApproval && (
                                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        Final Approval
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <div className="text-sm text-gray-600">
                                    <div className="font-medium">Approvers:</div>
                                    <ul className="list-disc list-inside">
                                      {level.approvers.map((approver, i) => (
                                        <li key={i}>{approver}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No approval levels defined</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {allPendingApprovals.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fields</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allPendingApprovals.map(form => (
                        <tr key={form.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{form.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{form.fields.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(form.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[form.status]}`}>
                              {form.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            <button
                              onClick={() => {
                                setActiveForm(form);
                                setIsEditing(false);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No forms pending approval</p>
                </div>
              )}

              {activeForm && activeTab === 'approvals' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Review Form: {activeForm.title}</h3>
                    <button
                      onClick={() => setActiveForm(null)}
                      className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-semibold mb-2">Description</h4>
                      <p className="text-gray-700">{activeForm.description || 'No description provided'}</p>
                    </div>

                    <div>
                      <h4 className="text-md font-semibold mb-3">Form Fields</h4>
                      <div className="space-y-3">
                        {activeForm.fields.map(field => (
                          <div key={field.id} className="border rounded p-4">
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-gray-500 capitalize">
                              {field.type} {field.required && '(required)'}
                            </div>
                            {field.type === 'select' && (
                              <div className="mt-2 text-sm">
                                Options: {field.options?.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-semibold mb-3">Approval Workflow</h4>
                      <div className="space-y-3">
                        {activeForm.approvalLevels.map(level => (
                          <div key={level.level} className="border rounded p-3">
                            <div className="flex justify-between">
                              <div>
                                <span className="font-medium">Level {level.level}: {level.title}</span>
                                {level.isFinalApproval && (
                                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Final Approval
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              Approvers: {level.approvers.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="text-md font-semibold mb-4">Approval Decision</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Feedback (Required for rejection)
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                            rows={3}
                            placeholder="Provide feedback or reason for rejection..."
                          />
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => handleRejectForm(activeForm.id)}
                            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveForm(activeForm.id)}
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                          >
                            Approve & Publish
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HikePublish;