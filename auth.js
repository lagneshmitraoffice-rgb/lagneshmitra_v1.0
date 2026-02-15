console.log("AUTH ENGINE START 🔥");

import { auth } from "./firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

await setPersistence(auth, browserLocalPersistence);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });


// 🔥 LOGIN BUTTON CONNECT
export function connectGoogleLogin(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.onclick = () => {
    console.log("Redirecting to Google...");
    signInWithRedirect(auth, provider);
  };
}


// 🔥 THIS WAS MISSING !!!!!!!
export async function handleRedirectLogin() {
  try {
    const result = await getRedirectResult(auth);

    if (result?.user) {
      console.log("Redirect login success:", result.user.email);
    } else {
      console.log("No redirect result");
    }

  } catch (error) {
    console.error("Redirect error:", error);
  }
}


// 🔥 USER SESSION DETECTOR
export function detectUser(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
