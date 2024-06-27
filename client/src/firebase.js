// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ba667.firebaseapp.com",
  projectId: "mern-estate-ba667",
  storageBucket: "mern-estate-ba667.appspot.com",
  messagingSenderId: "329388111193",
  appId: "1:329388111193:web:2f5730a7703bf7b2948848",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
