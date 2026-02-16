import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("MAIN JS LOADED");

const provider = new GoogleAuthProvider();

window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("loginBtn"); // ⭐ correct ID

  if (!btn) {
    alert("Button not found → JS connected but ID mismatch");
    return;
  }

  alert("JS Connected Successfully 🚀");

  btn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert(err.message);
    }
  });

});

// redirect after login
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "/ideology.html";
  }
});
