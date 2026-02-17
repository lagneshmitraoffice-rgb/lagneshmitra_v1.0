console.log("LOCAL SESSION ENGINE START 🚀");

/* ==================================================
   🧠 CHECK IF USER JOINED
================================================== */
export function isUserJoined() {
  return localStorage.getItem("lm_user_joined") === "yes";
}


/* ==================================================
   🚀 FORCE OPEN JOIN POPUP
================================================== */
export function openJoinPopup() {
  const popup = document.getElementById("onboardPopup");
  if (!popup) return;
  popup.style.display = "flex";
}


/* ==================================================
   💾 MARK USER AS JOINED
================================================== */
export function markUserJoined() {
  localStorage.setItem("lm_user_joined","yes");
}


/* ==================================================
   🚪 LOGOUT (CLEAR LOCAL SESSION)
================================================== */
export function logoutUser() {
  localStorage.removeItem("lm_user_joined");
  location.reload();
}
