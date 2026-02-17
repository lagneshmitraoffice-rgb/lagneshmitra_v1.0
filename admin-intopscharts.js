console.log("Chart engine loaded 🚀");

const $ = id => document.getElementById(id);

/* ================= BUTTON CLICK ================= */
$("generateBtn").addEventListener("click", generateChart);

/* ================= CORE ENGINE ================= */
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

  // Simple Lahiri mock planetary generator (starter engine)
  const planets = generatePlanets();

  const chartObject = {
    name,
    dob,
    tob,
    pob,
    country,
    ayanamsa: "Lahiri",
    planets
  };

  $("resultBox").textContent =
      JSON.stringify(chartObject, null, 2);
}

/* ================= PLANET GENERATOR (TEMP ENGINE) ================= */
function generatePlanets(){

  const signs = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ];

  function randDeg(){
    return Math.floor(Math.random()*30);
  }

  function randSign(){
    return signs[Math.floor(Math.random()*12)];
  }

  return {
    Sun: randSign()+" "+randDeg()+"°",
    Moon: randSign()+" "+randDeg()+"°",
    Mercury: randSign()+" "+randDeg()+"°",
    Venus: randSign()+" "+randDeg()+"°",
    Mars: randSign()+" "+randDeg()+"°",
    Jupiter: randSign()+" "+randDeg()+"°",
    Saturn: randSign()+" "+randDeg()+"°",
    Rahu: randSign()+" "+randDeg()+"°",
    Ketu: randSign()+" "+randDeg()+"°"
  };
}
