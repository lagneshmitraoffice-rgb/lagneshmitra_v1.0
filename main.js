console.log("MAIN ENGINE START 🚀");

import { connectGoogleLogin, detectUser } from "/auth.js";

// connect login button
connectGoogleLogin("loginBtn");

// detect login + redirect
detectUser((user) => {
  if (!user) return;

  const path = window.location.pathname;

  if (path === "/" || path.includes("index")) {
    window.location.href = "/ideology.html";
  }
});
