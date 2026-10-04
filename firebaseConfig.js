// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCegoxv9Ov-AYgamV1yhCB6dRUN8QtdNCI",
  authDomain: "webbbb-eda6d.firebaseapp.com",
  databaseURL: "https://webbbb-eda6d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "webbbb-eda6d",
  storageBucket: "webbbb-eda6d.appspot.com",   // ✅ fix: use .appspot.com not .firebasestorage.app
  messagingSenderId: "672031237919",
  appId: "1:672031237919:web:2fc52783d6b5bcc57ef22a",
  measurementId: "G-XNM5S65ZKQ"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
const analytics = getAnalytics(app);
