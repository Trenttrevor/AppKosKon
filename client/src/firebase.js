// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "appkoskon.firebaseapp.com",
  projectId: "appkoskon",
  storageBucket: "appkoskon.appspot.com",
  messagingSenderId: "110049522845",
  appId: "1:110049522845:web:f945ae2fa04aa21ea01074"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);