import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= SAFE GETTER ================= */
const $ = (id) => document.getElementById(id);

let users = [];
let currentIndex = 0;
let currentDocId = null;

/* ================= LOAD USERS ================= */
async function loadUsers(){
  try{
    const snap = await getDocs(collection(db,"lm_ideology_user_data"));

    users = [];
    snap.forEach(d => users.push({ id:d.id, ...d.data() }));

    renderList();

    if(users.length > 0){
      showUser(0);
    }

  }catch(err){
    console.error("Load error:", err);
  }
}

/* ================= RENDER USER LIST ================= */
function renderList(){
  const listDiv = $("userList");
  listDiv.innerHTML = "";

  users.forEach((u,i)=>{
    const div = document.createElement("div");
    div.className = "userCard";
    div.innerHTML = `<b>${u.name || "No Name"}</b>`;
    div.onclick = ()=> showUser(i);
    listDiv.appendChild(div);
  });
}

/* ================= SHOW USER IN EDITOR ================= */
function showUser(index){
  currentIndex = index;

  const u = users[index];
  currentDocId = u.id;

  $("lmId").value = u.id || "";
  $("name").value = u.name || "";
  $("whatsapp").value = u.whatsapp || "";
  $("dob").value = u.dob || "";
  $("tob").value = u.tob || "";
  $("pob").value = u.pob || "";
  $("country").value = u.country || "";
}

/* ================= NAV BUTTONS ================= */
$("nextBtn").onclick = ()=>{
  if(currentIndex < users.length - 1){
    showUser(currentIndex + 1);
  }
};

$("prevBtn").onclick = ()=>{
  if(currentIndex > 0){
    showUser(currentIndex - 1);
  }
};

/* ================= ADD NEW USER ================= */
$("addUserBtn").onclick = ()=>{
  currentDocId = null;

  $("lmId").value = "";
  $("name").value = "";
  $("whatsapp").value = "";
  $("dob").value = "";
  $("tob").value = "";
  $("pob").value = "";
  $("country").value = "";
};

/* ================= SAVE USER ================= */
$("saveBtn").onclick = async ()=>{

  const data = {
    name: $("name").value,
    whatsapp: $("whatsapp").value,
    dob: $("dob").value,
    tob: $("tob").value,
    pob: $("pob").value,
    country: $("country").value
  };

  try{

    if(currentDocId){
      await updateDoc(doc(db,"lm_ideology_user_data",currentDocId), data);
      alert("User Updated ✅");
    }else{
      await addDoc(collection(db,"lm_ideology_user_data"), data);
      alert("User Added 🚀");
    }

    loadUsers();

  }catch(err){
    console.error(err);
    alert("Save error");
  }
};

/* ================= START ================= */
window.addEventListener("DOMContentLoaded", loadUsers);
