import { auth } from "/firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

await setPersistence(auth, browserLocalPersistence);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export function connectGoogleLogin(buttonId) {
  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.onclick = () => {
      signInWithRedirect(auth, provider);
    };
  });
}

export function detectUser(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
