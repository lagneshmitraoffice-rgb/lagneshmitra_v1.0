import { auth, provider } from "./firebase-config.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const btn = document.getElementById("googleLogin");

btn.addEventListener("click", async () => {
  try {
    alert("Opening Google popup...");
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    alert("Welcome " + user.displayName);

    // redirect to ideology page
    window.location.href = "/ideology.html";

  } catch (error) {
    alert(error.message);
  }
});
