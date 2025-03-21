import React, { useState, useEffect } from 'react';
import { Habit, HabitType } from '../types/models';
import { predictCategory } from '../utils/categoryPredictor';

// Define colors array
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#3B82F6'];

interface HabitFormProps {
  initialData?: Habit;
  onSubmit: (habitData: Partial<Habit>) => void;
  onCancel: () => void;
  habitType: HabitType;
}

// Create an extended interface for form data with UI-specific fields
interface ExtendedHabitForm extends Partial<Habit> {
  color?: string;
  startDate?: string;
  notes?: string;
}

const HabitForm: React.FC<HabitFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  habitType
}) => {
  // Use the extended interface for form data
  const [formData, setFormData] = useState<ExtendedHabitForm>({
    title: '',
    description: '',
    category: 'General',
    color: COLORS[0],
    type: habitType, // Use the enum value here
    frequency: ['mon', 'tue', 'wed', 'thu', 'fri'], // Initialize as string array
    startDate: new Date().toISOString().split('T')[0],
    ...initialData
  });
  
  const [predictedCategory, setPredictedCategory] = useState('');
  
  const weekdays = [
    { value: 'mon', label: 'Mon' },
    { value: 'tue', label: 'Tue' },
    { value: 'wed', label: 'Wed' },
    { value: 'thu', label: 'Thu' },
    { value: 'fri', label: 'Fri' },
    { value: 'sat', label: 'Sat' },
    { value: 'sun', label: 'Sun' },
  ];
  
  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      color
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Predict category when title changes
    if (name === 'title' && value.length > 2) {
      const prediction = predictCategory(value);
      setPredictedCategory(prediction);
    }
  };

  const toggleFrequency = (day: string) => {
    const currentFrequency = formData.frequency || [];
    let updatedFrequency: string[];
    
    if (currentFrequency.includes(day)) {
      updatedFrequency = currentFrequency.filter(d => d !== day);
    } else {
      updatedFrequency = [...currentFrequency, day];
    }
    
    setFormData(prevData => ({
      ...prevData,
      frequency: updatedFrequency
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract only properties that belong to Habit type
    const { color, startDate, notes, ...habitData } = formData;
    
    onSubmit({
      ...habitData,
      type: habitType
    });
  };
  
  useEffect(() => {
    if (formData.title && formData.title.length > 2) {
      const prediction = predictCategory(formData.title);
      setPredictedCategory(prediction);
    }
  }, [formData.title]);
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {initialData ? 'Edit Habit' : habitType === HabitType.BUILD ? 'Create New Habit' : 'Break Bad Habit'}
      </h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          {habitType === HabitType.BUILD ? 'Habit Name' : 'Bad Habit to Break'}
        </label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
          placeholder={habitType === HabitType.BUILD ? "e.g., Morning Run" : "e.g., Quit Smoking"}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Category
        </label>
        <div className="flex items-center mb-2">
          <input
            type="text"
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            list="categories"
            placeholder="Select or type a category"
            required
          />
          <datalist id="categories">
            <option value="health">Health & Fitness</option>
            <option value="productivity">Productivity</option>
            <option value="self-care">Self-care</option>
            <option value="finance">Finance</option>
            <option value="social">Social</option>
            <option value="bad habits">Bad Habits</option>
            <option value="other">Other</option>
          </datalist>
        </div>
        {predictedCategory && formData.title && formData.title.length > 2 && (
          <div className="text-sm text-gray-500 flex items-center">
            <span>Suggested category: </span>
            <button 
              type="button" 
              onClick={() => setFormData((prev) => ({...prev, category: predictedCategory}))}
              className="ml-1 text-primary-600 underline hover:text-primary-800"
            >
              {predictedCategory}
            </button>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Color</label>
        <div className="flex space-x-2">
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color ? 'border-gray-800' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          {habitType === HabitType.BUILD ? 'How often?' : 'Days to monitor'}
        </label>
        <div className="flex flex-wrap gap-2">
          {weekdays.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleFrequency(day.value)}
              className={`px-3 py-1 rounded-full text-sm ${
                (formData.frequency || []).includes(day.value)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Why is this habit important to you?"
        ></textarea>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Any additional notes..."
        ></textarea>
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          {initialData ? 'Save Changes' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default HabitForm;