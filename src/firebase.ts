// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Get Firebase services
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export default app;

// src/firebase.ts
// Simple mock for Firebase
export const auth = {
  currentUser: {
    uid: 'user1',
    email: 'demo@example.com',
    displayName: 'Demo User',
    photoURL: null,
    updateProfile: async () => {}
  }
};

export const db = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        data: () => ({}),
        exists: true
      }),
      set: async () => {},
      update: async () => {}
    })
  })
};

export default { auth, db };