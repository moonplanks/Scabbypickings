// --- PWA: register service worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}

// --- Game state ---
const arena = document.getElementById('arena');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');

let playing = false;
let score = 0;
let timeLeft = 30;
let timerId = null;

function rand(min, max) { return Math.random() * (max - min) + min; }

function placeScab(scab) {
  const pad = 20;
  const aw = arena.clientWidth - 88 - pad * 2;
  const ah = arena.clientHeight - 88 - pad * 2;
  const x = pad + rand(0, aw);
  const y = pad + rand(0, ah);
  scab.style.left = `${x}px`;
  scab.style.top = `${y}px`;
}

function spawnScab() {
  const el = document.createElement('button');
  el.className = 'scab';
  el.setAttribute('aria-label', 'Pick the scab!');
  placeScab(el);
  el.addEventListener('click', () => {
    if (!playing) return;
    score++;
    scoreEl.textContent = score;
    // pop score toast
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = '+1';
    t.style.left = `calc(${el.style.left} + 40px)`;
    t.style.top = `calc(${el.style.top} - 10px)`;
    arena.appendChild(t);
    setTimeout(() => t.remove(), 600);
    placeScab(el);
    // tiny haptic on supported phones
    if (navigator.vibrate) navigator.vibrate(10);
  }, { passive: true });
  arena.appendChild(el);
  return el;
}

function setTimer(seconds) {
  timeLeft = seconds;
  timeEl.textContent = timeLeft;
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function startGame() {
  if (playing) return;
  playing = true;
  score = 0;
  scoreEl.textContent = score;
  startBtn.style.display = 'none';
  arena.innerHTML = ''; // clear
  arena.appendChild(startBtn); // keep for later
  spawnScab();
  setTimer(30);
}

function endGame() {
  playing = false;
  clearInterval(timerId);
  // remove scabs
  [...arena.querySelectorAll('.scab')].forEach(n => n.remove());
  // show result
  startBtn.textContent = `Play again (Score: ${score})`;
  startBtn.style.display = 'block';
}

startBtn.addEventListener('click', startGame);
window.addEventListener('resize', () => {
  const scab = arena.querySelector('.scab');
  if (scab) placeScab(scab);
});
