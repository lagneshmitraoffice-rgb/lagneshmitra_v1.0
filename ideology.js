import { auth } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const db = getFirestore();


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

nextBtn.onclick = ()=>{
  if(current < images.length-1){ current++; updatePage(); }
};
prevBtn.onclick = ()=>{
  if(current > 0){ current--; updatePage(); }
};


/* =====================================
   🔐 AUTH GUARD + USER DATA INJECTION
===================================== */

const nameEl  = document.getElementById("userName");
const emailEl = document.getElementById("userEmail");
const photoEl = document.getElementById("userPhoto");

let currentUser = null;

onAuthStateChanged(auth, async (user)=>{

  if(!user){
    window.location.href = "/";
    return;
  }

  currentUser = user;

  nameEl.innerText  = user.displayName || "User";
  emailEl.innerText = user.email || "";
  photoEl.src = user.photoURL || "https://i.imgur.com/6VBx3io.png";

  /* 🔥 CHECK FIRESTORE PROFILE */
  const docRef = doc(db,"lm_ideology_user_data", user.uid);
  const docSnap = await getDoc(docRef);

  const popup = document.getElementById("onboardPopup");

  if(!docSnap.exists()){
    popup.style.display = "flex";   // first time user
  }else{
    popup.style.display = "none";   // existing user

    // update last login silently
    await setDoc(docRef,{
      lastLogin: serverTimestamp()
    },{merge:true});
  }

});


/* =====================================
   💾 SAVE PROFILE → FIRESTORE
===================================== */

const saveBtn = document.getElementById("saveProfile");

if(saveBtn){
  saveBtn.onclick = async ()=>{

    const name  = document.getElementById("fullName").value;
    const dob   = document.getElementById("dob").value;
    const tob   = document.getElementById("tob").value;
    const pob   = document.getElementById("pob").value;
    const country = document.getElementById("country").value;
    const whatsapp = document.getElementById("whatsapp").value;

    const partnerInterest  = document.getElementById("partnerInterest").checked;
    const whatsappConsent  = document.getElementById("whatsappConsent").checked;
    const updatesConsent   = document.getElementById("updatesConsent").checked;

    if(!name || !dob || !tob || !pob || !whatsapp || !country){
      alert("Please fill all required details");
      return;
    }

    try{

      const user = currentUser;

      await setDoc(doc(db,"lm_ideology_user_data", user.uid),{

        lmid: user.uid,
        name,
        email: user.email,
        whatsapp,
        country,
        dob,
        tob,
        pob,

        partnerInterest,
        whatsappConsent,
        updatesConsent,

        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()

      });

      document.getElementById("onboardPopup").style.display = "none";
      alert("Profile saved successfully 🚀");

    }catch(err){
      console.error(err);
      alert("Error saving profile");
    }

  };
}


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
