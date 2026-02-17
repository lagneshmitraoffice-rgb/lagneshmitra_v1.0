import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


window.addEventListener("DOMContentLoaded", ()=>{

/* ==================================================
   🔥 SAFE ELEMENT GETTER
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
  img.src = images[current];
  indicator.innerText = `Page ${current+1} / ${images.length}`;
  prevBtn.style.opacity = current===0 ? "0.4":"1";
  nextBtn.style.opacity = current===images.length-1 ? "0.4":"1";
}
updatePage();

nextBtn.onclick=()=>{ if(current<images.length-1){ current++; updatePage(); }};
prevBtn.onclick=()=>{ if(current>0){ current--; updatePage(); }};


/* ==================================================
   🚀 SHOW POPUP AFTER 2 SECONDS (FIRST VISIT)
================================================== */
const popup = $("onboardPopup");

setTimeout(()=>{
  if(!localStorage.getItem("lm_user_joined")){
    popup.style.display="flex";
  }
},2000);


/* ==================================================
   💾 SAVE USER → FIRESTORE
================================================== */

$("saveProfile").onclick = async ()=>{

  const data = {
    name: $("fullNameInput").value.trim(),
    whatsapp: $("whatsappInput").value.trim(),
    dob: $("dobInput").value,
    tob: $("tobInput").value,
    pob: $("pobInput").value.trim(),
    country: $("countryInput").value.trim(),
    partnerInterest: $("partnerCheck").checked,
    whatsappConsent: $("whatsappConsent").checked,
    updatesConsent: $("updatesConsent").checked,
    createdAt: serverTimestamp()
  };

  if(!data.name || !data.whatsapp || !data.dob || !data.tob || !data.pob){
    alert("Please fill mandatory fields");
    return;
  }

  try{

    await addDoc(collection(db,"lm_ideology_user_data"), data);

    localStorage.setItem("lm_user_joined","yes");
    popup.style.display="none";

    alert("Welcome to LagneshMitra 🚀");

  }catch(err){
    alert("Error saving data");
    console.error(err);
  }

};

});
