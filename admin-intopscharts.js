console.log("REAL VEDIC ASTRO ENGINE LOADED 🚀");

import SwissEph from "./astro/swisseph.js";

/* 🔥 CRITICAL — FORCE BROWSER MODE (Emscripten Fix) */
window.process = undefined;
window.require = undefined;
window.module  = undefined;
window.exports = undefined;
/* ------------------------------------------------ */

const $ = id => document.getElementById(id);

let swe = null;
let SWE_READY = false;

/* ===================================================
🚀 SWISS EPHEMERIS LOADER — FINAL ABSOLUTE PATH FIX
=================================================== */
async function initSwissEph(){
  try{
    swe = new SwissEph();

    // ⭐⭐ FINAL ABSOLUTE PATH SOLUTION ⭐⭐
    const BASE = window.location.origin + "/astro/";

    await swe.initSwissEph({
      scriptDirectory: BASE,
      wasmBinaryFile: BASE + "swisseph.wasm",
      dataFile: BASE + "swisseph.data",
      locateFile: file => BASE + file
    });

    SWE_READY = true;
    console.log("Swiss Ephemeris Ready ✅");
    $("resultBox").textContent = "Swiss Ephemeris Ready ✅";

  }catch(err){
    console.error("SwissEph FAILED:", err);
    $("resultBox").textContent =
      "❌ Swiss Ephemeris failed to load.\nCheck /astro path.";
  }
}
initSwissEph();


/* ===================================================
📅 JULIAN DAY (IST → UTC)
=================================================== */
function getJulianDay(dob, tob){

  const [year,month,day] = dob.split("-").map(Number);
  let [hour,min] = tob.split(":").map(Number);

  // IST → UTC
  hour -= 5;
  min  -= 30;
  if(min < 0){ min += 60; hour -= 1; }
  if(hour < 0){ hour += 24; }

  let Y = year;
  let M = month;
  if(M <= 2){ Y -= 1; M += 12; }

  const A = Math.floor(Y/100);
  const B = 2 - A + Math.floor(A/4);

  return Math.floor(365.25*(Y+4716))
    + Math.floor(30.6001*(M+1))
    + day + B - 1524.5
    + (hour + min/60)/24;
}


/* ===================================================
🌌 AYANAMSA + PLANETS (SWISS EPHEMERIS)
=================================================== */
function getAyanamsa(JD){
  swe.set_sid_mode(swe.SE_SIDM_LAHIRI,0,0);
  return swe.get_ayanamsa_ut(JD);
}

function getRealSun(JD){
  return swe.calc_ut(JD, swe.SE_SUN, swe.SEFLG_SWIEPH).longitude;
}

function getRealMoon(JD){
  return swe.calc_ut(JD, swe.SE_MOON, swe.SEFLG_SWIEPH).longitude;
}


/* ================= HELPERS ================= */
function norm360(x){ x%=360; if(x<0)x+=360; return x; }

function degToSign(deg){
  const signs=["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  return `${signs[Math.floor(deg/30)]} ${(deg%30).toFixed(2)}°`;
}


/* ===================================================
🔥 MAIN CHART GENERATOR
=================================================== */
async function generateChart(){

  if(!SWE_READY){
    alert("Swiss Ephemeris still loading… wait 2 sec");
    return;
  }

  const dob=$("dob").value;
  const tob=$("tob").value;

  if(!dob||!tob){
    alert("DOB & TOB required");
    return;
  }

  const JD   = getJulianDay(dob,tob);
  const ayan = getAyanamsa(JD);

  const sunSid  = norm360(getRealSun(JD)  - ayan);
  const moonSid = norm360(getRealMoon(JD) - ayan);

  $("resultBox").textContent = JSON.stringify({
    JulianDay: JD.toFixed(6),
    LahiriAyanamsa: ayan.toFixed(6)+"°",

    Sun:{
      SiderealDegree:sunSid.toFixed(6)+"°",
      ZodiacPosition:degToSign(sunSid)
    },

    Moon:{
      SiderealDegree:moonSid.toFixed(6)+"°",
      ZodiacPosition:degToSign(moonSid)
    }

  },null,2);
}


/* ===================================================
⭐ BUTTON CONNECT (FINAL)
=================================================== */
window.addEventListener("load", () => {

  const btn = document.getElementById("generateBtn");

  if(btn){
    btn.onclick = generateChart;
    console.log("Generate button connected ✅");
  }else{
    console.error("Generate button NOT FOUND ❌");
  }

});
