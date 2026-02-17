console.log("REAL VEDIC ASTRO ENGINE LOADED 🚀");

// ⭐ SWISSEPH FILES IN PUBLIC ROOT
import SwissEph from "/swisseph.js";

const $ = id => document.getElementById(id);

let swe = null;
let SWE_READY = false;

/* ===================================================
🚀 INIT SWISS EPHEMERIS (PUBLIC ROOT FINAL)
=================================================== */
async function initSwissEph(){
  try{
    swe = new SwissEph();

    // ⭐ VERY IMPORTANT
    // WASM + DATA load from ROOT
    await swe.initSwissEph({
      locateFile: file => "/" + file
    });

    SWE_READY = true;
    console.log("Swiss Ephemeris Ready ✅");
    $("resultBox").textContent = "Swiss Ephemeris Ready ✅";

  }catch(err){
    console.error("SwissEph FAILED:", err);
    $("resultBox").textContent =
      "❌ Swiss Ephemeris failed to load.\nCheck root path.";
  }
}
initSwissEph();

document.addEventListener("DOMContentLoaded", () => {
  $("generateBtn").addEventListener("click", generateChart);
});


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
🌌 LAHIRI AYANAMSA
=================================================== */
function getAyanamsa(JD){
  swe.set_sid_mode(swe.SE_SIDM_LAHIRI,0,0);
  return swe.get_ayanamsa_ut(JD);
}


/* ===================================================
☀️ REAL SUN
=================================================== */
function getRealSun(JD){
  const res = swe.calc_ut(JD, swe.SE_SUN, swe.SEFLG_SWIEPH);
  return res.longitude;
}


/* ===================================================
🌙 REAL MOON
=================================================== */
function getRealMoon(JD){
  const res = swe.calc_ut(JD, swe.SE_MOON, swe.SEFLG_SWIEPH);
  return res.longitude;
}


/* ================= HELPERS ================= */
function norm360(x){ x%=360; if(x<0)x+=360; return x; }

function degToSign(deg){
  const signs=[
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ];
  return `${signs[Math.floor(deg/30)]} ${(deg%30).toFixed(2)}°`;
}


/* ===================================================
🔥 MAIN GENERATOR
=================================================== */
async function generateChart(){

  if(!SWE_READY){
    alert("Swiss Ephemeris loading… wait 2 sec");
    return;
  }

  const dob=$("dob").value;
  const tob=$("tob").value;
  if(!dob||!tob){
    alert("DOB & TOB required");
    return;
  }

  const JD = getJulianDay(dob,tob);
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
