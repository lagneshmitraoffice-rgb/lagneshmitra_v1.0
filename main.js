console.log("MAIN ENGINE START 🚀");

import { auth } from "./firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// 🔥 mobile persistence
await setPersistence(auth, browserLocalPersistence);

// Google provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });


// 🔘 CONNECT BUTTON
window.addEventListener("DOMContentLoaded", () => {
  console.log("Connecting login button...");

  const btn = document.getElementById("loginBtn");

  if (!btn) {
    console.log("Login button not found");
    return;
  }

  btn.onclick = () => {
    console.log("Redirecting to Google...");
    signInWithRedirect(auth, provider);
  };
});


// 👀 DETECT LOGIN
onAuthStateChanged(auth, (user) => {

  if (!user) {
    console.log("No session yet");
    return;
  }

  console.log("User logged in:", user.email);

  // redirect to ideology page
  window.location.href = "ideology.html";
});
