import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


const $ = (id)=>document.getElementById(id);

let users = [];
let currentIndex = 0;
let currentDocId = null;

const listDiv = $("userList");


/* ==================================================
   🔥 LOAD USERS FROM FIRESTORE
================================================== */
async function loadUsers(){

  const snap = await getDocs(collection(db,"lm_ideology_user_data"));

  users = [];
  listDiv.innerHTML = "";

  snap.forEach((d)=>{
    users.push({id:d.id, ...d.data()});
  });

  users.forEach((u,i)=>{
    const div = document.createElement("div");
    div.className="userCard";
    div.innerHTML = `<b>${u.name}</b><br>${u.whatsapp}`;

    div.onclick = ()=> loadUserToEditor(i);

    listDiv.appendChild(div);
  });

  if(users.length) loadUserToEditor(0);
}

loadUsers();


/* ==================================================
   🔥 LOAD USER INTO EDITOR
================================================== */
function loadUserToEditor(index){

  const u = users[index];
  currentIndex = index;
  currentDocId = u.id;

  $("lmId").value = u.id || "";
  $("name").value = u.name || "";
  $("whatsapp").value = u.whatsapp || "";
  $("dob").value = u.dob || "";
  $("tob").value = u.tob || "";
  $("pob").value = u.pob || "";
  $("country").value = u.country || "";
}


/* ==================================================
   ⬅️➡️ NAV BUTTONS
================================================== */
$("prevBtn").onclick = ()=>{
  if(currentIndex>0) loadUserToEditor(currentIndex-1);
};

$("nextBtn").onclick = ()=>{
  if(currentIndex<users.length-1) loadUserToEditor(currentIndex+1);
};


/* ==================================================
   💾 SAVE CHANGES (UPDATE USER)
================================================== */
$("saveBtn").onclick = async ()=>{

  if(!currentDocId){
    alert("No user selected");
    return;
  }

  const data = {
    name: $("name").value,
    whatsapp: $("whatsapp").value,
    dob:
