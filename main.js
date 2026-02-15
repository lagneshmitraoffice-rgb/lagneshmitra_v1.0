import { auth } from "/firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

const btn = document.getElementById("loginBtn");
const status = document.getElementById("status");

// 👇 STEP 1 — Button click
if (btn) {
  btn.onclick = () => {
    signInWithRedirect(auth, provider);
  };
}

// 👇 STEP 2 — VERY IMPORTANT (redirect result handler)
getRedirectResult(auth)
  .then((result) => {
    if (result?.user) {
      console.log("Redirect login success");
      window.location.href = "/ideology.html";
    }
  })
  .catch((err) => console.log(err));


// 👇 STEP 3 — Session detect (refresh ke baad)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User session active");
    if (window.location.pathname.includes("index")) {
      window.location.href = "/ideology.html";
    }
  }
});
