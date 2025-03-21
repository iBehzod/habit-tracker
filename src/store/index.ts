import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import habitsReducer from './habitsSlice';
import streaksReducer from './streaksSlice';

// Add console logs for debugging
console.log("Initializing Redux store...");

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitsReducer,
    streaks: streaksReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

console.log("Redux store initialized");

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;