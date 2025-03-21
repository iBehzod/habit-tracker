// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut,
//   updateProfile,
//   User as FirebaseUser
// } from 'firebase/auth';
// import { auth } from '../firebase';

// interface AuthState {
//   user: {
//     id: string;
//     email: string;
//     name: string;
//     photoURL?: string;
//   } | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null
// };

// export const register = createAsyncThunk(
//   'auth/register',
//   async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(userCredential.user, {
//         displayName: name
//       });
      
//       return {
//         id: userCredential.user.uid,
//         email: userCredential.user.email,
//         name: userCredential.user.displayName,
//         photoURL: userCredential.user.photoURL
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const login = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       return {
//         id: userCredential.user.uid,
//         email: userCredential.user.email,
//         name: userCredential.user.displayName,
//         photoURL: userCredential.user.photoURL
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const logout = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await signOut(auth);
//       return null;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       if (action.payload) {
//         state.user = {
//           id: action.payload.uid,
//           email: action.payload.email || '',
//           name: action.payload.displayName || '',
//           photoURL: action.payload.photoURL
//         };
//       } else {
//         state.user = null;
//       }
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(logout.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//       });
//   }
// });

// export const { setUser } = authSlice.actions;
// export default authSlice.reducer;



// src/store/authSlice.js - simplified for demo
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   photoURL?: string;
// }

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: { id: 'user1', email: 'demo@example.com', name: 'Demo User' },
//   loading: false,
//   error: null
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User | null>) => {
//       state.user = action.payload;
//     },
//     login: (state, action: PayloadAction<{email: string; password: string}>) => {
//       state.user = { id: 'user1', email: action.payload.email, name: 'Demo User' };
//       state.loading = false;
//     },
//     logout: (state) => {
//       state.user = null;
//     },
//     register: (state, action: PayloadAction<{name: string; email: string; password: string}>) => {
//       state.user = { id: 'user1', email: action.payload.email, name: action.payload.name };
//       state.loading = false;
//     }
//   }
// });

// export const { login, logout, register, setUser } = authSlice.actions;
// export default authSlice.reducer;





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  UserCredential,
  User
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      return userCredential.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => { // No parameters needed
    try {
      await firebaseSignOut(auth);
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;