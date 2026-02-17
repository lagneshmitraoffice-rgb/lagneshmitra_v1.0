console.log("Real Astro Engine Loaded 🚀");

const $ = id => document.getElementById(id);
$("generateBtn").addEventListener("click", generateChart);

/* ===================================================
   📅 JULIAN DAY (IST → UTC FIXED)
=================================================== */
function getJulianDay(dob, tob){

  const [year,month,day] = dob.split("-").map(Number);
  let [hour,min] = tob.split(":").map(Number);

  // ⭐ IST → UTC conversion
  hour -= 5;
  min  -= 30;
  if(min < 0){ min += 60; hour -= 1; }
  if(hour < 0){ hour += 24; }

  let Y = year;
  let M = month;

  if(M <= 2){ Y -= 1; M += 12; }

  const A = Math.floor(Y/100);
  const B = 2 - A + Math.floor(A/4);

  const JD =
      Math.floor(365.25*(Y+4716))
    + Math.floor(30.6001*(M+1))
    + day + B - 1524.5
    + (hour + min/60)/24;

  return JD;
}

/* ================= HELPERS ================= */
function deg2rad(d){ return d*Math.PI/180; }

function norm360(x){
  x = x % 360;
  if(x < 0) x += 360;
  return x;
}

function degToSign(deg){
  const signs = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ];
  const signIndex = Math.floor(deg / 30);
  const signDegree = deg % 30;
  return `${signs[signIndex]} ${signDegree.toFixed(2)}°`;
}

/* ===================================================
   ☀️ SUN LONGITUDE (Astronomy)
=================================================== */
function getSunLongitude(JD){

  const n = JD - 2451545.0;

  let L = 280.460 + 0.9856474 * n;
  let g = 357.528 + 0.9856003 * n;

  L = norm360(L);
  g = norm360(g);

  const lambda =
      L
    + 1.915 * Math.sin(deg2rad(g))
    + 0.020 * Math.sin(deg2rad(2*g));

  return norm360(lambda);
}

/* ===================================================
   🌙 MOON LONGITUDE (Meeus simplified)
=================================================== */
function getMoonLongitude(JD){

  const D = JD - 2451545.0;

  let L = 218.316 + 13.176396 * D;
  let D_moon = 297.850 + 12.190749 * D;
  let M = 357.529 + 0.98560028 * D;
  let M_moon = 134.963 + 13.064993 * D;
  let F = 93.272 + 13.229350 * D;

  L = norm360(L);
  D_moon = norm360(D_moon);
  M = norm360(M);
  M_moon = norm360(M_moon);
  F = norm360(F);

  const lon =
      L
    + 6.289 * Math.sin(deg2rad(M_moon))
    + 1.274 * Math.sin(deg2rad(2*D_moon - M_moon))
    + 0.658 * Math.sin(deg2rad(2*D_moon))
    + 0.214 * Math.sin(deg2rad(2*M_moon))
    - 0.186 * Math.sin(deg2rad(M))
    - 0.114 * Math.sin(deg2rad(2*F));

  return norm360(lon);
}

/* ===================================================
   🌌 LAHIRI AYANAMSA (Dynamic)
=================================================== */
function getLahiriAyanamsa(JD){
  const t = (JD - 2451545.0) / 36525;
  return 22.460148 + 1.396042*t + 0.000087*t*t;
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
  const ayanamsa = getLahiriAyanamsa(JD);

  /* ☀️ SUN */
  const tropicalSun = getSunLongitude(JD);
  const siderealSun = norm360(tropicalSun - ayanamsa);

  /* 🌙 MOON */
  const tropicalMoon = getMoonLongitude(JD);
  const siderealMoon = norm360(tropicalMoon - ayanamsa);

  const chartObject = {
    name, dob, tob, pob, country,
    JulianDay: JD.toFixed(6),

    Sun: {
      TropicalDegree: tropicalSun.toFixed(6)+"°",
      SiderealDegree: siderealSun.toFixed(6)+"°",
      ZodiacPosition: degToSign(siderealSun)
    },

    Moon: {
      TropicalDegree: tropicalMoon.toFixed(6)+"°",
      SiderealDegree: siderealMoon.toFixed(6)+"°",
      ZodiacPosition: degToSign(siderealMoon)
    },

    LahiriAyanamsa: ayanamsa.toFixed(6)+"°"
  };

  $("resultBox").textContent =
    JSON.stringify(chartObject, null, 2);
}
