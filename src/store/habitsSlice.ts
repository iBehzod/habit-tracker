// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../firebase';
// import { Habit } from '../types/models';
// import { v4 as uuidv4 } from 'uuid';

// interface HabitsState {
//   habits: Habit[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: HabitsState = {
//   habits: [],
//   loading: false,
//   error: null
// };

// export const fetchHabits = createAsyncThunk(
//   'habits/fetchHabits',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { auth } = getState() as { auth: { user: { id: string } } };
      
//       if (!auth.user) {
//         return [];
//       }
      
//       const habitsRef = collection(db, 'habits');
//       const q = query(habitsRef, where('userId', '==', auth.user.id));
//       const querySnapshot = await getDocs(q);
      
//       const habits = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Habit[];
      
//       return habits;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const createHabit = createAsyncThunk(
//   'habits/createHabit',
//   async (habitData: Partial<Habit>, { getState, rejectWithValue }) => {
//     try {
//       const { auth } = getState() as { auth: { user: { id: string } } };
      
//       if (!auth.user) {
//         throw new Error('User not authenticated');
//       }
      
//       const newHabit: Omit<Habit, 'id'> = {
//         userId: auth.user.id,
//         title: habitData.title || '',
//         category: habitData.category || 'General',
//         icon: habitData.icon || '📝',
//         color: habitData.color || '#4f46e5',
//         type: habitData.type || 'build',
//         frequency: habitData.frequency || 'daily',
//         customDays: habitData.customDays,
//         targetDaysPerWeek: habitData.targetDaysPerWeek,
//         startDate: habitData.startDate || new Date().toISOString().split('T')[0],
//         endDate: habitData.endDate,
//         reminderTime: habitData.reminderTime,
//         notes: habitData.notes,
//         archived: false
//       };
      
//       const docRef = await addDoc(collection(db, 'habits'), newHabit);
      
//       return {
//         id: docRef.id,
//         ...newHabit
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const updateHabit = createAsyncThunk(
//   'habits/updateHabit',
//   async (habitData: Partial<Habit>, { rejectWithValue }) => {
//     try {
//       if (!habitData.id) {
//         throw new Error('Habit ID is required');
//       }
      
//       const habitRef = doc(db, 'habits', habitData.id);
//       await updateDoc(habitRef, habitData);
      
//       return habitData;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const deleteHabit = createAsyncThunk(
//   'habits/deleteHabit',
//   async (habitId: string, { rejectWithValue }) => {
//     try {
//       const habitRef = doc(db, 'habits', habitId);
//       await deleteDoc(habitRef);
      
//       return habitId;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const completeHabit = createAsyncThunk(
//   'habits/completeHabit',
//   async ({ habitId, date }: { habitId: string, date: string }, { getState, rejectWithValue }) => {
//     try {
//       const { auth } = getState() as { auth: { user: { id: string } } };
      
//       if (!auth.user) {
//         throw new Error('User not authenticated');
//       }
      
//       // In a real app, you would update a log in the database
//       // For now, we'll just return the data to update the UI
//       return { habitId, date, completed: true };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const habitsSlice = createSlice({
//   name: 'habits',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchHabits.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchHabits.fulfilled, (state, action) => {
//         state.loading = false;
//         state.habits = action.payload;
//       })
//       .addCase(fetchHabits.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(createHabit.fulfilled, (state, action) => {
//         state.habits.push(action.payload as Habit);
//       })
//       .addCase(updateHabit.fulfilled, (state, action) => {
//         const index = state.habits.findIndex(habit => habit.id === action.payload.id);
//         if (index !== -1) {
//           state.habits[index] = { ...state.habits[index], ...action.payload };
//         }
//       })
//       .addCase(deleteHabit.fulfilled, (state, action) => {
//         state.habits = state.habits.filter(habit => habit.id !== action.payload);
//       })
//       .addCase(completeHabit.fulfilled, (state, action) => {
//         // In a real app, you would update the habit's log data
//         // For this example, we'll just mark it as completed in the UI
//         const { habitId, date, completed } = action.payload;
//         const habitIndex = state.habits.findIndex(h => h.id === habitId);
        
//         if (habitIndex !== -1) {
//           if (!state.habits[habitIndex].logs) {
//             state.habits[habitIndex].logs = [];
//           }
          
//           const logIndex = state.habits[habitIndex].logs.findIndex((log: any) => log.date === date);
          
//           if (logIndex !== -1) {
//             state.habits[habitIndex].logs[logIndex].completed = completed;
//           } else {
//             state.habits[habitIndex].logs.push({ date, completed, skipped: false });
//           }
//         }
//       });
//   }
// });

// export default habitsSlice.reducer;


// src/store/habitsSlice.ts - simplified version
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Habit } from '../types/models';

// // Sample data
// const sampleHabits: Habit[] = [
//   {
//     id: '1',
//     userId: 'user1',
//     title: 'Morning Meditation',
//     category: 'Mindfulness',
//     icon: '🧘‍♂️',
//     color: '#4f46e5',
//     type: 'build',
//     frequency: 'daily',
//     startDate: '2023-01-01',
//     archived: false,
//     logs: [
//       { id: 'l1', habitId: '1', userId: 'user1', date: new Date().toISOString().split('T')[0], completed: true, skipped: false }
//     ]
//   },
//   {
//     id: '2',
//     userId: 'user1',
//     title: 'Read for 30 minutes',
//     category: 'Learning',
//     icon: '📚',
//     color: '#10b981',
//     type: 'build',
//     frequency: 'daily',
//     startDate: '2023-01-15',
//     archived: false,
//     logs: []
//   },
//   {
//     id: '3',
//     userId: 'user1',
//     title: 'No social media',
//     category: 'Digital Wellness',
//     icon: '📵',
//     color: '#ef4444',
//     type: 'quit',
//     frequency: 'daily',
//     startDate: '2023-02-01',
//     archived: false,
//     logs: []
//   }
// ];

