// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_axIB8SYU4pDZQtjnZWNRqnJ53eGSJH8",
  authDomain: "park-and-ride-app.firebaseapp.com",
  projectId: "park-and-ride-app",
  storageBucket: "park-and-ride-app.appspot.com",
  messagingSenderId: "285496625937",
  appId: "1:285496625937:web:4e45ab0a2fb90e43a1d3f9",
  measurementId: "G-T4HB4VXLRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 