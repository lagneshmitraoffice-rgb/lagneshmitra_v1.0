import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const $ = (id)=>document.getElementById(id);

let users = [];
let currentIndex = 0;
let currentDocId = null;

const listDiv = $("lmUserList");

/* =====================================
🔥 LOAD USERS FROM FIRESTORE
=====================================*/
async function loadUsers(){
  const snap = await getDocs(collection(db,"lm_ideology_user_data"));

  users = [];
  snap.forEach(d => users.push({ id:d.id, ...d.data() }));

  renderList();
  showUser(0);
}

/* =====================================
🔥 RENDER LEFT USER LIST
=====================================*/
function renderList(){
  listDiv.innerHTML="";

  users.forEach((u,i)=>{
    const div = document.createElement("div");
    div.className="userCard";
    div.innerHTML = `<b>${u.name}</b><br>${u.whatsapp}`;
    div.onclick = ()=> showUser(i);
    listDiv.appendChild(div);
  });
}

/* =====================================
🔥 SHOW USER IN EDITOR
=====================================*/
function showUser(index){
  if(users.length===0) return;

  currentIndex = index;
  const u = users[index];
  currentDocId = u.id;

  $("lmId").value = u.id;
  $("name").value = u.name || "";
  $("whatsapp").value = u.whatsapp || "";
  $("dob").value = u.dob || "";
  $("tob").value = u.tob || "";
  $("pob").value = u.pob || "";
  $("country").value = u.country || "";
}

/* =====================================
🔥 NAV BUTTONS
=====================================*/
$("nextBtn").onclick = ()=>{
  if(currentIndex < users.length-1){
    showUser(currentIndex+1);
  }
};

$("prevBtn").onclick = ()=>{
  if(currentIndex > 0){
    showUser(currentIndex-1);
  }
};

/* =====================================
🔥 ADD NEW USER
=====================================*/
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

/* =====================================
🔥 SAVE USER (ADD OR UPDATE)
=====================================*/
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
      // UPDATE
      await updateDoc(doc(db,"lm_ideology_user_data",currentDocId),data);
      alert("User Updated ✅");
    }else{
      // ADD NEW
      await addDoc(collection(db,"lm_ideology_user_data"),data);
      alert("User Added 🚀");
    }

    loadUsers();

  }catch(err){
    alert("Save error");
    console.error(err);
  }
};

loadUsers();
