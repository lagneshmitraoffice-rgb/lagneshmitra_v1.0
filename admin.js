import { db } from "./firebase-config.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", async ()=>{

  const box = document.getElementById("userList");
  box.innerHTML = "Loading from Firestore...";

  try{

    const snap = await getDocs(collection(db,"lm_ideology_user_data"));

    let output = "";

    snap.forEach(doc => {
      const data = doc.data();
      console.log(data); // 🔥 console debug

      // ONLY NAME FIELD
      output += `<div style="padding:10px;border:1px solid #444;margin:5px">
                  ${data.name}
                 </div>`;
    });

    if(output==="") output="No data found";
    box.innerHTML = output;

  }catch(err){
    console.error(err);
    box.innerHTML = "❌ Firestore read failed";
  }

});