// interface HabitsState {
//   habits: Habit[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: HabitsState = {
//   habits: sampleHabits,
//   loading: false,
//   error: null
// };

// const habitsSlice = createSlice({
//   name: 'habits',
//   initialState,
//   reducers: {
//     // Add, update, complete habits locally for demo
//     addHabit: (state, action: PayloadAction<Partial<Habit>>) => {
//       const newHabit = {
//         id: Date.now().toString(),
//         userId: 'user1',
//         title: '',
//         category: 'General',
//         icon: '📋',
//         color: '#4f46e5',
//         type: 'build' as const,
//         frequency: 'daily' as const,
//         startDate: new Date().toISOString().split('T')[0],
//         archived: false,
//         ...action.payload,
//         logs: []
//       };
//       state.habits.push(newHabit);
//     },
//     updateHabit: (state, action: PayloadAction<Partial<Habit>>) => {
//       const index = state.habits.findIndex(h => h.id === action.payload.id);
//       if (index !== -1) {
//         state.habits[index] = { ...state.habits[index], ...action.payload };
//       }
//     },
//     completeHabit: (state, action: PayloadAction<{ habitId: string; date: string }>) => {
//       const { habitId, date } = action.payload;
//       const habit = state.habits.find(h => h.id === habitId);
//       if (habit) {
//         if (!habit.logs) habit.logs = [];
//         const logIndex = habit.logs.findIndex(log => log.date === date);
//         if (logIndex !== -1) {
//           habit.logs[logIndex].completed = !habit.logs[logIndex].completed;
//         } else {
//           habit.logs.push({
//             id: Date.now().toString(),
//             habitId,
//             userId: 'user1',
//             date,
//             completed: true,
//             skipped: false
//           });
//         }
//       }
//     }
//   }
// });

// export const { addHabit, updateHabit, completeHabit } = habitsSlice.actions;

// // Mock async thunks
// export const fetchHabits = () => ({ type: 'habits/fetchHabits' });
// export const createHabit = (data: Partial<Habit>) => {
//   return (dispatch: any) => {
//     dispatch(addHabit(data));
//   };
// };
// export const fetchStreaks = () => ({ type: 'streaks/fetchStreaks' });

// export default habitsSlice.reducer;


// /////////////////////
//////////////////////


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query,
  setDoc, 
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Habit, HabitType } from '../types/models';

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  loading: false,
  error: null
};

export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (userId: string, { rejectWithValue }) => {
    try {
      const habitsRef = collection(db, 'habits');
      const q = query(habitsRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Find your createHabit function in habitsSlice.ts and add detailed error logging:

export const createHabit = createAsyncThunk(
  'habits/createHabit',
  async ({ userId, habitData }: { userId: string, habitData: Partial<Habit> }, { rejectWithValue }) => {
    try {
      console.log("Attempting to create habit with data:", habitData);
      
      const habitsRef = collection(db, 'habits');
      const newHabitRef = doc(habitsRef);
      
      const newHabit: Habit = {
        id: newHabitRef.id,
        userId,
        title: habitData.title || '',
        description: habitData.description || '',
        category: habitData.category || 'General',
        type: habitData.type || HabitType.BUILD,
        frequency: habitData.frequency || ['mon', 'tue', 'wed', 'thu', 'fri'],
        createdAt: new Date(),
        logs: []
      };
      
      console.log("About to write to Firebase:", newHabit);
      await setDoc(newHabitRef, newHabit);
      console.log("Successfully wrote to Firebase!");
      
      return newHabit;
    } catch (error: any) {
      console.error("Create habit error:", error);
      console.error("Error details:", error.code, error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async ({ id, ...habitData }: Partial<Habit> & { id: string }, { rejectWithValue }) => {
    try {
      const habitRef = doc(db, 'habits', id);
      await updateDoc(habitRef, { ...habitData });
      return { id, ...habitData };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (id: string, { rejectWithValue }) => {
    try {
      const habitRef = doc(db, 'habits', id);
      await deleteDoc(habitRef);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeHabit = createAsyncThunk(
  'habits/completeHabit',
  async ({ habitId, date }: { habitId: string, date: string }, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const habit = state.habits.habits.find((h: Habit) => h.id === habitId);
      
      if (!habit) return rejectWithValue('Habit not found');
      
      const habitRef = doc(db, 'habits', habitId);
      const logs = [...(habit.logs || [])];
      
      const existingLogIndex = logs.findIndex(log => log.date === date);
      
      if (existingLogIndex >= 0) {
        logs[existingLogIndex] = { ...logs[existingLogIndex], completed: true };
      } else {
        logs.push({ date, completed: true });
      }
      
      await updateDoc(habitRef, { logs });
      
      return { habitId, date, logs };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Habits
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.habits = action.payload;
        state.loading = false;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Create Habit
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })
      // Update Habit
      .addCase(updateHabit.fulfilled, (state, action) => {
        const index = state.habits.findIndex(habit => habit.id === action.payload.id);
        if (index !== -1) {
          state.habits[index] = { ...state.habits[index], ...action.payload };
        }
      })
      // Delete Habit
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter(habit => habit.id !== action.payload);
      })
      // Complete Habit
      .addCase(completeHabit.fulfilled, (state, action) => {
        const { habitId, logs } = action.payload;
        const habit = state.habits.find(h => h.id === habitId);
        if (habit) {
          habit.logs = logs;
        }
      });
  }
});

export default habitsSlice.reducer;