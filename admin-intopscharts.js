console.log("Chart engine loaded 🚀");

import { toJulianDay, localToUTC } from "./julian.js";

const $ = id => document.getElementById(id);

$("generateBtn").addEventListener("click", generateChart);

/* =====================================================
   MAIN CHART GENERATOR
===================================================== */
function generateChart(){

  const name = $("name").value;
  const dob  = $("dob").value;
  const tob  = $("tob").value;
  const pob  = $("pob").value;
  const country = $("country").value;

  if(!dob || !tob){
    alert("DOB and TOB required");
    return;
  }

  /* 1️⃣ Convert Local Time → UTC */
  const utc = localToUTC(dob, tob);

  /* 2️⃣ Convert UTC → Julian Day */
  const JD = toJulianDay(
    utc.year,
    utc.month,
    utc.day,
    utc.utcHour,
    utc.utcMinute
  );

  /* 3️⃣ Output object (foundation of astro engine) */
  const chartObject = {
    name,
    dob,
    tob,
    pob,
    country,
    ayanamsa: "Lahiri",
    UTC_Time: `${utc.utcHour}:${utc.utcMinute}`,
    JulianDay: JD
  };

  $("resultBox").textContent =
      JSON.stringify(chartObject, null, 2);
}
