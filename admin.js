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
let isNewUser = false;

const listDiv = $("userList");


/* =====================================
🆔 LM ID GENERATOR
LM + NAME(4) + NUMBER(4)
=====================================*/
function generateLMID(name,count){
  if(!name) name="USER";

  name = name.trim().split(" ")[0];
  let code = name.substring(0,4).toUpperCase();

  while(code.length < 4) code += "X";

  let num = String(count+1).padStart(4,"0");

  return "LM" + code + num;
}


/* =====================================
🔥 LOAD USERS FROM FIRESTORE
=====================================*/
async function loadUsers(){

  const snap = await getDocs(collection(db,"lm_ideology_user_data"));

  users = [];
  snap.forEach(d => users.push({ id:d.id, ...d.data() }));

  renderList();

  if(users.length>0) showUser(0);
}


/* =====================================
🔥 LEFT USER LIST
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


/* =====================================
⬅➡ NAVIGATION
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
➕ ADD NEW USER
=====================================*/
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


/* =====================================
🧠 AUTO LMID WHEN NAME TYPED
=====================================*/
$("name").addEventListener("input", ()=>{
  if(isNewUser){
    $("lmId").value = generateLMID($("name").value, users.length);
  }
});


/* =====================================
💾 SAVE USER (ADD OR UPDATE)
=====================================*/
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
