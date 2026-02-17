console.log("Julian Engine Loaded 🌍");

/* =====================================================
   LOCAL TIME → UTC CONVERTER (India default)
===================================================== */
export function localToUTC(dateStr, timeStr) {

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  // India offset UTC +5:30
  const offsetHours = 5;
  const offsetMinutes = 30;

  let utcHour = hour - offsetHours;
  let utcMinute = minute - offsetMinutes;

  if (utcMinute < 0) {
    utcMinute += 60;
    utcHour -= 1;
  }

  if (utcHour < 0) {
    utcHour += 24;
  }

  return { year, month, day, utcHour, utcMinute };
}

/* =====================================================
   DATE → JULIAN DAY CONVERTER (Astronomy formula)
===================================================== */
export function toJulianDay(year, month, day, hour, minute) {

  // convert time to decimal
  const UT = hour + (minute / 60);

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day + B - 1524.5 + (UT / 24);

  return JD;
}
