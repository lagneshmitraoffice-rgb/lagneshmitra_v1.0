// firebase-config.js

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { getAuth } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDxefsDzhoQyDv2X339PBEqy2o1q2hYf7U",
  authDomain: "lagneshmitra-98176.firebaseapp.com",
  projectId: "lagneshmitra-98176",
  storageBucket: "lagneshmitra-98176.firebasestorage.app",
  messagingSenderId: "1046880553468",
  appId: "1:1046880553468:web:1f23caef22f08b84304a79"
};

/* 🔥 INIT APP */
const app = initializeApp(firebaseConfig);

/* 🔐 AUTH */
export const auth = getAuth(app);

/* 🧠 FIRESTORE */
export const db = getFirestore(app);
