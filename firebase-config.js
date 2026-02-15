// 🔥 Firebase Core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

// 🔐 Firebase Auth
import { getAuth, GoogleAuthProvider } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


// ⭐ YOUR NEW FIREBASE PROJECT CONFIG
// (jo naya project banaya hai uska)
const firebaseConfig = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_AUTH_DOMAIN.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID"
};


// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Initialize Auth
const auth = getAuth(app);

// 🔥 Google Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });


// ⭐ EXPORT FOR APP
export { auth, provider };
