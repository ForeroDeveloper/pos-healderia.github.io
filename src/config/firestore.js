// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2CyMh7Gvel3NsKiOjqIuw8_-DQvomdLc",
  authDomain: "la-pista-del-sabor.firebaseapp.com",
  projectId: "la-pista-del-sabor",
  storageBucket: "la-pista-del-sabor.appspot.com",
  messagingSenderId: "669106314916",
  appId: "1:669106314916:web:ad8cfab3f53b2522db9031",
  measurementId: "G-XECD6XKVBR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

