import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import HabitDropdownButton from '../components/HabitDropdownButton';
import { fetchHabits, completeHabit, createHabit, updateHabit, deleteHabit } from '../store/habitsSlice';
import { fetchStreaks } from '../store/streaksSlice';
import { Habit, HabitType } from '../types/models';
import Calendar from '../components/Calendar';
import HabitStats from '../components/HabitStats';
import { RootState } from '../store';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { habits, loading } = useSelector((state: RootState) => state.habits);
  const { streaks } = useSelector((state: RootState) => state.streaks);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'day' | 'stats'>('day');
  const [habitType, setHabitType] = useState<HabitType>(HabitType.BUILD);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Fetch habits when component mounts or user changes
  useEffect(() => {
    if (user) {
      dispatch(fetchHabits(user.uid));
      dispatch(fetchStreaks(user.uid));
    }
  }, [dispatch, user]);
  
  const handleCreateNewHabit = () => {
    setEditingHabit(null);
    setHabitType(HabitType.BUILD);
    setShowHabitForm(true);
  };
  
  const handleBreakBadHabit = () => {
    setEditingHabit(null);
    setHabitType(HabitType.BREAK);
    setShowHabitForm(true);
  };
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setHabitType(habit.type);
    setShowHabitForm(true);
  };
  
  const handleDeleteHabit = (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      dispatch(deleteHabit(habitId));
    }
  };
  
  
  const handleHabitSubmit = (habitData: Partial<Habit>) => {
    if (editingHabit) {
      dispatch(updateHabit({
        id: editingHabit.id,
        ...habitData
      }));
    } else if (user) {
      dispatch(createHabit({
        userId: user.uid,
        habitData: { 
          ...habitData, 
          type: habitType 
        }
      }));
    }
    setShowHabitForm(false);
  };
  
  const handleCompleteHabit = (habit: Habit, date: string) => {
    dispatch(completeHabit({ habitId: habit.id, date }));
  };
  
  const getCompletedHabits = (date: string) => {
    return habits.filter((habit: Habit) => {
      const log = habit.logs?.find((log: any) => log.date === date);
      return log && log.completed;
    }).map((habit: Habit) => habit.id);
  };
  
  const completedHabits = getCompletedHabits(selectedDate);
  
  // Get unique categories from habits
  const categories = Array.from(new Set(habits.map((habit: Habit) => habit.category)));
  
  // Filter habits based on selected category
  const filteredHabits = categoryFilter 
    ? habits.filter((habit: Habit) => habit.category === categoryFilter)
    : habits;
  
  // Calculate completion rate
  const getTodayCompletionRate = () => {
    const habitsForToday = habits.filter((habit: Habit) => {
      const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
      return habit.frequency.includes(dayOfWeek);
    });
    
    if (habitsForToday.length === 0) return 0;
    
    const completed = habitsForToday.filter((habit: Habit) => 
      completedHabits.includes(habit.id)
    ).length;
    
    return Math.round((completed / habitsForToday.length) * 100);
  };
  
  const completionRate = getTodayCompletionRate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Habits</h1>
          <p className="text-sm text-gray-600">Track your daily progress</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-md ${
                view === 'day' ? 'bg-primary-500 text-white' : 'bg-gray-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('stats')}
              className={`px-4 py-2 rounded-md ${
                view === 'stats' ? 'bg-primary-500 text-white' : 'bg-gray-200'
              }`}
            >
              Stats
            </button>
          </div>
          
          <HabitDropdownButton 
            onCreateNewHabit={handleCreateNewHabit}
            onBreakBadHabit={handleBreakBadHabit}
          />
        </div>
      </div>
      
      {view === 'day' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                
                {habits.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Filter:</span>
                    <select
                      value={categoryFilter || ''}
                      onChange={(e) => setCategoryFilter(e.target.value || null)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {habits.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Today's Progress</h3>
                      <p className="text-2xl font-semibold">{completionRate}%</p>
                    </div>
                    <div className="w-32 h-32">
                      <div className="relative w-full h-full">
                        {/* Progress Ring */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* Background Ring */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke="#e5e7eb" 
                            strokeWidth="8" 
                          />
                          {/* Progress Ring */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke="#6366f1" 
                            strokeWidth="8" 
                            strokeDasharray="251.2" 
                            strokeDashoffset={251.2 - (251.2 * completionRate / 100)}
                            transform="rotate(-90 50 50)" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-semibold">{completionRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-500" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : habits.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">You haven't created any habits yet.</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={handleCreateNewHabit}
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Habit
                  </button>
                  <button
                    onClick={handleBreakBadHabit}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Break Habit
                  </button>
                </div>
              </div>
            ) : (
              <>
                {filteredHabits.filter(h => h.type === HabitType.BUILD).length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Build Habits</h3>
                    {filteredHabits
                      .filter(habit => habit.type === HabitType.BUILD)
                      .map((habit: Habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onComplete={handleCompleteHabit}
                          onEdit={() => handleEditHabit(habit)}
                          onDelete={() => handleDeleteHabit(habit.id)}
                          streak={streaks[habit.id]?.currentStreak || 0}
                          isCompleted={completedHabits.includes(habit.id)}
                          date={selectedDate}
                        />
                      ))
                    }
                  </div>
                )}
                
                {filteredHabits.filter(h => h.type === HabitType.BREAK).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Break Habits</h3>
                    {filteredHabits
                      .filter(habit => habit.type === HabitType.BREAK)
                      .map((habit: Habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onComplete={handleCompleteHabit}
                          onEdit={() => handleEditHabit(habit)}
                          onDelete={() => handleDeleteHabit(habit.id)}
                          streak={streaks[habit.id]?.currentStreak || 0}
                          isCompleted={completedHabits.includes(habit.id)}
                          date={selectedDate}
                        />
                      ))
                    }
                  </div>
                )}

                {filteredHabits.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-4 text-center text-gray-500">
                    No habits match the selected category
                  </div>
                )}
              </>
            )}
          </div>
          
          <div>
            <Calendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              completedDates={habits.reduce((acc: Record<string, string[]>, habit: Habit) => {
                habit.logs?.forEach(log => {
                  if (log.completed) {
                    if (!acc[log.date]) {
                      acc[log.date] = [];
                    }
                    acc[log.date].push(habit.id);
                  }
                });
                return acc;
              }, {})}
            />
            
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium text-gray-700 mb-3">Current Streaks</h3>
              
              {Object.entries(streaks).length === 0 ? (
                <p className="text-gray-500 text-sm">Complete habits to build streaks</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(streaks)
                    .sort(([, a], [, b]) => b.currentStreak - a.currentStreak)
                    .slice(0, 5)
                    .map(([habitId, streak]) => {
                      const habit = habits.find(h => h.id === habitId);
                      if (!habit) return null;
                      
                      return (
                        <div key={habitId} className="flex justify-between items-center">
                          <span className="text-sm truncate" title={habit.title}>
                            {habit.title}
                          </span>
                          <span className="font-medium text-primary-600 flex items-center">
                            {streak.currentStreak}
                            <svg className="w-4 h-4 ml-1 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" />
                            </svg>
                          </span>
                        </div>
                      );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <HabitStats habits={habits} streaks={streaks} />
        </div>
      )}
      
      {showHabitForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg">
            <HabitForm
              initialData={editingHabit || undefined}
              onSubmit={handleHabitSubmit}
              onCancel={() => setShowHabitForm(false)}
              habitType={habitType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;