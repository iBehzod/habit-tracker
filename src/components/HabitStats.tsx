import React, { useState } from 'react';
import { Habit, HabitType } from '../types/models';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface HabitStatsProps {
  habits: Habit[];
  streaks: { [habitId: string]: { currentStreak: number; longestStreak: number } };
}

const HabitStats: React.FC<HabitStatsProps> = ({ habits, streaks }) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate completion rates for each habit
  const calculateCompletionRate = (habit: Habit) => {
    if (!habit.logs || habit.logs.length === 0) return 0;
    
    let totalDays = 0;
    let completedDays = 0;
    
    const now = new Date();
    let startDate: Date;
    
    if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    const dayOfWeekMap: Record<string, number> = {
      'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 0
    };
    
    // Generate all dates the habit should have been completed
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Check if this day of week is in the habit's frequency
      const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayOfWeek];
      if (habit.frequency.includes(dayName)) {
        totalDays++;
        
        // Check if the habit was completed on this date
        const dateString = d.toISOString().split('T')[0];
        const log = habit.logs.find(l => l.date === dateString);
        if (log && log.completed) {
          completedDays++;
        }
      }
    }
    
    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  };
  
  // Prepare data for charts
  const habitCompletionData = habits.map(habit => ({
    name: habit.title.length > 15 ? habit.title.substring(0, 15) + '...' : habit.title,
    completionRate: calculateCompletionRate(habit),
    streak: streaks[habit.id]?.currentStreak || 0,
    type: habit.type
  }));
  
  const categoryData = habits.reduce((acc, habit) => {
    const existingCategory = acc.find(cat => cat.name === habit.category);
    if (existingCategory) {
      existingCategory.count += 1;
    } else {
      acc.push({ name: habit.category, count: 1 });
    }
    return acc;
  }, [] as { name: string, count: number }[]);
  
  const typeData = [
    { name: 'Build', count: habits.filter(h => h.type === HabitType.BUILD).length },
    { name: 'Break', count: habits.filter(h => h.type === HabitType.BREAK).length }
  ];
  
  // Pie chart colors
  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#3B82F6'];
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Habit Stats</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1 rounded-md text-sm ${
                period === 'week' ? 'bg-primary-500 text-white' : 'bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1 rounded-md text-sm ${
                period === 'month' ? 'bg-primary-500 text-white' : 'bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-3 py-1 rounded-md text-sm ${
                period === 'year' ? 'bg-primary-500 text-white' : 'bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        {habits.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <p>No habit data to display yet. Create habits and track them to see stats.</p>
          </div>
        ) : (
          <>
            <h4 className="font-medium mb-2">Completion Rates</h4>
            <div className="w-full h-64 mb-8">
              <ResponsiveContainer>
                <BarChart data={habitCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} unit="%" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                  <Legend />
                  <Bar 
                    dataKey="completionRate" 
                    name="Completion Rate" 
                    fill="#6366F1" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <h4 className="font-medium mb-2">Current Streaks</h4>
            <div className="w-full h-64 mb-8">
              <ResponsiveContainer>
                <BarChart data={habitCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="streak" 
                    name="Current Streak" 
                    fill="#F59E0B" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Categories Distribution</h4>
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#6366F1"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} habits`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Habit Types</h4>
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={typeData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#6366F1"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#6366F1" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} habits`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HabitStats;