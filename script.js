function pad(value, length=2) {
  return value.toString().padStart(length, '0');
}

function calculateDiff(fromDate, toDate) {
  let diffMs = toDate - fromDate;
  let direction = diffMs < 0 ? -1 : 1;
  diffMs = Math.abs(diffMs);

  let ms = diffMs % 1000;
  let totalSeconds = Math.floor(diffMs / 1000);
  let sec = totalSeconds % 60;
  let totalMinutes = Math.floor(totalSeconds / 60);
  let min = totalMinutes % 60;
  let totalHours = Math.floor(totalMinutes / 60);
  let hrs = totalHours % 24;
  let totalDays = Math.floor(totalHours / 24);

  let years = Math.floor(totalDays / 365);
  let months = Math.floor((totalDays % 365) / 30);
  let weeks = Math.floor(((totalDays % 365) % 30) / 7);
  let days = ((totalDays % 365) % 30) % 7;

  return {
    direction,
    years, months, weeks, days,
    hrs, min, sec, ms
  };
}

function formatDiff(diffObj) {
  const sign = diffObj.direction < 0 ? '-' : '';
  return (
    `${sign}${pad(diffObj.years)} שנים\n` +
    `${pad(diffObj.months)} חודשים\n` +
    `${pad(diffObj.weeks)} שבועות\n` +
    `${pad(diffObj.days)} ימים\n` +
    `${pad(diffObj.hrs)} שעות\n` +
    `${pad(diffObj.min)} דקות\n` +
    `${pad(diffObj.sec)} שניות\n` +
    `${pad(Math.floor(diffObj.ms/10))} מאיות השנייה`
  );
}

document.getElementById('computeBtn').addEventListener('click', () => {
  const birthDateVal = document.getElementById('birthDate').value;
  const futureDateVal = document.getElementById('futureDate').value;

  if (!birthDateVal && !futureDateVal) {
    alert('אנא הזן לפחות תאריך לידה או תאריך יעד.');
    return;
  }

  const now = new Date();

  window.elapsedObj = birthDateVal ? calculateDiff(new Date(birthDateVal), now) : null;
  window.remainingObj = futureDateVal ? calculateDiff(now, new Date(futureDateVal)) : null;

  document.getElementById('elapsedTime').textContent = window.elapsedObj ? formatDiff(window.elapsedObj) : 'לא הוזן תאריך לידה.';
  document.getElementById('remainingTime').textContent = window.remainingObj ? formatDiff(window.remainingObj) : 'לא הוזן תאריך יעד.';

  document.getElementById('inputScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.remove('hidden');

  updateMilliseconds();
});

document.getElementById('backBtn').addEventListener('click', () => {
  document.getElementById('inputScreen').classList.remove('hidden');
  document.getElementById('resultScreen').classList.add('hidden');

  if (window.millisecondsInterval) {
    clearInterval(window.millisecondsInterval);
  }
});

function updateMilliseconds() {
  if (!window.elapsedObj && !window.remainingObj) return;

  const now = new Date();
  if (window.elapsedObj) {
    const diff = calculateDiff(new Date(document.getElementById('birthDate').value), now);
    window.elapsedObj = diff;
    document.getElementById('elapsedTime').textContent = formatDiff(diff);
  }

  if (window.remainingObj) {
    const diff = calculateDiff(now, new Date(document.getElementById('futureDate').value));
    window.remainingObj = diff;
    document.getElementById('remainingTime').textContent = formatDiff(diff);
  }
  
  window.millisecondsInterval = setTimeout(updateMilliseconds, 50);
}
