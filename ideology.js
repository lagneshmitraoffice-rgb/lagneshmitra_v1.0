import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


window.addEventListener("DOMContentLoaded", ()=>{

/* ==================================================
   🔥 SAFE ELEMENT GETTER (NO CRASH)
================================================== */
const $ = (id)=>document.getElementById(id);


/* ==================================================
   🎞 IMAGE SLIDER
================================================== */
const images = [
  "Ideology1.jpg",
  "Ideology2.jpg",
  "Ideology3.jpg",
  "Ideology4.jpg",
  "Ideology5.jpg"
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

nextBtn?.addEventListener("click", ()=>{
  if(current<images.length-1){ current++; updatePage(); }
});

prevBtn?.addEventListener("click", ()=>{
  if(current>0){ current--; updatePage(); }
});


/* ==================================================
   🚀 ONBOARD POPUP CONTROL
================================================== */
const popup = $("onboardPopup");

// show popup only once per device
setTimeout(()=>{
  if(!localStorage.getItem("lm_user_joined")){
    popup.style.display="flex";
  }
},1500);


/* ==================================================
   💾 SAVE USER → FIRESTORE
================================================== */
$("saveProfile").onclick = async ()=>{

  const name  = $("fullNameInput")?.value.trim();
  const phone = $("whatsappInput")?.value.trim();
  const dob   = $("dobInput")?.value;
  const tob   = $("tobInput")?.value;
  const pob   = $("pobInput")?.value.trim();

  if(!name || !phone || !dob || !tob || !pob){
    alert("Please fill mandatory fields");
    return;
  }

  const data = {
    name: name,
    whatsapp: phone,
    dob: dob,
    tob: tob,
    pob: pob,
    country: $("countryInput")?.value.trim() || "",
    partnerInterest: $("partnerCheck")?.checked || false,
    whatsappConsent: $("whatsappConsent")?.checked || false,
    updatesConsent: $("updatesConsent")?.checked || false,
    createdAt: serverTimestamp(),
    source: "Ideology Page"
  };

  try{
    await addDoc(collection(db,"lm_ideology_user_data"), data);

    localStorage.setItem("lm_user_joined","yes");
    popup.style.display="none";

    alert("Profile saved successfully 🚀");

  }catch(err){
    console.error("Firestore Error:", err);
    alert("Error saving data. Check Firestore rules.");
  }

};

});
