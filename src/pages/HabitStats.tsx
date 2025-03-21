import React, { useState, useEffect } from 'react';
import { Habit } from '../types/models';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HabitStatsProps {
  habits: Habit[];
}

const HabitStats: React.FC<HabitStatsProps> = ({ habits }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedHabit, setSelectedHabit] = useState<string>('all');
  
  // This would be calculated from your actual habit logs
  const generateMockData = (period: 'week' | 'month' | 'year') => {
    let labels: string[] = [];
    let completionData: number[] = [];
    
    if (period === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      completionData = [5, 7, 6, 8, 9, 4, 6]; // Example data
    } else if (period === 'month') {
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
      completionData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 10));
    } else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      completionData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
    }
    
    return { labels, completionData };
  };
  
  const { labels, completionData } = generateMockData(selectedPeriod);
  
  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Completed Habits',
        data: completionData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  const barChartData = {
    labels: habits.map(h => h.title),
    datasets: [
      {
        label: 'Current Streak',
        data: habits.map(() => Math.floor(Math.random() * 30)), // Mock streak data
        backgroundColor: '#6366f1',
      },
      {
        label: 'Longest Streak',
        data: habits.map(() => Math.floor(Math.random() * 60)), // Mock longest streak data
        backgroundColor: '#10b981',
      },
    ],
  };
  
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Habit Completion Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Habits Completed'
        }
      }
    }
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Habit Streaks',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Days'
        }
      }
    }
  };
  
  const calculateCompletionRate = () => {
    // This would be calculated from real data
    return Math.round(Math.random() * 100);
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <div className="flex bg-gray-100 rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm ${selectedPeriod === 'week' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button 
              className={`px-4 py-2 text-sm ${selectedPeriod === 'month' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button 
              className={`px-4 py-2 text-sm ${selectedPeriod === 'year' ? 'bg-primary-500 text-white' : ''}`}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-gray-500 text-sm">Completion Rate</h3>
            <div className="flex items-end">
              <span className="text-2xl font-bold">{calculateCompletionRate()}%</span>
              <span className="ml-2 text-green-500 text-sm">↑ 12%</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-gray-500 text-sm">Total Habits</h3>
            <div className="flex items-end">
              <span className="text-2xl font-bold">{habits.length}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-gray-500 text-sm">Longest Streak</h3>
            <div className="flex items-end">
              <span className="text-2xl font-bold">14 days</span>
              <span className="ml-2 text-sm text-gray-500">Reading</span>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <Line data={lineChartData} options={lineOptions} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Streak Analysis</h2>
        
        <div className="h-64">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Calendar View</h2>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
          
          {Array.from({ length: 35 }, (_, i) => {
            const day = i + 1;
            const completionRate = Math.random();
            let bgColor = 'bg-gray-100';
            
            if (completionRate > 0.8) {
              bgColor = 'bg-green-500';
            } else if (completionRate > 0.5) {
              bgColor = 'bg-green-300';
            } else if (completionRate > 0.1) {
              bgColor = 'bg-green-200';
            }
            
            return (
              <div 
                key={i} 
                className={`aspect-square rounded-md ${bgColor} flex items-center justify-center ${day > 30 ? 'opacity-40' : ''}`}
              >
                {day <= 30 ? day : day - 30}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HabitStats;