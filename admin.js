import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const listDiv = document.getElementById("userList");

let users = [];
let selectedId = null;

/* LOAD USERS */
async function loadUsers(){
  const snap = await getDocs(collection(db,"lm_ideology_user_data"));
  users = [];
  listDiv.innerHTML = "";

  snap.forEach(docSnap=>{
    const data = docSnap.data();
    users.push({id:docSnap.id,...data});

    const div = document.createElement("div");
    div.className="userCard";
    div.innerHTML = `
      <b>${data.name}</b><br>
      ${data.whatsapp}
    `;

    div.onclick = ()=>loadIntoEditor(docSnap.id,data);
    listDiv.appendChild(div);
  });
}

loadUsers();

/* LOAD INTO EDITOR */
function loadIntoEditor(id,data){
  selectedId=id;
  lmId.value = data.lmId || "";
  name.value = data.name || "";
  whatsapp.value = data.whatsapp || "";
  dob.value = data.dob || "";
  tob.value = data.tob || "";
  pob.value = data.pob || "";
  country.value = data.country || "";
}

/* SAVE UPDATE */
saveBtn.onclick = async ()=>{
  const data = {
    lmId: lmId.value,
    name: name.value,
    whatsapp: whatsapp.value,
    dob: dob.value,
    tob: tob.value,
    pob: pob.value,
    country: country.value
  };

  if(selectedId){
    await updateDoc(doc(db,"lm_ideology_user_data",selectedId),data);
    alert("User Updated");
  }else{
    await addDoc(collection(db,"lm_ideology_user_data"),data);
    alert("User Added");
  }

  loadUsers();
};

/* NEW USER */
newUserBtn.onclick = ()=>{
  selectedId=null;
  document.querySelectorAll(".editor input").forEach(i=>i.value="");
};
