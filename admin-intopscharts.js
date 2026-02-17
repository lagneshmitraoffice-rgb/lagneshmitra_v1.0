console.log("Chart engine loaded 🚀");

const $ = id => document.getElementById(id);

/* =====================================================
BUTTON CLICK
=====================================================*/
$("generateBtn").addEventListener("click", generateChart);


/* =====================================================
MAIN ENGINE
=====================================================*/
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

  // Split DOB & TOB
  const [year,month,day] = dob.split("-").map(Number);
  const [hour,minute]    = tob.split(":").map(Number);

  // ⭐ STEP 1 → JULIAN DAY
  const JD = calculateJulianDay(year,month,day,hour,minute);

  // ⭐ STEP 2 → GREENWICH SIDEREAL TIME
  const GST = calculateGST(JD);

  const chartObject = {
    name,
    dob,
    tob,
    pob,
    country,
    ayanamsa: "Lahiri",
    julian_day: JD,
    greenwich_sidereal_time: GST.toFixed(4) + "°"
  };

  $("resultBox").textContent =
      JSON.stringify(chartObject, null, 2);
}


/* =====================================================
STEP 1 — JULIAN DAY CALCULATION
=====================================================*/
function calculateJulianDay(y,m,d,h,min){

  if(m <= 2){
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y/100);
  const B = 2 - A + Math.floor(A/4);

  const JD_day = Math.floor(365.25*(y+4716))
               + Math.floor(30.6001*(m+1))
               + d + B - 1524.5;

  const JD_time = (h + min/60)/24;

  return JD_day + JD_time;
}


/* =====================================================
STEP 2 — GREENWICH SIDEREAL TIME
This is the foundation of Lagna calculation
=====================================================*/
function calculateGST(JD){

  const T = (JD - 2451545.0) / 36525;

  let GST =
      280.46061837
    + 360.98564736629*(JD - 2451545)
    + 0.000387933*T*T
    - (T*T*T)/38710000;

  GST = normalizeDegree(GST);
  return GST;
}


/* =====================================================
UTILITY — NORMALIZE DEGREE 0 → 360
=====================================================*/
function normalizeDegree(deg){
  deg = deg % 360;
  if(deg < 0) deg += 360;
  return deg;
}
