import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

interface CalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  completedDates: Record<string, string[]>;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateChange,
  completedDates
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    
    let startDate = startOfWeek(startOfMonth(currentMonth));

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs font-medium text-gray-500 uppercase">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1 mb-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, 'yyyy-MM-dd');
        const isSelected = isSameDay(cloneDay, new Date(selectedDate));
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        const hasCompleted = completedDates[formattedDate]?.length > 0;
        
        days.push(
          <button
            key={i}
            className={`
              h-9 w-9 rounded-full flex items-center justify-center text-sm
              ${!isCurrentMonth ? 'text-gray-300' : ''}
              ${isSelected ? 'bg-primary-500 text-white' : ''}
              ${hasCompleted && !isSelected ? 'bg-primary-100 text-primary-700' : ''}
              ${isCurrentMonth && !isSelected ? 'hover:bg-gray-100' : ''}
            `}
            onClick={() => onDateChange(formattedDate)}
            disabled={!isCurrentMonth}
          >
            {format(cloneDay, 'd')}
          </button>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={format(day, 'T')} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-medium text-gray-700 mb-3">Calendar</h3>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;