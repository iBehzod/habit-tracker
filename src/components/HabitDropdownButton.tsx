import React, { useState, useRef, useEffect } from 'react';

interface HabitDropdownButtonProps {
  onCreateNewHabit: () => void;
  onBreakBadHabit: () => void;
}

const HabitDropdownButton: React.FC<HabitDropdownButtonProps> = ({ 
  onCreateNewHabit, 
  onBreakBadHabit 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
      >
        <span>+ New Habit</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => {
                onCreateNewHabit();
                setIsOpen(false);
              }}
              className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <div className="flex items-center">
                <svg 
                  className="w-5 h-5 mr-2 text-green-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New Habit</span>
              </div>
              <p className="text-xs text-gray-500 ml-7">Build positive routines</p>
            </button>
            <button
              onClick={() => {
                onBreakBadHabit();
                setIsOpen(false);
              }}
              className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <div className="flex items-center">
                <svg 
                  className="w-5 h-5 mr-2 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Break Bad Habit</span>
              </div>
              <p className="text-xs text-gray-500 ml-7">Reduce negative behaviors</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitDropdownButton;