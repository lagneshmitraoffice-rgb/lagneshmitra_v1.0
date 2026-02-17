console.log("REAL VEDIC ASTRO ENGINE LOADED 🚀");

import SwissEph from "./astro/swisseph.js";

const $ = id => document.getElementById(id);

let swe = null;
let SWE_READY = false;

/* ===================================================
🚀 INIT SWISS EPHEMERIS
=================================================== */
async function initSwissEph(){
    swe = new SwissEph();

    await swe.initSwissEph({
        locateFile: file => "./astro/" + file
    });

    SWE_READY = true;
    console.log("Swiss Ephemeris Ready ✅");
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
🌌 LAHIRI AYANAMSA (Swiss Official)
=================================================== */
function getAyanamsa(JD){
   swe.set_sid_mode(swe.SE_SIDM_LAHIRI,0,0);
   return swe.get_ayanamsa_ut(JD);
}


/* ===================================================
☀️ REAL SUN (Swiss Ephemeris)
=================================================== */
function getRealSun(JD){
   const flag = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;
   const result = swe.calc_ut(JD, swe.SE_SUN, flag);
   return result[0]; // longitude
}


/* ===================================================
🌙 REAL MOON (Swiss Ephemeris)
=================================================== */
function getRealMoon(JD){
   const flag = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;
   const result = swe.calc_ut(JD, swe.SE_MOON, flag);
   return result[0]; // longitude
}


/* ================= HELPERS ================= */
function norm360(x){ x%=360; if(x<0)x+=360; return x; }

function degToSign(deg){
  const signs=["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  return `${signs[Math.floor(deg/30)]} ${(deg%30).toFixed(2)}°`;
}


/* ===================================================
🔥 MAIN GENERATOR — REAL NASA LEVEL
=================================================== */
async function generateChart(){

  if(!SWE_READY){
    alert("Swiss Ephemeris loading… wait 2 sec");
    return;
  }

  const dob=$("dob").value;
  const tob=$("tob").value;
  if(!dob||!tob){alert("DOB & TOB required");return;}

  const JD = getJulianDay(dob,tob);

  // 🌌 Ayanamsa
  const ayan = getAyanamsa(JD);

  // ☀️🌙 Tropical positions
  const sunTropical  = getRealSun(JD);
  const moonTropical = getRealMoon(JD);

  // ♓ Convert to Sidereal (Lahiri)
  const sunSid  = norm360(sunTropical  - ayan);
  const moonSid = norm360(moonTropical - ayan);

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
