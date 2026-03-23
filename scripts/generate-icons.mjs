// Génère les icônes PWA pour Pizza La Pallice
// Lancer avec : node scripts/generate-icons.mjs

import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const GREEN = '#1B5E20';

mkdirSync('public/icons', { recursive: true });

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fond vert arrondi
  const r = size * 0.22;
  ctx.fillStyle = GREEN;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // Cercle blanc
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Emoji pizza
  ctx.font = `${Math.floor(size * 0.42)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🍕', size / 2, size / 2 + size * 0.02);

  return canvas;
}

for (const size of SIZES) {
  const canvas = drawIcon(size);
  writeFileSync(`public/icons/icon-${size}x${size}.png`, canvas.toBuffer('image/png'));
  console.log(`✓ icon-${size}x${size}.png`);
}

// Apple touch icon (180px, fond plein sans coins arrondis — iOS applique son propre masque)
const apple = createCanvas(180, 180);
const actx = apple.getContext('2d');
actx.fillStyle = GREEN;
actx.fillRect(0, 0, 180, 180);
actx.fillStyle = '#FFFFFF';
actx.beginPath();
actx.arc(90, 90, 68, 0, Math.PI * 2);
actx.fill();
actx.font = '76px serif';
actx.textAlign = 'center';
actx.textBaseline = 'middle';
actx.fillText('🍕', 90, 91);
writeFileSync('public/icons/apple-touch-icon.png', apple.toBuffer('image/png'));
console.log('✓ apple-touch-icon.png');

console.log('\n🍕 Toutes les icônes générées dans public/icons/');
