console.log("MAIN ENGINE START 🚀");

import {
  connectGoogleLogin,
  detectUser,
  handleRedirectLogin
} from "./auth.js";


// ⭐ MOST IMPORTANT LINE
await handleRedirectLogin();


// connect login button
connectGoogleLogin("loginBtn");


// detect login and redirect
detectUser((user) => {

  if (!user) {
    console.log("User not logged in");
    return;
  }

  console.log("User logged in:", user.email);

  const path = window.location.pathname;

  if (path === "/" || path.includes("index")) {
    window.location.href = "/ideology.html";
  }

});
