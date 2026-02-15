console.log("MAIN JS LOADED 🚀");

// Firebase auth import
import { auth } from "./firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


// 🔥 Mobile persistence (VERY IMPORTANT)
await setPersistence(auth, browserLocalPersistence);

// Google provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });


// 🔥 CONNECT LOGIN BUTTON
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM READY");

  const btn = document.getElementById("loginBtn");

  if (!btn) {
    alert("Login button NOT FOUND ❌");
    return;
  }

  alert("Login button connected ✅");

  btn.addEventListener("click", () => {
    alert("Redirecting to Google 🚀");
    signInWithRedirect(auth, provider);
  });
});


// 🔥 AFTER LOGIN REDIRECT
onAuthStateChanged(auth, (user) => {

  if (!user) {
    console.log("No user session");
    return;
  }

  console.log("User logged in:", user.email);

  window.location.href = "/ideology.html";
});
