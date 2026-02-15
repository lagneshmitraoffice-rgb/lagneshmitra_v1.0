import { auth } from "./firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

alert("MAIN JS LOADED"); // mobile test

const provider = new GoogleAuthProvider();

window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("loginBtn");

  if (!btn) {
    alert("Button not found");
    return;
  }

  btn.onclick = async () => {
    try {
      alert("Opening Google popup...");
      const result = await signInWithPopup(auth, provider);
      alert("SUCCESS: " + result.user.email);
    }
    catch (err) {
      alert("ERROR: " + err.message);
      console.log(err);
    }
  };

});
