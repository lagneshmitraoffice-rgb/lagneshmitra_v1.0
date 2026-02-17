// admin-intopscharts.js

const $ = (id)=>document.getElementById(id);

const resultBox = $("chartResult");
const btn = $("generateChartBtn");

/* ================= ZODIAC ================= */
const signs = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

/* ================= BASIC TIME → DEGREE ================= */
/* Simplified internal astro engine v1 */
function getLagna(hour){
  // 24h = 360deg → 1h = 15deg
  let deg = hour * 15;
  let signIndex = Math.floor(deg / 30) % 12;
  return signs[signIndex];
}

/* ================= PLANET POSITIONS (SIMULATED ENGINE) ================= */
/* v1 placeholder until ephemeris added */
function getPlanetPositions(){
  return {
    Sun:"Scorpio",
    Moon:"Aquarius",
    Mercury:"Scorpio",
    Venus:"Sagittarius",
    Mars:"Libra",
    Jupiter:"Taurus",
    Saturn:"Virgo",
    Rahu:"Cancer",
    Ketu:"Capricorn"
  };
}

/* ================= HOUSE MAPPING ================= */
function mapHouses(lagna){
  let startIndex = signs.indexOf(lagna);
  let houses = {};
  for(let i=0;i<12;i++){
    houses[`House ${i+1}`] = signs[(startIndex+i)%12];
  }
  return houses;
}

/* ================= INTERPRETATION ================= */
function generateInterpretation(lagna){
  return `
Lagna: ${lagna}

• Strong personality axis activated
• Life path strongly self-driven
• Internal karmic engine active
• This chart ready for deeper analysis modules
`;
}

/* ================= GENERATE CHART ================= */
btn.onclick = ()=>{

  const name = $("nameInput").value;
  const dob = $("dobInput").value;
  const tob = $("tobInput").value;

  if(!name || !dob || !tob){
    alert("Fill all fields");
    return;
  }

  const hour = parseInt(tob.split(":")[0]);

  const lagna = getLagna(hour);
  const planets = getPlanetPositions();
  const houses = mapHouses(lagna);
  const interpretation = generateInterpretation(lagna);

  const chartObject = {
    Name:name,
    Lagna:lagna,
    Planets:planets,
    Houses:houses,
    Interpretation:interpretation
  };

  resultBox.innerHTML = `<pre>${JSON.stringify(chartObject,null,2)}</pre>`;
};
