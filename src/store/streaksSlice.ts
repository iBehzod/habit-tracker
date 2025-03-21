import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Streak } from '../types/models';

interface StreaksState {
  streaks: { [habitId: string]: Streak };
  loading: boolean;
  error: string | null;
}

const initialState: StreaksState = {
  streaks: {},
  loading: false,
  error: null
};

export const fetchStreaks = createAsyncThunk(
  'streaks/fetchStreaks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const streaksRef = collection(db, 'streaks');
      const q = query(streaksRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      
      const streaks: { [habitId: string]: Streak } = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data() as Streak;
        streaks[data.habitId] = data;
      });
      
      return streaks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStreak = createAsyncThunk(
  'streaks/updateStreak',
  async ({ habitId, streak }: { habitId: string; streak: Streak }, { rejectWithValue }) => {
    try {
      const streakRef = doc(db, 'streaks', habitId);
      await setDoc(streakRef, streak, { merge: true });
      return { habitId, streak };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to calculate streaks
export const calculateStreaks = createAsyncThunk(
  'streaks/calculateStreaks',
  async (userId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state: any = getState();
      const habits = state.habits.habits;
      const streaks: { [habitId: string]: Streak } = {};
      
      for (const habit of habits) {
        const logs = habit.logs || [];
        logs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        let currentStreak = 0;
        let longestStreak = 0;
        let lastCompletedDate = '';
        
        if (logs.length > 0 && logs[0].completed) {
          lastCompletedDate = logs[0].date;
          
          // Calculate current streak
          let prevDate: Date | null = null;
          
          for (const log of logs) {
            if (!log.completed) break;
            
            const currentDate = new Date(log.date);
            
            if (prevDate === null) {
              currentStreak = 1;
              prevDate = currentDate;
              continue;
            }
            
            const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              currentStreak++;
              prevDate = currentDate;
            } else {
              break;
            }
          }
          
          // Calculate longest streak
          let tempStreak = 0;
          prevDate = null;
          
          for (const log of logs) {
            if (!log.completed) {
              if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
              }
              tempStreak = 0;
              prevDate = null;
              continue;
            }
            
            const currentDate = new Date(log.date);
            
            if (prevDate === null) {
              tempStreak = 1;
              prevDate = currentDate;
              continue;
            }
            
            const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              tempStreak++;
              prevDate = currentDate;
            } else {
              if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
              }
              tempStreak = 1;
              prevDate = currentDate;
            }
          }
          
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        }
        
        streaks[habit.id] = {
          habitId: habit.id,
          currentStreak,
          longestStreak,
          lastCompletedDate
        };
        
        // Update streak in Firebase
        dispatch(updateStreak({ 
          habitId: habit.id, 
          streak: { 
            ...streaks[habit.id],
            userId 
          } 
        }));
      }
      
      return streaks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const streaksSlice = createSlice({
  name: 'streaks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Streaks
      .addCase(fetchStreaks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStreaks.fulfilled, (state, action) => {
        state.streaks = action.payload;
        state.loading = false;
      })
      .addCase(fetchStreaks.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Update Streak
      .addCase(updateStreak.fulfilled, (state, action) => {
        const { habitId, streak } = action.payload;
        state.streaks[habitId] = streak;
      })
      // Calculate Streaks
      .addCase(calculateStreaks.fulfilled, (state, action) => {
        state.streaks = action.payload;
      });
  }
});

export default streaksSlice.reducer;