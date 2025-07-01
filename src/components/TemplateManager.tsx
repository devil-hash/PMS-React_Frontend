// components/TemplateManager.tsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaChevronDown } from 'react-icons/fa';

interface Template {
  id: string;
  name: string;
  type: 'cycle' | 'review-level' | 'category' | 'rating-scale';
  options: string[];
}

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState<'cycle' | 'review-level' | 'category' | 'rating-scale'>('cycle');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newOption, setNewOption] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showOptionInput, setShowOptionInput] = useState(false);

  // Load templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('performanceTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      // Initialize with default templates
      const defaultTemplates: Template[] = [
        {
          id: '1',
          name: 'Cycle Types',
          type: 'cycle',
          options: ['Annual', 'Quarterly', 'Mid-term', 'Promotion']
        },
        {
          id: '2',
          name: 'Review Levels',
          type: 'review-level',
          options: ['Self Assessment', 'Manager Review', 'HR Approval', 'Final Approval']
        },
        {
          id: '3',
          name: 'Assessment Categories',
          type: 'category',
          options: ['Technical Skills', 'Communication', 'Leadership', 'Teamwork']
        },
        {
          id: '4',
          name: 'Rating Scales',
          type: 'rating-scale',
          options: ['1-5', '1-10', 'Poor-Excellent', 'Needs Improvement-Exceeds Expectations']
        }
      ];
      setTemplates(defaultTemplates);
      localStorage.setItem('performanceTemplates', JSON.stringify(defaultTemplates));
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('performanceTemplates', JSON.stringify(templates));
  }, [templates]);

  const filteredTemplates = templates.filter(t => t.type === activeTab);

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      type: activeTab,
      options: []
    };
    
    setTemplates([...templates, newTemplate]);
    setNewTemplateName('');
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    if (editingTemplate?.id === id) {
      setEditingTemplate(null);
    }
  };

  const handleAddOption = () => {
    if (!newOption.trim() || !editingTemplate) return;
    
    const updatedTemplate = {
      ...editingTemplate,
      options: [...editingTemplate.options, newOption]
    };
    
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    setEditingTemplate(updatedTemplate);
    setNewOption('');
    setShowOptionInput(false);
  };

  const handleDeleteOption = (option: string) => {
    if (!editingTemplate) return;
    
    const updatedTemplate = {
      ...editingTemplate,
      options: editingTemplate.options.filter(o => o !== option)
    };
    
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    setEditingTemplate(updatedTemplate);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setNewOption('');
    setShowOptionInput(false);
  };

  const getTemplateTitle = () => {
    switch (activeTab) {
      case 'cycle': return 'Cycle Types';
      case 'review-level': return 'Review Levels';
      case 'category': return 'Assessment Categories';
      case 'rating-scale': return 'Rating Scales';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Performance Review Templates</h2>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'cycle' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('cycle')}
        >
          Cycle Types
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'review-level' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('review-level')}
        >
          Review Levels
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'category' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('category')}
        >
          Categories
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'rating-scale' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('rating-scale')}
        >
          Rating Scales
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="font-medium mb-4">{getTemplateTitle()}</h3>
          
          <div className="space-y-4">
            {filteredTemplates.map(template => (
              <div 
                key={template.id} 
                className={`p-3 border rounded cursor-pointer flex justify-between items-center ${
                  editingTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleEditTemplate(template)}
              >
                <span>{template.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(template.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder={`New ${getTemplateTitle()} name`}
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTemplate()}
              />
              <button
                onClick={handleAddTemplate}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                disabled={!newTemplateName.trim()}
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {editingTemplate ? (
            <div className="border border-gray-200 rounded p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{editingTemplate.name}</h3>
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              
              <div className="space-y-3 mb-4">
                {editingTemplate.options.map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{option}</span>
                    <button
                      onClick={() => handleDeleteOption(option)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
              
              {showOptionInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder={`Add new ${editingTemplate.name} option`}
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                  />
                  <button
                    onClick={handleAddOption}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    disabled={!newOption.trim()}
                  >
                    <FaPlus size={12} />
                  </button>
                  <button
                    onClick={() => setShowOptionInput(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowOptionInput(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaPlus className="mr-1" size={12} /> Add Option
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded border border-dashed border-gray-300">
              <p className="text-gray-500">Select a template to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;