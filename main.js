// main.js
import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

const btn = document.getElementById("googleLogin");

btn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    alert(err.message);
  }
});

// Auto redirect if logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "/ideology.html";
  }
});
