import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", async ()=>{

/* ========= SAFE GETTER ========= */
const $ = (id)=>document.getElementById(id);

/* ========= DOM ELEMENTS ========= */
const listDiv   = $("userList");
const nextBtn   = $("nextBtn");
const prevBtn   = $("prevBtn");
const newBtn    = $("newUserBtn");
const saveBtn   = $("saveBtn");

let users = [];
let currentIndex = 0;
let currentDocId = null;

/* ========= LOAD USERS ========= */
async function loadUsers(){
  console.log("Loading users from Firestore...");

  const snap = await getDocs(collection(db,"lm_ideology_user_data"));

  users = [];
  snap.forEach(d => users.push({ id:d.id, ...d.data() }));

  console.log("Users loaded:", users.length);

  renderList();

  if(users.length > 0) showUser(0);
}

/* ========= RENDER LEFT LIST ========= */
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

/* ========= SHOW USER ========= */
function showUser(index){
  const u = users[index];
  currentIndex = index;
  currentDocId = u.id;

  $("lmId").value = u.id;
  $("name").value = u.name || "";
  $("whatsapp").value = u.whatsapp || "";
  $("dob").value = u.dob || "";
  $("tob").value = u.tob || "";
  $("pob").value = u.pob || "";
  $("country").value = u.country || "";
}

/* ========= NAVIGATION ========= */
nextBtn.onclick = ()=>{
  if(currentIndex < users.length-1) showUser(currentIndex+1);
};

prevBtn.onclick = ()=>{
  if(currentIndex > 0) showUser(currentIndex-1);
};

/* ========= NEW USER ========= */
newBtn.onclick = ()=>{
  currentDocId = null;

  $("lmId").value="";
  $("name").value="";
  $("whatsapp").value="";
  $("dob").value="";
  $("tob").value="";
  $("pob").value="";
  $("country").value="";
};

/* ========= SAVE USER ========= */
saveBtn.onclick = async ()=>{

  const data = {
    name: $("name").value,
    whatsapp: $("whatsapp").value,
    dob: $("dob").value,
    tob: $("tob").value,
    pob: $("pob").value,
    country: $("country").value,
    updatedAt:
