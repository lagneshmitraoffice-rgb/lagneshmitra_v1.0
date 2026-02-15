import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

export function connectGoogleLogin(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.onclick = () => {
    console.log("Redirecting to Google...");
    signInWithRedirect(auth, provider);
  };
}

// detect login AFTER returning from Google
export async function detectUser(callback) {

  // when coming back from Google
  const result = await getRedirectResult(auth);
  if (result?.user) {
    console.log("Returned from Google:", result.user.email);
  }

  // detect active session
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
