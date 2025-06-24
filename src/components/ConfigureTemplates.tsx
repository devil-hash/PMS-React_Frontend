// src/pages/HR/ConfigureTemplates.tsx
import React, { useState } from 'react';
import { Template } from '../types/reviewTypes';

const ConfigureTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState<Template>({
    id: Date.now(),
    name: '',
    type: 'Annual',
    description: '',
    fields: ['']
  });

  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...newTemplate.fields];
    updatedFields[index] = value;
    setNewTemplate({ ...newTemplate, fields: updatedFields });
  };

  const addField = () => {
    setNewTemplate({ ...newTemplate, fields: [...newTemplate.fields, ''] });
  };

  const saveTemplate = () => {
    setTemplates([...templates, newTemplate]);
    setNewTemplate({
      id: Date.now(),
      name: '',
      type: 'Annual',
      description: '',
      fields: ['']
    });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Configure Templates</h2>
      <div className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Template Name"
          value={newTemplate.name}
          onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
        />
        <select
          className="border p-2 w-full"
          value={newTemplate.type}
          onChange={e => setNewTemplate({ ...newTemplate, type: e.target.value as any })}
        >
          <option value="Annual">Annual</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Mid-term">Mid-term</option>
        </select>
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={newTemplate.description}
          onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })}
        />
        <div>
          <h4 className="font-medium mb-2">Fields</h4>
          {newTemplate.fields.map((field, index) => (
            <input
              key={index}
              className="border p-2 w-full mb-2"
              placeholder={`Field ${index + 1}`}
              value={field}
              onChange={e => handleFieldChange(index, e.target.value)}
            />
          ))}
          <button className="text-blue-500" onClick={addField}>+ Add Field</button>
        </div>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={saveTemplate}
        >
          Save Template
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Saved Templates</h3>
        {templates.map(t => (
          <div key={t.id} className="border p-4 rounded mb-2">
            <h4 className="font-semibold">{t.name} ({t.type})</h4>
            <p className="text-sm text-gray-600">{t.description}</p>
            <ul className="list-disc list-inside mt-2">
              {t.fields.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigureTemplates;
