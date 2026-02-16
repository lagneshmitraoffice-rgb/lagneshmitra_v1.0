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


window.addEventListener("DOMContentLoaded", ()=>{

/* ==================================================
   🔥 SAFE ELEMENT GETTER (ANTI-CRASH)
================================================== */
const $ = (id)=>document.getElementById(id);


/* ==================================================
   🎞 IMAGE SLIDER
================================================== */
const images = [
  "Ideology1.jpg","Ideology2.jpg","Ideology3.jpg","Ideology4.jpg","Ideology5.jpg"
];

let current = 0;
const img = $("pageImage");
const indicator = $("pageIndicator");
const nextBtn = $("nextBtn");
const prevBtn = $("prevBtn");

function updatePage(){
  if(!img) return;
  img.src = images[current];
  indicator.innerText = `Page ${current+1} / ${images.length}`;
  prevBtn.style.opacity = current===0 ? "0.4":"1";
  nextBtn.style.opacity = current===images.length-1 ? "0.4":"1";
}
updatePage();

nextBtn.onclick=()=>{ if(current<images.length-1){ current++; updatePage(); }};
prevBtn.onclick=()=>{ if(current>0){ current--; updatePage(); }};


/* ==================================================
   🔐 AUTH + FIRESTORE ONBOARDING
================================================== */

const popup = $("onboardPopup");

onAuthStateChanged(auth, async (user)=>{

  if(!user){
    window.location.href="/";
    return;
  }

  /* Inject profile */
  $("userName").innerText  = user.displayName || "User";
  $("userEmail").innerText = user.email || "";
  $("userPhoto").src = user.photoURL || "https://i.imgur.com/6VBx3io.png";

  /* Check Firestore profile */
  const ref  = doc(db,"lm_ideology_user_data", user.uid);
  const snap = await getDoc(ref);

  if(!snap.exists()){
    popup.style.display="flex";   // NEW USER
  }else{
    popup.style.display="none";   // EXISTING USER
  }

});


/* ==================================================
   💾 SAVE PROFILE → FIRESTORE
================================================== */

$("saveProfile").onclick = async ()=>{

  const user = auth.currentUser;
  if(!user){ alert("Login expired. Refresh page."); return; }

  const data = {
    name: $("fullNameInput")?.value || "",
    email: user.email,
    whatsapp: $("whatsappInput")?.value || "",
    dob: $("dobInput")?.value || "",
    tob: $("tobInput")?.value || "",
    pob: $("pobInput")?.value || "",
    country: $("countryInput")?.value || "",
    partnerInterest: $("partnerCheck")?.checked || false,
    whatsappConsent: $("whatsappConsent")?.checked || false,
    updatesConsent: $("updatesConsent")?.checked || false,
    createdAt: serverTimestamp()
  };

  if(!data.name || !data.whatsapp || !data.dob || !data.tob || !data.pob){
    alert("Please fill mandatory fields");
    return;
  }

  await setDoc(doc(db,"lm_ideology_user_data", user.uid), data);

  popup.style.display="none";
  alert("Profile saved successfully 🚀");
};


/* ==================================================
   🚪 LOGOUT
================================================== */
$("logoutBtn").onclick = async ()=>{
  await signOut(auth);
  window.location.href="/";
};

});
