// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaVpflvnEIASbVg8Lbj44F3FuwIwWNdAE",
  authDomain: "picstagram-e713a.firebaseapp.com",
  projectId: "picstagram-e713a",
  storageBucket: "picstagram-e713a.appspot.com",
  messagingSenderId: "1041719563969",
  appId: "1:1041719563969:web:d5b03a120f063a6a9aa640",
  measurementId: "G-FH76ER552R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const authService = getAuth(app);

export const dbService = getFirestore(app);
