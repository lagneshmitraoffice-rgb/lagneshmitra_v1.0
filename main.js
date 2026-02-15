alert("MAIN JS LOADED");
console.log("MAIN JS LOADED 🚀");

// Firebase
import { auth } from "./firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// ⭐ Mobile persistence (important)
await setPersistence(auth, browserLocalPersistence);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });


// =============================
// 🔥 CONNECT GOOGLE BUTTON
// =============================
window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("googleLoginBtn");
  if (!btn) return;

  console.log("Google button connected");

  btn.onclick = () => {
    console.log("Redirecting to Google...");
    signInWithRedirect(auth, provider);
  };
});


// =============================
// 💥 MOST IMPORTANT PART 💥
// Detect RETURN from Google login
// =============================
getRedirectResult(auth)
  .then((result) => {

    if (!result) {
      console.log("No redirect result");
      return;
    }

    console.log("🔥 Returned from Google login");

    // ⭐ redirect after successful login
    window.location.href = "/ideology.html";

  })
  .catch((error) => {
    console.error("Redirect error:", error);
  });


// =============================
// 🔐 SESSION CHECK (refresh case)
// =============================
onAuthStateChanged(auth, (user) => {

  if (!user) {
    console.log("No session");
    return;
  }

  console.log("User session active:", user.email);

  const path = window.location.pathname;

  // If already logged in and opens home page → redirect
  if (path === "/" || path.includes("index")) {
    window.location.href = "/ideology.html";
  }

});
