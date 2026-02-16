import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

/* 🔥 IMAGE SLIDER */
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

function updatePage(){
  img.src = images[current];
  indicator.innerText = `Page ${current+1} / ${images.length}`;
}
updatePage();

document.getElementById("nextBtn").onclick=()=>{
  if(current < images.length-1){ current++; updatePage(); }
};
document.getElementById("prevBtn").onclick=()=>{
  if(current > 0){ current--; updatePage(); }
};

/* 🔐 LOGIN GUARD */
onAuthStateChanged(auth,(user)=>{
  if(!user){
    window.location.href="/";
    return;
  }

  document.getElementById("userName").innerText=user.displayName;
  document.getElementById("userEmail").innerText=user.email;
  document.getElementById("userPhoto").src=user.photoURL;
});

/* 🚪 LOGOUT */
document.getElementById("logoutBtn").onclick=async ()=>{
  await signOut(auth);
  window.location.href="/";
};
