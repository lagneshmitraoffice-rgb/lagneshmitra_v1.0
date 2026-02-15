import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "PASTE_REAL_API_KEY",
  authDomain: "PASTE_REAL.firebaseapp.com",
  projectId: "PASTE_REAL",
  storageBucket: "PASTE_REAL.appspot.com",
  messagingSenderId: "PASTE_REAL",
  appId: "PASTE_REAL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
