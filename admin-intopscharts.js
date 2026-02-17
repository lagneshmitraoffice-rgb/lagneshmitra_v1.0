const $ = (id)=>document.getElementById(id);

$("#generateBtn").onclick = ()=>{

  const name = $("#name").value.trim();
  const dob  = $("#dob").value;
  const tob  = $("#tob").value;
  const pob  = $("#pob").value.trim();
  const country = $("#country").value.trim();

  if(!name || !dob || !tob || !pob){
    alert("Please fill all mandatory fields");
    return;
  }

  /* ================================
     🔥 STEP 1 – BUILD INPUT OBJECT
  =================================*/
  const birthData = {
    name,
    dob,
    tob,
    pob,
    country,
    timestamp: new Date().toISOString()
  };


  /* ================================
     🔥 STEP 2 – CONVERT TO JULIAN DATE (BASIC)
     (real engine later replace करेगा)
  =================================*/
  const dateObj = new Date(`${dob}T${tob}`);
  const julianDay = (dateObj / 86400000) + 2440587.5;


  /* ================================
     🔥 STEP 3 – FAKE PLANET ENGINE
     (placeholder until Swiss ephemeris)
  =================================*/
  const chart = {
    lagna: "Calculating…",
    sun: "Calculating…",
    moon: "Calculating…",
    mars: "Calculating…",
    mercury: "Calculating…",
    venus: "Calculating…",
    jupiter: "Calculating…",
    saturn: "Calculating…",
    rahu: "Calculating…",
    ketu: "Calculating…"
  };


  /* ================================
     FINAL OBJECT (PIPELINE READY)
  =================================*/
  const finalObject = {
    birthData,
    julianDay,
    ayanamsa: "Lahiri",
    zodiac: "Sidereal",
    houseSystem: "Whole Sign",
    chart
  };


  $("#resultBox").textContent =
    JSON.stringify(finalObject, null, 2);

};
