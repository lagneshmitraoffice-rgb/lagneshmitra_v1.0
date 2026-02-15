alert("MAIN JS LOADED");
console.log("MAIN JS LOADED 🚀");
import { connectGoogleLogin, detectUser } from "./auth.js";

connectGoogleLogin("loginBtn");

detectUser((user) => {
  if (!user) {
    document.body.innerHTML += "<p>Not logged in</p>";
    return;
  }

  document.body.innerHTML += `<h2>Welcome ${user.displayName}</h2>`;
});
