console.log("REAL VEDIC ASTRO ENGINE LOADED 🚀");

const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  $("generateBtn").addEventListener("click", generateChart);
});


/* ===================================================
   📅 JULIAN DAY (IST → UTC)
=================================================== */
function getJulianDay(dob, tob){

  const [year,month,day] = dob.split("-").map(Number);
  let [hour,min] = tob.split(":").map(Number);

  // IST → UTC conversion
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
   🌙 HIGH PRECISION MOON LONGITUDE (Phase-1)
   Accuracy ≈ ±0.3°
=================================================== */
function getMoonLongitude(JD){

  const D = JD - 2451545.0;

  let L0 = 218.3164477 + 13.17639648 * D;
  let M  = 357.5291092 + 0.98560028 * D;
  let M1 = 134.9633964 + 13.06499295 * D;
  let Dm = 297.8501921 + 12.19074912 * D;
  let F  = 93.2720950  + 13.22935024 * D;

  L0 = norm360(L0);
  M  = norm360(M);
  M1 = norm360(M1);
  Dm = norm360(Dm);
  F  = norm360(F);

  let lon = L0;

  lon += 6.288774 * Math.sin(deg2rad(M1));
  lon += 1.274027 * Math.sin(deg2rad(2*Dm - M1));
  lon += 0.658314 * Math.sin(deg2rad(2*Dm));
  lon += 0.213618 * Math.sin(deg2rad(2*M1));
  lon -= 0.185116 * Math.sin(deg2rad(M));
  lon -= 0.114332 * Math.sin(deg2rad(2*F));

  lon += 0.058793 * Math.sin(deg2rad(2*(Dm - M1)));
  lon += 0.057066 * Math.sin(deg2rad(2*Dm - M - M1));
  lon += 0.053322 * Math.sin(deg2rad(2*Dm + M1));
  lon += 0.045758 * Math.sin(deg2rad(2*Dm - M));
  lon -= 0.040923 * Math.sin(deg2rad(M - M1));
  lon -= 0.034720 * Math.sin(deg2rad(Dm));
  lon -= 0.030383 * Math.sin(deg2rad(M + M1));
  lon += 0.015327 * Math.sin(deg2rad(2*(Dm - F)));
  lon -= 0.012528 * Math.sin(deg2rad(2*F + M1));
  lon += 0.010980 * Math.sin(deg2rad(2*F - M1));
  lon += 0.010675 * Math.sin(deg2rad(4*Dm - M1));
  lon += 0.010034 * Math.sin(deg2rad(3*M1));
  lon += 0.008548 * Math.sin(deg2rad(4*Dm - 2*M1));

  return norm360(lon);
}


/* ===================================================
   🌌 LAHIRI AYANAMSA
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

  const tropicalSun  = getSunLongitude(JD);
  const tropicalMoon = getMoonLongitude(JD);

  const siderealSun  = norm360(tropicalSun  - ayanamsa);
  const siderealMoon = norm360(tropicalMoon - ayanamsa);

  const chartObject = {
    name, dob, tob, pob, country,
    JulianDay: JD.toFixed(6),

    Sun: {
      SiderealDegree: siderealSun.toFixed(4)+"°",
      ZodiacPosition: degToSign(siderealSun)
    },

    Moon: {
      SiderealDegree: siderealMoon.toFixed(4)+"°",
      ZodiacPosition: degToSign(siderealMoon)
    },

    LahiriAyanamsa: ayanamsa.toFixed(6)+"°"
  };

  $("resultBox").textContent =
    JSON.stringify(chartObject, null, 2);
    }
