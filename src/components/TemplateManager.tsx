import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

interface Template {
  id: string;
  name: string;
  type: 'cycle' | 'category' | 'rating-scale';
  options: string[];
  description?: string;
  number?: number;
}

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState<'cycle' | 'category' | 'rating-scale'>('cycle');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [ratingDescription, setRatingDescription] = useState('');
  const [ratingNumber, setRatingNumber] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = '';
        let type: Template['type'];

        if (activeTab === 'cycle') {
          url = 'https://localhost:7000/api/CycleType';
          type = 'cycle';
        } else if (activeTab === 'category') {
          url = 'https://localhost:7000/api/CategoryMaster';
          type = 'category';
        } else {
          url = 'https://localhost:7000/api/Rating';
          type = 'rating-scale';
        }

        const res = await fetch(url);
        const data = await res.json();

        const templatesFromApi = data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          type,
          options: [],
          description: item.description,
          number: item.number
        }));

        setTemplates((prev) => {
          const filtered = prev.filter((t) => t.type !== type);
          return [...filtered, ...templatesFromApi];
        });
      } catch (err) {
        console.error('Failed to fetch templates', err);
      }
    };

    fetchData();
  }, [activeTab]);

  const filteredTemplates = templates.filter((t) => t.type === activeTab);

  const handleSubmit = async () => {
    if (!newTemplateName.trim()) return;

    const isEdit = Boolean(editingId);
    let url = '';
    let method = isEdit ? 'PUT' : 'POST';
    let body: any = {};

    if (activeTab === 'cycle') {
      url = isEdit
        ? `https://localhost:7000/api/CycleType/${editingId}`
        : 'https://localhost:7000/api/CycleType';
      body = isEdit ? { id: editingId, name: newTemplateName } : { name: newTemplateName };
    } else if (activeTab === 'category') {
      url = isEdit
        ? `https://localhost:7000/api/CategoryMaster/${editingId}`
        : 'https://localhost:7000/api/CategoryMaster';
      body = isEdit ? { id: editingId, name: newTemplateName } : { name: newTemplateName };
    } else if (activeTab === 'rating-scale') {
      if (!ratingDescription.trim() || !ratingNumber.trim()) return;
      url = isEdit
        ? `https://localhost:7000/api/Rating/${editingId}`
        : 'https://localhost:7000/api/Rating';

      body = isEdit
        ? {
            id: editingId,
            name: newTemplateName,
            description: ratingDescription,
            number: parseInt(ratingNumber, 10)
          }
        : {
            name: newTemplateName,
            description: ratingDescription,
            number: parseInt(ratingNumber, 10)
          };
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save template');
      }

      const saved = await response.json();

      if (isEdit) {
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? { ...t, name: saved.name, description: saved.description, number: saved.number }
              : t
          )
        );
      } else {
        const newTemplate: Template = {
          id: saved.id.toString(),
          name: saved.name,
          type: activeTab,
          options: [],
          description: saved.description,
          number: saved.number
        };
        setTemplates([...templates, newTemplate]);
      }

      // Clear form state
      setNewTemplateName('');
      setRatingDescription('');
      setRatingNumber('');
      setEditingId(null);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    const templateToDelete = templates.find((t) => t.id === id);
    if (!templateToDelete) return;

    let url = '';
    if (templateToDelete.type === 'cycle') {
      url = `https://localhost:7000/api/CycleType/${id}`;
    } else if (templateToDelete.type === 'category') {
      url = `https://localhost:7000/api/CategoryMaster/${id}`;
    } else {
      url = `https://localhost:7000/api/Rating/${id}`;
    }

    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleEdit = (template: Template) => {
    setEditingId(template.id);
    setNewTemplateName(template.name);
    setRatingDescription(template.description || '');
    setRatingNumber(template.number?.toString() || '');
  };

  const getTemplateTitle = () => {
    switch (activeTab) {
      case 'cycle': return 'Cycle Types';
      case 'category': return 'Assessment Categories';
      case 'rating-scale': return 'Rating Scales';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Performance Review Templates</h2>

      <div className="flex border-b mb-6">
        <button className={`px-4 py-2 font-medium ${activeTab === 'cycle' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('cycle')}>Cycle Types</button>
        <button className={`px-4 py-2 font-medium ${activeTab === 'category' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('category')}>Categories</button>
        <button className={`px-4 py-2 font-medium ${activeTab === 'rating-scale' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('rating-scale')}>Rating Scales</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="font-medium mb-4">{editingId ? 'Edit' : 'Add'} {getTemplateTitle()}</h3>

          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
          />

          {activeTab === 'rating-scale' && (
            <>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Description"
                value={ratingDescription}
                onChange={(e) => setRatingDescription(e.target.value)}
              />
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Number"
                value={ratingNumber}
                onChange={(e) => setRatingNumber(e.target.value)}
              />
            </>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              disabled={!newTemplateName.trim() || (activeTab === 'rating-scale' && (!ratingDescription.trim() || !ratingNumber.trim()))}
            >
              {editingId ? 'Update' : (
                <><FaPlus className="inline mr-1" /> Add</>
              )}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setNewTemplateName('');
                  setRatingDescription('');
                  setRatingNumber('');
                }}
                className="w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Saved {getTemplateTitle()}</h3>

          {filteredTemplates.length === 0 ? (
            <p className="text-gray-500">No templates found.</p>
          ) : (
            filteredTemplates.map((template) => (
              <div key={template.id} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-blue-600">{template.name}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(template)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                {template.type === 'rating-scale' && (
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Description:</strong> {template.description}</p>
                    <p><strong>Number:</strong> {template.number}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;


// // components/TemplateManager.tsx
// import React, { useState, useEffect } from 'react';
// import { FaTrash, FaPlus } from 'react-icons/fa';

// interface Template {
//   id: string;
//   name: string;
//   type: 'cycle' | 'review-level' | 'category' | 'rating-scale';
//   options: string[];
// }

// const TemplateManager: React.FC = () => {
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [activeTab, setActiveTab] = useState<'cycle' | 'review-level' | 'category' | 'rating-scale'>('cycle');
//   const [newTemplateName, setNewTemplateName] = useState('');
//   const [newOption, setNewOption] = useState('');
//   const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
//   const [showOptionInput, setShowOptionInput] = useState(false);

//   // Load templates and fetch cycle types from backend
//   useEffect(() => {
//     const fetchCycleTypes = async () => {
//       try {
//         const res = await fetch('https://localhost:7000/api/CycleType');
//         const data = await res.json();
//         const cycleTemplates = data.map((item: any) => ({
//           id: item.id.toString(),
//           name: item.name,
//           type: 'cycle',
//           options: [],
//         }));

//         setTemplates(prev => {
//           const filtered = prev.filter(t => t.type !== 'cycle');
//           return [...filtered, ...cycleTemplates];
//         });
//       } catch (err) {
//         console.error('Failed to fetch cycle types', err);
//       }
//     };

//     const savedTemplates = localStorage.getItem('performanceTemplates');
//     if (savedTemplates) {
//       setTemplates(JSON.parse(savedTemplates));
//     }

//     fetchCycleTypes();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('performanceTemplates', JSON.stringify(templates));
//   }, [templates]);

//   const filteredTemplates = templates.filter(t => t.type === activeTab);

//   const handleAddTemplate = async () => {
//     if (!newTemplateName.trim()) return;

//     if (activeTab === 'cycle') {
//       try {
//         const response = await fetch('https://localhost:7000/api/CycleType', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name: newTemplateName }),
//         });

//         if (!response.ok) {
//           const error = await response.json();
//           throw new Error(error.message || 'Failed to add cycle type');
//         }

//         const saved = await response.json();

//         const newTemplate: Template = {
//           id: saved.id.toString(),
//           name: saved.name,
//           type: 'cycle',
//           options: [],
//         };

//         setTemplates([...templates, newTemplate]);
//         setNewTemplateName('');
//         return;
//       } catch (error: any) {
//         alert(`Error: ${error.message}`);
//         return;
//       }
//     }

//     // for non-cycle tabs
//     const newTemplate: Template = {
//       id: Date.now().toString(),
//       name: newTemplateName,
//       type: activeTab,
//       options: []
//     };

//     setTemplates([...templates, newTemplate]);
//     setNewTemplateName('');
//   };

//   const handleDeleteTemplate = (id: string) => {
//     setTemplates(templates.filter(t => t.id !== id));
//     if (editingTemplate?.id === id) {
//       setEditingTemplate(null);
//     }
//   };

//   const handleAddOption = () => {
//     if (!newOption.trim() || !editingTemplate) return;

//     const updatedTemplate = {
//       ...editingTemplate,
//       options: [...editingTemplate.options, newOption]
//     };

//     setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
//     setEditingTemplate(updatedTemplate);
//     setNewOption('');
//     setShowOptionInput(false);
//   };

//   const handleDeleteOption = (option: string) => {
//     if (!editingTemplate) return;

//     const updatedTemplate = {
//       ...editingTemplate,
//       options: editingTemplate.options.filter(o => o !== option)
//     };

//     setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
//     setEditingTemplate(updatedTemplate);
//   };

//   const handleEditTemplate = (template: Template) => {
//     setEditingTemplate(template);
//     setNewOption('');
//     setShowOptionInput(false);
//   };

//   const getTemplateTitle = () => {
//     switch (activeTab) {
//       case 'cycle': return 'Cycle Types';
//       case 'review-level': return 'Review Levels';
//       case 'category': return 'Assessment Categories';
//       case 'rating-scale': return 'Rating Scales';
//       default: return '';
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h2 className="text-xl font-semibold mb-6">Performance Review Templates</h2>

//       <div className="flex border-b mb-6">
//         <button className={`px-4 py-2 font-medium ${activeTab === 'cycle' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('cycle')}>Cycle Types</button>
//         <button className={`px-4 py-2 font-medium ${activeTab === 'review-level' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('review-level')}>Review Levels</button>
//         <button className={`px-4 py-2 font-medium ${activeTab === 'category' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('category')}>Categories</button>
//         <button className={`px-4 py-2 font-medium ${activeTab === 'rating-scale' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('rating-scale')}>Rating Scales</button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="md:col-span-1">
//           <h3 className="font-medium mb-4">{getTemplateTitle()}</h3>
//           <div className="space-y-4">
//             {filteredTemplates.map(template => (
//               <div
//                 key={template.id}
//                 className={`p-3 border rounded cursor-pointer flex justify-between items-center ${editingTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
//                 onClick={() => handleEditTemplate(template)}
//               >
//                 <span>{template.name}</span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteTemplate(template.id);
//                   }}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <FaTrash size={14} />
//                 </button>
//               </div>
//             ))}
//             <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 className="flex-1 p-2 border border-gray-300 rounded"
//                 placeholder={`New ${getTemplateTitle()} name`}
//                 value={newTemplateName}
//                 onChange={(e) => setNewTemplateName(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleAddTemplate()}
//               />
//               <button
//                 onClick={handleAddTemplate}
//                 className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//                 disabled={!newTemplateName.trim()}
//               >
//                 <FaPlus size={14} />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="md:col-span-2">
//           {editingTemplate ? (
//             <div className="border border-gray-200 rounded p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-medium">{editingTemplate.name}</h3>
//                 <button onClick={() => setEditingTemplate(null)} className="text-gray-500 hover:text-gray-700">Close</button>
//               </div>

//               <div className="space-y-3 mb-4">
//                 {editingTemplate.options.map((option, index) => (
//                   <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                     <span>{option}</span>
//                     <button onClick={() => handleDeleteOption(option)} className="text-red-500 hover:text-red-700">
//                       <FaTrash size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {showOptionInput ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="text"
//                     className="flex-1 p-2 border border-gray-300 rounded"
//                     placeholder={`Add new ${editingTemplate.name} option`}
//                     value={newOption}
//                     onChange={(e) => setNewOption(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
//                   />
//                   <button onClick={handleAddOption} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" disabled={!newOption.trim()}>
//                     <FaPlus size={12} />
//                   </button>
//                   <button onClick={() => setShowOptionInput(false)} className="p-2 text-gray-500 hover:text-gray-700">Cancel</button>
//                 </div>
//               ) : (
//                 <button onClick={() => setShowOptionInput(true)} className="flex items-center text-blue-600 hover:text-blue-800">
//                   <FaPlus className="mr-1" size={12} /> Add Option
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full bg-gray-50 rounded border border-dashed border-gray-300">
//               <p className="text-gray-500">Select a template to edit</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TemplateManager;


// // components/TemplateManager.tsx
// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash, FaPlus, FaChevronDown } from 'react-icons/fa';

// interface Template {
//   id: string;
//   name: string;
//   type: 'cycle' | 'review-level' | 'category' | 'rating-scale';
//   options: string[];
// }

// const TemplateManager: React.FC = () => {
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [activeTab, setActiveTab] = useState<'cycle' | 'review-level' | 'category' | 'rating-scale'>('cycle');
//   const [newTemplateName, setNewTemplateName] = useState('');
//   const [newOption, setNewOption] = useState('');
//   const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
//   const [showOptionInput, setShowOptionInput] = useState(false);

//   // Load templates from localStorage on component mount
//   useEffect(() => {
//     const savedTemplates = localStorage.getItem('performanceTemplates');
//     if (savedTemplates) {
//       setTemplates(JSON.parse(savedTemplates));
//     } else {
//       // Initialize with default templates
//       const defaultTemplates: Template[] = [
//         {
//           id: '1',
//           name: 'Cycle Types',
//           type: 'cycle',
//           options: ['Annual', 'Quarterly', 'Mid-term', 'Promotion']
//         },
//         {
//           id: '2',
//           name: 'Review Levels',
//           type: 'review-level',
//           options: ['Self Assessment', 'Manager Review', 'HR Approval', 'Final Approval']
//         },
//         {
//           id: '3',
//           name: 'Assessment Categories',
//           type: 'category',
//           options: ['Technical Skills', 'Communication', 'Leadership', 'Teamwork']
//         },
//         {
//           id: '4',
//           name: 'Rating Scales',
//           type: 'rating-scale',
//           options: ['1-5', '1-10', 'Poor-Excellent', 'Needs Improvement-Exceeds Expectations']
//         }
//       ];
//       setTemplates(defaultTemplates);
//       localStorage.setItem('performanceTemplates', JSON.stringify(defaultTemplates));
//     }
//   }, []);

//   // Save templates to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('performanceTemplates', JSON.stringify(templates));
//   }, [templates]);

//   const filteredTemplates = templates.filter(t => t.type === activeTab);

//   const handleAddTemplate = () => {
//     if (!newTemplateName.trim()) return;
    
//     const newTemplate: Template = {
//       id: Date.now().toString(),
//       name: newTemplateName,
//       type: activeTab,
//       options: []
//     };
    
//     setTemplates([...templates, newTemplate]);
//     setNewTemplateName('');
//   };

//   const handleDeleteTemplate = (id: string) => {
//     setTemplates(templates.filter(t => t.id !== id));
//     if (editingTemplate?.id === id) {
//       setEditingTemplate(null);
//     }
//   };

//   const handleAddOption = () => {
//     if (!newOption.trim() || !editingTemplate) return;
    
//     const updatedTemplate = {
//       ...editingTemplate,
//       options: [...editingTemplate.options, newOption]
//     };
    
//     setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
//     setEditingTemplate(updatedTemplate);
//     setNewOption('');
//     setShowOptionInput(false);
//   };

//   const handleDeleteOption = (option: string) => {
//     if (!editingTemplate) return;
    
//     const updatedTemplate = {
//       ...editingTemplate,
//       options: editingTemplate.options.filter(o => o !== option)
//     };
    
//     setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
//     setEditingTemplate(updatedTemplate);
//   };

//   const handleEditTemplate = (template: Template) => {
//     setEditingTemplate(template);
//     setNewOption('');
//     setShowOptionInput(false);
//   };

//   const getTemplateTitle = () => {
//     switch (activeTab) {
//       case 'cycle': return 'Cycle Types';
//       case 'review-level': return 'Review Levels';
//       case 'category': return 'Assessment Categories';
//       case 'rating-scale': return 'Rating Scales';
//       default: return '';
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h2 className="text-xl font-semibold mb-6">Performance Review Templates</h2>
      
//       <div className="flex border-b mb-6">
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'cycle' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('cycle')}
//         >
//           Cycle Types
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'review-level' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('review-level')}
//         >
//           Review Levels
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'category' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('category')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'rating-scale' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('rating-scale')}
//         >
//           Rating Scales
//         </button>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="md:col-span-1">
//           <h3 className="font-medium mb-4">{getTemplateTitle()}</h3>
          
//           <div className="space-y-4">
//             {filteredTemplates.map(template => (
//               <div 
//                 key={template.id} 
//                 className={`p-3 border rounded cursor-pointer flex justify-between items-center ${
//                   editingTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
//                 }`}
//                 onClick={() => handleEditTemplate(template)}
//               >
//                 <span>{template.name}</span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteTemplate(template.id);
//                   }}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <FaTrash size={14} />
//                 </button>
//               </div>
//             ))}
            
//             <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 className="flex-1 p-2 border border-gray-300 rounded"
//                 placeholder={`New ${getTemplateTitle()} name`}
//                 value={newTemplateName}
//                 onChange={(e) => setNewTemplateName(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleAddTemplate()}
//               />
//               <button
//                 onClick={handleAddTemplate}
//                 className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//                 disabled={!newTemplateName.trim()}
//               >
//                 <FaPlus size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="md:col-span-2">
//           {editingTemplate ? (
//             <div className="border border-gray-200 rounded p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-medium">{editingTemplate.name}</h3>
//                 <button
//                   onClick={() => setEditingTemplate(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   Close
//                 </button>
//               </div>
              
//               <div className="space-y-3 mb-4">
//                 {editingTemplate.options.map((option, index) => (
//                   <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                     <span>{option}</span>
//                     <button
//                       onClick={() => handleDeleteOption(option)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <FaTrash size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
              
//               {showOptionInput ? (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="text"
//                     className="flex-1 p-2 border border-gray-300 rounded"
//                     placeholder={`Add new ${editingTemplate.name} option`}
//                     value={newOption}
//                     onChange={(e) => setNewOption(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
//                   />
//                   <button
//                     onClick={handleAddOption}
//                     className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//                     disabled={!newOption.trim()}
//                   >
//                     <FaPlus size={12} />
//                   </button>
//                   <button
//                     onClick={() => setShowOptionInput(false)}
//                     className="p-2 text-gray-500 hover:text-gray-700"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setShowOptionInput(true)}
//                   className="flex items-center text-blue-600 hover:text-blue-800"
//                 >
//                   <FaPlus className="mr-1" size={12} /> Add Option
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full bg-gray-50 rounded border border-dashed border-gray-300">
//               <p className="text-gray-500">Select a template to edit</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TemplateManager;