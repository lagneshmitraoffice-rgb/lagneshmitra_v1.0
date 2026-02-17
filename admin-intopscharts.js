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


/* ================= HELPERS ================= */
function deg2rad(d){ return d*Math.PI/180; }
function norm360(x){ x%=360; if(x<0)x+=360; return x; }

function degToSign(deg){
  const signs=["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  return `${signs[Math.floor(deg/30)]} ${(deg%30).toFixed(2)}°`;
}


/* ===================================================
🌌 LAHIRI AYANAMSA
=================================================== */
function getLahiriAyanamsa(JD){
  const t = (JD - 2451545.0)/36525;
  return 22.460148 + 1.396042*t + 0.000087*t*t;
}


/* ===================================================
🌍 ⭐ NUTATION (MISSING PIECE)
=================================================== */
function getNutationLongitude(JD){

  const T = (JD - 2451545.0)/36525;

  const L  = 280.4665 + 36000.7698*T;
  const L1 = 218.3165 + 481267.8813*T;
  const O  = 125.04452 - 1934.136261*T;

  const dPsi =
      -17.20*Math.sin(deg2rad(O))
      - 1.32*Math.sin(deg2rad(2*L))
      - 0.23*Math.sin(deg2rad(2*L1))
      + 0.21*Math.sin(deg2rad(2*O));

  return dPsi/3600; // arcsec → degrees
}


/* ===================================================
☀️ SUN LONGITUDE
=================================================== */
function getSunLongitude(JD){
  const n = JD - 2451545.0;
  let L = 280.460 + 0.9856474*n;
  let g = 357.528 + 0.9856003*n;

  L = norm360(L); g = norm360(g);

  return norm360(
    L + 1.915*Math.sin(deg2rad(g))
      + 0.020*Math.sin(deg2rad(2*g))
  );
}


/* ===================================================
🌙 MOON LONGITUDE (Meeus 20-term)
=================================================== */
function getMoonLongitude(JD){

  const D = JD - 2451545.0;

  let L0 = 218.3164477 + 13.17639648 * D;
  let M  = 357.5291092 + 0.98560028 * D;
  let M1 = 134.9633964 + 13.06499295 * D;
  let Dm = 297.8501921 + 12.19074912 * D;
  let F  = 93.2720950  + 13.22935024 * D;

  L0=norm360(L0); M=norm360(M); M1=norm360(M1); Dm=norm360(Dm); F=norm360(F);

  let lon=L0;

  lon+=6.288774*Math.sin(deg2rad(M1));
  lon+=1.274027*Math.sin(deg2rad(2*Dm-M1));
  lon+=0.658314*Math.sin(deg2rad(2*Dm));
  lon+=0.213618*Math.sin(deg2rad(2*M1));
  lon-=0.185116*Math.sin(deg2rad(M));
  lon-=0.114332*Math.sin(deg2rad(2*F));

  lon+=0.058793*Math.sin(deg2rad(2*(Dm-M1)));
  lon+=0.057066*Math.sin(deg2rad(2*Dm-M-M1));
  lon+=0.053322*Math.sin(deg2rad(2*Dm+M1));
  lon+=0.045758*Math.sin(deg2rad(2*Dm-M));
  lon-=0.040923*Math.sin(deg2rad(M-M1));
  lon-=0.034720*Math.sin(deg2rad(Dm));
  lon-=0.030383*Math.sin(deg2rad(M+M1));
  lon+=0.015327*Math.sin(deg2rad(2*(Dm-F)));
  lon-=0.012528*Math.sin(deg2rad(2*F+M1));
  lon+=0.010980*Math.sin(deg2rad(2*F-M1));
  lon+=0.010675*Math.sin(deg2rad(4*Dm-M1));
  lon+=0.010034*Math.sin(deg2rad(3*M1));
  lon+=0.008548*Math.sin(deg2rad(4*Dm-2*M1));

  return norm360(lon);
}


/* ===================================================
🔥 MAIN GENERATOR
=================================================== */
function generateChart(){

  const dob=$("dob").value;
  const tob=$("tob").value;
  if(!dob||!tob){alert("DOB & TOB required");return;}

  const JD=getJulianDay(dob,tob);
  const ayan=getLahiriAyanamsa(JD);
  const nutation=getNutationLongitude(JD);

  const sun  = getSunLongitude(JD)  + nutation;
  const moon = getMoonLongitude(JD) + nutation;

  const sidSun  = norm360(sun  - ayan);
  const sidMoon = norm360(moon - ayan);

  $("resultBox").textContent = JSON.stringify({
    JulianDay: JD.toFixed(6),
    Nutation: nutation.toFixed(6)+"°",
    Sun:{SiderealDegree:sidSun.toFixed(4)+"°",ZodiacPosition:degToSign(sidSun)},
    Moon:{SiderealDegree:sidMoon.toFixed(4)+"°",ZodiacPosition:degToSign(sidMoon)}
  },null,2);
}
