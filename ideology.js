import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

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

  /* disable buttons at edges */
  prevBtn.style.opacity = current === 0 ? "0.4" : "1";
  nextBtn.style.opacity = current === images.length-1 ? "0.4" : "1";
}

updatePage();

/* NEXT */
nextBtn.onclick = ()=>{
  if(current < images.length-1){
    current++;
    updatePage();
  }
};

/* PREVIOUS */
prevBtn.onclick = ()=>{
  if(current > 0){
    current--;
    updatePage();
  }
};


/* =====================================
   🔐 AUTH GUARD + USER DATA INJECTION
===================================== */

const nameEl  = document.getElementById("userName");
const emailEl = document.getElementById("userEmail");
const photoEl = document.getElementById("userPhoto");

onAuthStateChanged(auth,(user)=>{

  /* 🚫 NOT LOGGED IN → BACK TO LOGIN */
  if(!user){
    window.location.href = "/";
    return;
  }

  /* 👤 USER INFO SAFE INJECTION */
  nameEl.innerText  = user.displayName || "User";
  emailEl.innerText = user.email || "";

  /* Google photo fallback */
  if(user.photoURL){
    photoEl.src = user.photoURL;
  }else{
    photoEl.src = "https://i.imgur.com/6VBx3io.png"; // default avatar
  }

});


/* =====================================
   🚪 LOGOUT SYSTEM
===================================== */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.onclick = async ()=>{
  try{
    await signOut(auth);
    window.location.href = "/";
  }
  catch(err){
    alert("Logout error");
    console.error(err);
  }
};
