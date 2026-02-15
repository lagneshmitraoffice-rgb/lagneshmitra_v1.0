alert("MAIN JS LOADED");
console.log("MAIN JS LOADED 🚀");

// Firebase import
import { auth, provider } from "/firebase-config.js";

import {
  signInWithRedirect,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


// 🔐 Mobile persistence (very important)
await setPersistence(auth, browserLocalPersistence);


// 🔘 CONNECT GOOGLE BUTTON
window.addEventListener("DOMContentLoaded", () => {

  console.log("DOM READY");

  const btn = document.getElementById("loginBtn");

  if (!btn) {
    console.log("Login button not found");
    return;
  }

  console.log("Login button connected ✅");

  btn.onclick = async () => {
    console.log("Redirecting to Google...");
    await signInWithRedirect(auth, provider);
  };

});


// ⭐ LOGIN DETECTOR + REDIRECT ENGINE
onAuthStateChanged(auth, (user) => {

  if (!user) {
    console.log("User not logged in");
    return;
  }

  console.log("User logged in:", user.email);

  // 🚀 Redirect to ideology page
  window.location.href = "/ideology.html";

});
