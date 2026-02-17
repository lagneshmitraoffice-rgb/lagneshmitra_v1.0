console.log("MAIN ENGINE START 🚀");

import { isUserJoined, openJoinPopup } from "./auth.js";

/* =========================================
   WAIT FOR PAGE LOAD
========================================= */
window.addEventListener("DOMContentLoaded", () => {

  console.log("DOM READY");

  // Check local session
  const joined = isUserJoined();

  if (!joined) {
    console.log("New visitor → opening join popup");
    openJoinPopup();
  } else {
    console.log("Returning user");
  }

});
