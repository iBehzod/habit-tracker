// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAnBAQf9eLy2HpmMEmfD1SUGgsQVMqwo54",
//   authDomain: "habit-tracker-5a73c.firebaseapp.com",
//   projectId: "habit-tracker-5a73c",
//   storageBucket: "habit-tracker-5a73c.firebasestorage.app",
//   messagingSenderId: "277833815782",
//   appId: "1:277833815782:web:3208b18302088f1fc04d27",
//   measurementId: "G-DFSDSPQM45"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// export default app;



import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use your actual Firebase config or environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, 
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log("Initializing Firebase with config:", {
  apiKey: firebaseConfig.apiKey ? "[SET]" : "[NOT SET]",
  authDomain: firebaseConfig.authDomain ? "[SET]" : "[NOT SET]",
  projectId: firebaseConfig.projectId ? "[SET]" : "[NOT SET]"
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase initialized successfully");

// Export without explicit type annotations (let TypeScript infer them)
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;