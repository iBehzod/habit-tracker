// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateProfile } from 'firebase/auth';
// import { auth } from '../firebase';
// import { setUser } from '../store/authSlice';

// const Settings: React.FC = () => {
//   const { user } = useSelector((state: any) => state.auth);
//   const [name, setName] = useState(user?.name || '');
//   const [darkMode, setDarkMode] = useState(false);
//   const [reminderTime, setReminderTime] = useState('20:00');
//   const [weekStart, setWeekStart] = useState<0 | 1>(0);
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const dispatch = useDispatch();
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSuccess('');
//     setError('');
    
//     try {
//       if (auth.currentUser) {
//         await updateProfile(auth.currentUser, {
//           displayName: name
//         });
        
//         dispatch(setUser(auth.currentUser));
//         setSuccess('Settings updated successfully');
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   return (
//     <div className="max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {success}
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//               Display Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={user?.email}
//               className="w-full px-4 py-2 border rounded-md bg-gray-50 cursor-not-allowed"
//               disabled
//             />
//             <p className="mt-1 text-xs text-gray-500">
//               Email cannot be changed
//             </p>
//           </div>
          
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md disabled:opacity-70"
//           >
//             {isSubmitting ? 'Updating...' : 'Update Account'}
//           </button>
//         </form>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium text-gray-800">Dark Mode</h3>
//               <p className="text-sm text-gray-500">Enable dark mode for the app</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input 
//                 type="checkbox" 
//                 checked={darkMode}
//                 onChange={() => setDarkMode(!darkMode)}
//                 className="sr-only peer" 
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
//             </label>
//           </div>
          
//           <div>
//             <h3 className="font-medium text-gray-800 mb-2">Daily Reminder</h3>
//             <input
//               type="time"
//               value={reminderTime}
//               onChange={(e) => setReminderTime(e.target.value)}
//               className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//             <p className="mt-1 text-sm text-gray-500">
//               Set a time for daily reminders
//             </p>
//           </div>
          
//           <div>
//             <h3 className="font-medium text-gray-800 mb-2">Week Starts On</h3>
//             <div className="flex space-x-4">
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   className="form-radio text-primary-500"
//                   name="weekStart"
//                   checked={weekStart === 0}
//                   onChange={() => setWeekStart(0)}
//                 />
//                 <span className="ml-2">Sunday</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   className="form-radio text-primary-500"
//                   name="weekStart"
//                   checked={weekStart === 1}
//                   onChange={() => setWeekStart(1)}
//                 />
//                 <span className="ml-2">Monday</span>
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
        
//         <div className="space-y-6">
//           <div>
//             <h3 className="font-medium text-gray-800">Export Data</h3>
//             <p className="text-sm text-gray-500 mb-2">
//               Download all your habit data as a JSON file
//             </p>
//             <button
//               className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
//             >
//               Export Data
//             </button>
//           </div>
          
//           <div>
//             <h3 className="font-medium text-red-600">Delete Account</h3>
//             <p className="text-sm text-gray-500 mb-2">
//               Permanently delete your account and all associated data
//             </p>
//             <button
//               className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
//             >
//               Delete Account
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;



import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';

const Settings: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [name, setName] = useState(user?.name || '');
  const [darkMode, setDarkMode] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [weekStart, setWeekStart] = useState<0 | 1>(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess('');
    setError('');
    
    try {
      // Mock updating the user
      dispatch(setUser({
        ...user,
        name
      }));
      setSuccess('Settings updated successfully');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Account Settings Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 cursor-not-allowed"
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md disabled:opacity-70"
          >
            {isSubmitting ? 'Updating...' : 'Update Account'}
          </button>
        </form>
      </div>
      
      {/* Preferences Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Dark Mode</h3>
              <p className="text-sm text-gray-500">Enable dark mode for the app</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Daily Reminder</h3>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Set a time for daily reminders
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Week Starts On</h3>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-primary-500"
                  name="weekStart"
                  checked={weekStart === 0}
                  onChange={() => setWeekStart(0)}
                />
                <span className="ml-2">Sunday</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-primary-500"
                  name="weekStart"
                  checked={weekStart === 1}
                  onChange={() => setWeekStart(1)}
                />
                <span className="ml-2">Monday</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-800">Export Data</h3>
            <p className="text-sm text-gray-500 mb-2">
              Download all your habit data as a JSON file
            </p>
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            >
              Export Data
            </button>
          </div>
          
          <div>
            <h3 className="font-medium text-red-600">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-2">
              Permanently delete your account and all associated data
            </p>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;