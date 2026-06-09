const foods = [
  "Batata al horno\ncon miel y romero",
  "Puré de batata\ncon manteca",
  "Tortilla de\nbatata y cebolla",
  "Chips de batata\ncrujientes",
  "Buñuelos de\nbatata dulce",
  "Sopa crema\nde batata",
  "Batata rellena\ncon queso",
  "Nada", // Nada
];

const colors = [
  "#E8622A", "#F0944D", "#D4A017", "#C0392B",
  "#E67E22", "#A93226", "#F39C12", "#BDC3C7",
];

const NUM = foods.length;
const ARC = (2 * Math.PI) / NUM;
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const cx = 170, cy = 170, r = 162;

let currentAngle = 0;
let spinning = false;

function drawWheel(angle) {
  ctx.clearRect(0, 0, 340, 340);

  for (let i = 0; i < NUM; i++) {
    const start = angle + i * ARC;
    const end = start + ARC;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    const midAngle = start + ARC / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(midAngle);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";

    if (foods[i] === "") {
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("✕ nada", r - 12, 6);
    } else {
      const lines = foods[i].split("\n");
      if (lines.length === 1) {
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(lines[0], r - 12, 4);
      } else {
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(lines[0], r - 12, -3);
        ctx.font = "11px sans-serif";
        ctx.fillText(lines[1], r - 12, 12);
      }
    }
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function getWinningIndex(angle) {
  const pointerAngle = -Math.PI / 2;
  let offset = ((pointerAngle - angle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  return Math.floor(offset / ARC) % NUM;
}

function spin() {
  if (spinning) return;
  spinning = true;
  document.getElementById("resultText").textContent = "Girando...";

  const extraSpins = 8 + Math.random() * 6;
  const randomExtra = Math.random() * 2 * Math.PI;
  const totalRotation = extraSpins * 2 * Math.PI + randomExtra;
  const target = currentAngle - totalRotation;
  const duration = 3800 + Math.random() * 800;
  const start = performance.now();
  const startAngle = currentAngle;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function frame(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    currentAngle = startAngle + (target - startAngle) * easeOut(t);
    drawWheel(currentAngle);

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      currentAngle = target % (2 * Math.PI);
      drawWheel(currentAngle);
      spinning = false;

      const idx = getWinningIndex(currentAngle);
      const res = foods[idx];
      const resultEl = document.getElementById("resultText");

      if (res === "") {
        resultEl.textContent = "✕ ¡Nada! Mejor la próxima";
      } else {
        resultEl.textContent = "🍠 " + res.replace("\n", " ");
      }
    }
  }

  requestAnimationFrame(frame);
}

drawWheel(currentAngle);

document.getElementById("spinBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  spin();
});
document.getElementById("wheelWrap").addEventListener("click", spin);

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'win32') app.quit();
});
