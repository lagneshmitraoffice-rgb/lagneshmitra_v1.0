console.log("SWISS TEST START 🚀");

/* EMSCRIPTEN BROWSER FIX */
window.process = undefined;
window.require = undefined;
window.module  = undefined;
window.exports = undefined;

let swe = null;

async function testSwiss(){

  try{

    document.getElementById("resultBox").textContent =
      "Loading Swiss Ephemeris...";

    // wait until global script ready
    if(!window.SwissEph){
      throw new Error("SwissEph global not found");
    }

    swe = new window.SwissEph();

    await swe.initSwissEph({
      locateFile: file => "/" + file   // ⭐ ROOT PATH
    });

    document.getElementById("resultBox").textContent =
      "✅ SWISS EPHEMERIS LOADED SUCCESSFULLY";

    console.log("Swiss loaded");

  }catch(err){

    console.error(err);

    document.getElementById("resultBox").textContent =
      "❌ SWISS FAILED TO LOAD";
  }
}

window.onload = testSwiss;
