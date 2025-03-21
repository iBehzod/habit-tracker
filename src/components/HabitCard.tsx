import React from 'react';
import { Habit, HabitType } from '../types/models';

interface HabitCardProps {
  habit: Habit;
  onComplete: (habit: Habit, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  streak: number;
  isCompleted: boolean;
  date: string;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onComplete,
  onEdit,
  onDelete,
  streak,
  isCompleted,
  date
}) => {
  const isBuildHabit = habit.type === HabitType.BUILD;
  
  const getCategoryColor = (category: string) => {
    const colorMap: {[key: string]: string} = {
      'health': 'bg-green-100 text-green-800',
      'productivity': 'bg-blue-100 text-blue-800',
      'self-care': 'bg-purple-100 text-purple-800',
      'finance': 'bg-emerald-100 text-emerald-800',
      'social': 'bg-yellow-100 text-yellow-800',
      'bad habits': 'bg-red-100 text-red-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    
    return colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${
      isBuildHabit ? 'border-primary-500' : 'border-red-500'
    } p-4`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h3 className="font-medium">{habit.title}</h3>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getCategoryColor(habit.category)}`}>
              {habit.category}
            </span>
          </div>
          
          {habit.description && (
            <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
          )}
          
          <div className="text-xs text-gray-500 flex flex-wrap gap-1">
            {habit.frequency.map((day) => (
              <span key={day} className="capitalize">{day}</span>
            )).reduce((prev, curr) => (
              <>
                {prev}
                <span className="mx-0.5">·</span>
                {curr}
              </>
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          {streak > 0 && (
            <div className="mr-3 flex items-center" title="Current streak">
              <span className="font-medium text-sm mr-1">{streak}</span>
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" />
              </svg>
            </div>
          )}
          
          <div className="flex items-center">
            <button
              onClick={() => onEdit(habit)}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              aria-label="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={() => onDelete(habit.id)}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 mx-1"
              aria-label="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <button
              onClick={() => onComplete(habit, date)}
              className={`p-1.5 rounded-full ${
                isCompleted
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={isCompleted ? 'Completed' : 'Mark as complete'}
              disabled={isCompleted}
            >
              {isBuildHabit ? (
                <svg className="w-5 h-5" fill={isCompleted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill={isCompleted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;