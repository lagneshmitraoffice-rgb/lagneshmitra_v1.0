import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


window.addEventListener("DOMContentLoaded", ()=>{

/* ================= SAFE GETTER ================= */
const $ = (id)=>{
  const el = document.getElementById(id);
  if(!el) console.error("Missing element:", id);
  return el;
};

let users = [];
let currentIndex = 0;
let currentDocId = null;

const listDiv = $("lmUserList");


/* ================= UID → LMID ================= */
function generateLMIDfromUID(uid){
  let sum = 0;
  for(let i=0;i<uid.length;i++){
    sum += uid.charCodeAt(i);
  }

  let num = String(sum).slice(-6);
  while(num.length < 6) num = "0"+num;

  return "LM" + num;
}


/* ================= LOAD USERS ================= */
async function loadUsers(){
  try{
    const snap = await getDocs(collection(db,"lm_ideology_user_data"));

    users = [];
    snap.forEach(d => users.push({ id:d.id, ...d.data() }));

    renderList();

    if(users.length > 0) showUser(0);

  }catch(err){
    console.error("Firestore load error:", err);
    alert("Error loading users");
  }
}


/* ================= LEFT LIST ================= */
function renderList(){
  listDiv.innerHTML="";

  users.forEach((u,i)=>{
    const div = document.createElement("div");
    div.className="userCard";
    div.innerHTML = `<b>${u.name || "No Name"}</b><br>${u.whatsapp || ""}`;
    div.onclick = ()=> showUser(i);
    listDiv.appendChild(div);
  });
}


/* ================= SHOW USER ================= */
function showUser(index){

  currentIndex = index;
  const u = users[index];
  currentDocId = u.id;

  // 🔥 AUTO LMID FLASH FROM UID
  $("lmId").value = generateLMIDfromUID(u.id);

  $("name").value = u.name || "";
  $("whatsapp").value = u.whatsapp || "";
  $("dob").value = u.dob || "";
  $("tob").value = u.tob || "";
  $("pob").value = u.pob || "";
  $("country").value = u.country || "";
}


/* ================= NAVIGATION ================= */
$("nextBtn").onclick = ()=>{
  if(currentIndex < users.length-1) showUser(currentIndex+1);
};

$("prevBtn").onclick = ()=>{
  if(currentIndex > 0) showUser(currentIndex-1);
};


/* ================= ADD USER ================= */
$("addUserBtn").onclick = ()=>{
  currentDocId = null;

  $("lmId").value="";
  $("name").value="";
  $("whatsapp").value="";
  $("dob").value="";
  $("tob").value="";
  $("pob").value="";
  $("country").value="";
};


/* ================= SAVE USER ================= */
$("saveBtn").onclick = async ()=>{

  const data = {
    name: $("name").value,
    whatsapp: $("whatsapp").value,
    dob: $("dob").value,
    tob: $("tob").value,
    pob: $("pob").value,
    country: $("country").value,
    lmID: $("lmId").value   // ⭐ now LMID also saved
  };

  try{

    if(currentDocId){
      await updateDoc(doc(db,"lm_ideology_user_data",currentDocId),data);
      alert("User Updated ✅");
    }else{
      await addDoc(collection(db,"lm_ideology_user_data"),data);
      alert("User Added 🚀");
    }

    loadUsers();

  }catch(err){
    console.error(err);
    alert("Save error");
  }

};


/* ================= START APP ================= */
loadUsers();

});
