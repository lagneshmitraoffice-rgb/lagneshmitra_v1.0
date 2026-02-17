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

const listDiv = $("userList");

let users = [];
let currentIndex = 0;
let currentDocId = null;
let isNewUser = false;


/* ================= LMID GENERATOR ================= */
function generateLMID(name,count){
  if(!name) name="USER";
  name = name.trim().split(" ")[0];

  let code = name.substring(0,4).toUpperCase();
  while(code.length < 4) code += "X";

  let num = String(count+1).padStart(4,"0");
  return "LM" + code + num;
}


/* ================= LOAD USERS FROM FIRESTORE ================= */
async function loadUsers(){

  listDiv.innerHTML = "Loading users...";

  try{
    const snap = await getDocs(collection(db,"lm_ideology_user_data"));

    users = [];
    snap.forEach(d => users.push({ id:d.id, ...d.data() }));

    if(users.length === 0){
      listDiv.innerHTML = "No users yet.";
      return;
    }

    renderList();
    showUser(0);

  }catch(err){
    console.error("Firestore load error:", err);
    listDiv.innerHTML = "❌ Firestore permission error";
  }
}


/* ================= RENDER LEFT LIST ================= */
function renderList(){
  listDiv.innerHTML = "";

  users.forEach((u,i)=>{
    const div = document.createElement("div");
    div.className="userCard";
    div.innerHTML = `<b>${u.name || "Unnamed"}</b><br>${u.whatsapp || ""}`;
    div.onclick = ()=> showUser(i);
    listDiv.appendChild(div);
  });
}


/* ================= SHOW USER ================= */
function showUser(index){
  if(users.length === 0) return;

  isNewUser = false;
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


/* ================= NAVIGATION ================= */
$("nextBtn").onclick = ()=>{
  if(currentIndex < users.length-1) showUser(currentIndex+1);
};

$("prevBtn").onclick = ()=>{
  if(currentIndex > 0) showUser(currentIndex-1);
};


/* ================= ADD NEW USER ================= */
$("newUserBtn").onclick = ()=>{
  isNewUser = true;
  currentDocId = null;

  $("lmId").value="";
  $("name").value="";
  $("whatsapp").value="";
  $("dob").value="";
  $("tob").value="";
  $("pob").value="";
  $("country").value="";
};


/* ================= AUTO LMID ================= */
$("name").addEventListener("input", ()=>{
  if(isNewUser){
    $("lmId").value = generateLMID($("name").value, users.length);
  }
});


/* ================= SAVE USER ================= */
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
    console.error("Save error:", err);
    alert("Firestore write error");
  }
};


/* ================= START ================= */
loadUsers();

});
