// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtCkvMpa_cnotKv9OgqaEgkmxVbyZMvXk",
  authDomain: "mon-entreprise-2973e.firebaseapp.com",
  projectId: "mon-entreprise-2973e",
  storageBucket: "mon-entreprise-2973e.firebasestorage.app",
  messagingSenderId: "906734799670",
  appId: "1:906734799670:web:e808f6f68537b04535c197",
  measurementId: "G-0JQGWZMZTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);