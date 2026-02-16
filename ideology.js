import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


/* =====================================
   🔥 WAIT FOR DOM (CRITICAL FIX)
===================================== */
window.addEventListener("DOMContentLoaded", ()=>{


/* =====================================
   🔥 IMAGE SLIDER ENGINE
===================================== */

const images = [
  "Ideology1.jpg",
  "Ideology2.jpg",
  "Ideology3.jpg",
  "Ideology4.jpg",
  "Ideology5.jpg"
];

let current = 0;

const img = document.getElementById("pageImage");
const indicator = document.getElementById("pageIndicator");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

function updatePage(){
  img.src = images[current];
  indicator.innerText = `Page ${current+1} / ${images.length}`;
  prevBtn.style.opacity = current === 0 ? "0.4" : "1";
  nextBtn.style.opacity = current === images.length-1 ? "0.4" : "1";
}
updatePage();

nextBtn.onclick = ()=>{ if(current < images.length-1){ current++; updatePage(); } };
prevBtn.onclick = ()=>{ if(current > 0){ current--; updatePage(); } };


/* =====================================
   🔐 AUTH + FIRESTORE ONBOARDING (FINAL)
===================================== */

const nameEl  = document.getElementById("userName");
const emailEl = document.getElementById("userEmail");
const photoEl = document.getElementById("userPhoto");
const popup   = document.getElementById("onboardPopup");

onAuthStateChanged(auth, async (user)=>{

  if(!user){
    window.location.href="/";
    return;
  }

  /* 👤 Inject user */
  nameEl.innerText  = user.displayName || "User";
  emailEl.innerText = user.email || "";
  photoEl.src = user.photoURL || "https://i.imgur.com/6VBx3io.png";

  /* 🔥 FIRESTORE PROFILE CHECK */
  const ref  = doc(db,"lm_ideology_user_data", user.uid);
  const snap = await getDoc(ref);

  if(!snap.exists()){
    popup.style.display = "flex";   // NEW USER
  }else{
    popup.style.display = "none";   // EXISTING USER
  }

});


/* =====================================
   💾 SAVE PROFILE → FIRESTORE
===================================== */

document.getElementById("saveProfile").onclick = async ()=>{

  const user = auth.currentUser;

  const data = {
    name: document.getElementById("fullNameInput").value,
    email: document.getElementById("emailInput").value,
    whatsapp: document.getElementById("whatsappInput").value,
    dob: document.getElementById("dobInput").value,
    tob: document.getElementById("tobInput").value,
    pob: document.getElementById("pobInput").value,
    country: document.getElementById("countryInput").value,
    partnerInterest: document.getElementById("partnerCheck").checked,
    whatsappConsent: document.getElementById("whatsappConsent").checked,
    updatesConsent: document.getElementById("updatesConsent").checked,
    createdAt: serverTimestamp()
  };

  if(!data.name || !data.whatsapp || !data.dob || !data.tob || !data.pob){
    alert("Please fill mandatory fields");
    return;
  }

  await setDoc(doc(db,"lm_ideology_user_data", user.uid), data);
  popup.style.display="none";

};


/* =====================================
   🚪 LOGOUT
===================================== */

document.getElementById("logoutBtn").onclick = async ()=>{
  await signOut(auth);
  window.location.href="/";
};


}); // DOM LOADED END
