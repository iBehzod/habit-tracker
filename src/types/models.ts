export enum HabitType {
  BUILD = 'build',
  BREAK = 'break'
}

export interface HabitLog {
  date: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: HabitType;
  frequency: string[];
  reminder?: string;
  goal?: number;
  userId: string;
  createdAt: Date;
  logs?: HabitLog[];
}

export interface Streak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
  userId?: string;
}