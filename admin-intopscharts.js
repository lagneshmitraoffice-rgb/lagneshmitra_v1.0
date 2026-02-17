console.log("Real Astro Engine Loaded 🚀");

const $ = id => document.getElementById(id);

/* ================= CLICK EVENT ================= */
$("generateBtn").addEventListener("click", generateChart);

/* ===================================================
   📅 JULIAN DAY CALCULATION (ACCURATE)
=================================================== */
function getJulianDay(dob, tob){

  const [year,month,day] = dob.split("-").map(Number);
  const [hour,min] = tob.split(":").map(Number);

  let Y = year;
  let M = month;

  if(M <= 2){
    Y -= 1;
    M += 12;
  }

  const A = Math.floor(Y/100);
  const B = 2 - A + Math.floor(A/4);

  const JD =
      Math.floor(365.25*(Y+4716))
    + Math.floor(30.6001*(M+1))
    + day + B - 1524.5
    + (hour + min/60)/24;

  return JD;
}

/* ================= DEG ↔ RAD ================= */
function deg2rad(d){ return d*Math.PI/180; }

/* ================= NORMALIZE 0-360 ================= */
function norm360(x){
  x = x % 360;
  if(x < 0) x += 360;
  return x;
}

/* ===================================================
   ☀️ REAL SUN LONGITUDE (Astronomy)
=================================================== */
function getSunLongitude(JD){

  const n = JD - 2451545.0;

  let L = 280.460 + 0.9856474 * n;   // mean longitude
  let g = 357.528 + 0.9856003 * n;   // mean anomaly

  L = norm360(L);
  g = norm360(g);

  const lambda =
      L
    + 1.915 * Math.sin(deg2rad(g))
    + 0.020 * Math.sin(deg2rad(2*g));

  return norm360(lambda); // tropical sun
}

/* ===================================================
   🌌 LAHIRI AYANAMSA (Approx 2025)
=================================================== */
function getLahiriAyanamsa(JD){
  return 24.0; // we refine later to dynamic
}

/* ===================================================
   🔥 MAIN CHART GENERATOR
=================================================== */
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

  const JD = getJulianDay(dob, tob);

  const tropicalSun = getSunLongitude(JD);
  const ayanamsa = getLahiriAyanamsa(JD);
  const siderealSun = norm360(tropicalSun - ayanamsa);

  const chartObject = {
    name,
    dob,
    tob,
    pob,
    country,

    JulianDay: JD.toFixed(6),

    Sun: {
      tropical: tropicalSun.toFixed(6) + "°",
      ayanamsa: ayanamsa + "°",
      sidereal: siderealSun.toFixed(6) + "°"
    }
  };

  $("resultBox").textContent =
    JSON.stringify(chartObject, null, 2);
}
