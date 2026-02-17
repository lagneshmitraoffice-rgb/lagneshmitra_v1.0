import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", async ()=>{

const $ = (id)=>document.getElementById(id);

let users = [];
let currentIndex = 0;
let currentDocId = null;

const listDiv = $("lmUserList");

/* 🔥 LMID GENERATOR */
function generateLMID(name,mobile){
  if(!name) name="USER";
  if(!mobile) mobile="0000";

  let firstName = name.trim().split(" ")[0].toUpperCase();
  let namePart = firstName.substring(0,4);
  while(namePart.length < 4) namePart += "X";

  let mobilePart = mobile.substring(0,4);
  while(mobilePart.length < 4) mobilePart += "0";

  return "LM" + namePart + mobilePart;
}

/* ================= LOAD USERS ================= */
async function loadUsers(){

  try{
    const querySnapshot = await getDocs(collection(db,"lm_ideology_user_data"));

    users = [];
    querySnapshot.forEach((docSnap)=>{
      users.push({ id:docSnap.id, ...docSnap.data() });
    });

    renderList();

    if(users.length > 0){
      showUser(0);
    }

  }catch(error){
    console.error("Firestore error:", error);
    alert("Firestore connection failed ❌");
  }
}

/* ================= RENDER LIST ================= */
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

  $("lmId").value = u.lmID || "";
  $("name").value = u.name || "";
  $("whatsapp").value = u.whatsapp || "";
  $("dob").value = u.dob || "";
  $("tob").value = u.tob || "";
  $("pob").value = u.pob || "";
  $("country").value = u.country || "";
}

/* NAV */
$("nextBtn").onclick = ()=>{ if(currentIndex < users.length-1) showUser(currentIndex+1); };
$("prevBtn").onclick = ()=>{ if(currentIndex > 0) showUser(currentIndex-1); };

/* ADD USER */
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

/* AUTO LMID */
$("name").addEventListener("input", autoLMID);
$("whatsapp").addEventListener("input", autoLMID);

function autoLMID(){
  const name = $("name").value;
  const mobile = $("whatsapp").value;
  if(name && mobile){
    $("lmId").value = generateLMID(name,mobile);
  }
}

/* SAVE USER */
$("saveBtn").onclick = async ()=>{
  const data = {
    lmID: $("lmId").value,
    name: $("name").value,
    whatsapp: $("whatsapp").value,
    dob: $("dob").value,
    tob: $("tob").value,
    pob: $("pob").value,
    country: $("country").value
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
    alert("Save failed");
  }
};

loadUsers();

});
