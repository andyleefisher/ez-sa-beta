import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBtdQtk18i0pRaJXnM3ps6NZsp0aUX4_Jc",
  authDomain: "ez-sa-beta.firebaseapp.com",
  projectId: "ez-sa-beta",
  storageBucket: "ez-sa-beta.firebasestorage.app",
  messagingSenderId: "894716107102",
  appId: "1:894716107102:web:1364b1c5078ed5fe1517cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Development mode and fixed user
export const isDevelopment = true;
export const DEV_USER = {
  uid: 'ez-sa-beta-admin',
  email: 'admin@ez-sa-beta.com',
  displayName: 'EZ SA Beta Admin',
  photoURL: null
};