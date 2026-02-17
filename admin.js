import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", ()=>{

/* ================= SAFE GETTER ================= */
const $ = (id)=>document.getElementById(id);

let users = [];
let currentIndex = 0;
let currentDocId = null;

const listDiv = $("lmUserList");

/* =====================================================
🔥 LMID GENERATOR (NAME + MOBILE)
LM + first4letters(name) + first4digits(mobile)
Example → Abhishek + 97944 → LMABHI9794
=====================================================*/
function generateLMID(name,mobile){
  if(!name) name="USER";
  if(!mobile) mobile="0000000000";

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
    const snap = await getDocs(collection(db,"lm_ideology_user_data"));

    users = [];
    snap.forEach(d => users.push({ id:d.id, ...d.data() }));

    renderList();
    if(users.length > 0) showUser(0);

  }catch(err){
    console.error(err);
    alert("Error loading users");
  }
}

/* ================= LEFT USER LIST ================= */
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

/* ================= NAVIGATION ================= */
$("nextBtn").onclick = ()=>{ if(currentIndex < users.length-1) showUser(currentIndex+1); };
$("prevBtn").onclick = ()=>{ if(currentIndex > 0) showUser(currentIndex-1); };

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

/* =====================================================
🔥 AUTO LMID GENERATE WHEN NAME OR MOBILE CHANGES
=====================================================*/
$("name").addEventListener("input", autoGenerateLMID);
$("whatsapp").addEventListener("input", autoGenerateLMID);

function autoGenerateLMID(){
  const name = $("name").value;
  const mobile = $("whatsapp").value;
  if(name && mobile){
    $("lmId").value = generateLMID(name,mobile);
  }
}

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
    console.error(err);
    alert("Save error");
  }
};

/* =====================================================
📄 EXPORT PDF
=====================================================*/
$("exportPDF").onclick = ()=>{
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("LagneshMitra User Report",20,20);

  let y = 40;
  users.forEach(u=>{
    pdf.setFontSize(12);
    pdf.text(`Name: ${u.name}`,20,y); y+=8;
    pdf.text(`Mobile: ${u.whatsapp}`,20,y); y+=8;
    pdf.text(`LMID: ${u.lmID}`,20,y); y+=12;
  });

  pdf.save("LM_User_Report.pdf");
};

/* =====================================================
📊 EXPORT EXCEL
=====================================================*/
$("exportExcel").onclick = ()=>{
  const sheet = XLSX.utils.json_to_sheet(users);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Users");
  XLSX.writeFile(wb,"LM_Users.xlsx");
};

/* =====================================================
📝 EXPORT WORD
=====================================================*/
$("exportWord").onclick = ()=>{
  let html = "<h1>LagneshMitra Users</h1>";

  users.forEach(u=>{
    html += `<p><b>${u.name}</b><br>
    Mobile: ${u.whatsapp}<br>
    LMID: ${u.lmID}</p>`;
  });

  const blob = new Blob(['\ufeff', html], {type:'application/msword'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url;
  a.download="LM_Users.doc";
  a.click();
};

/* ================= START APP ================= */
loadUsers();

});
