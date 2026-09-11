/**
 * ui-share.js — shareable season / reckoning cards (canvas)
 */
import { NICK_KEY } from './constants.js';
import { computeMySeason } from './domain.js';

const W = 1080, H = 1350;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Draw My Season share card; returns canvas */
export function drawSeasonCard(my) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#1A1410');
  g.addColorStop(1, '#0D0B09');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#C8102E';
  ctx.fillRect(0, 0, W, 12);

  ctx.fillStyle = '#C6A15B';
  ctx.fillRect(48, 80, 120, 4);

  ctx.fillStyle = '#C6A15B';
  ctx.font = '500 28px system-ui, sans-serif';
  ctx.fillText('2026/27  ·  MY SEASON', 48, 130);

  ctx.fillStyle = '#EFE4C8';
  ctx.font = '700 72px system-ui, sans-serif';
  const nick = (my.nick || 'Fan').slice(0, 18);
  ctx.fillText(nick, 48, 220);

  const stats = [
    { lab: 'CALLS', val: String(my.calls) },
    { lab: 'HIT RATE', val: my.settled ? my.hitRate + '%' : '—' },
    { lab: 'EXACT', val: String(my.exact) },
    { lab: 'POINTS', val: String(my.pts) },
  ];
  const cardW = 220, cardH = 160, gap = 24, startX = 48;
  stats.forEach((s, i) => {
    const x = startX + i * (cardW + gap);
    const y = 280;
    ctx.fillStyle = '#241E17';
    roundRect(ctx, x, y, cardW, cardH, 16);
    ctx.fill();
    ctx.strokeStyle = '#3A3228';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, cardW, cardH, 16);
    ctx.stroke();
    ctx.fillStyle = '#C6A15B';
    ctx.font = '700 56px ui-monospace, monospace';
    ctx.fillText(s.val, x + 24, y + 80);
    ctx.fillStyle = '#8A7A68';
    ctx.font = '500 22px system-ui, sans-serif';
    ctx.fillText(s.lab, x + 24, y + 120);
  });

  ctx.fillStyle = '#8A7A68';
  ctx.font = '500 26px system-ui, sans-serif';
  ctx.fillText('FORM', 48, 520);

  const form = my.form || [];
  if (!form.length) {
    ctx.fillStyle = '#5A4E42';
    ctx.font = '400 28px system-ui, sans-serif';
    ctx.fillText('No settled calls yet', 48, 580);
  } else {
    form.forEach((x, i) => {
      const x0 = 48 + i * 88;
      const y0 = 545;
      const col = x === 'E' ? '#2F5233' : x === 'R' ? '#4A6A3A' : '#8C0B20';
      ctx.fillStyle = col;
      roundRect(ctx, x0, y0, 72, 72, 12);
      ctx.fill();
      ctx.fillStyle = '#EFE4C8';
      ctx.font = '700 32px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(x, x0 + 36, y0 + 48);
      ctx.textAlign = 'left';
    });
  }

  ctx.fillStyle = '#8A7A68';
  ctx.font = '500 26px system-ui, sans-serif';
  ctx.fillText('RECENT CALLS', 48, 680);

  const recent = (my.recent || []).slice(0, 4);
  recent.forEach((c, i) => {
    const y = 720 + i * 90;
    ctx.fillStyle = '#1F1914';
    roundRect(ctx, 48, y, W - 96, 76, 12);
    ctx.fill();
    ctx.fillStyle = '#EFE4C8';
    ctx.font = '500 28px system-ui, sans-serif';
    ctx.fillText(`${c.label} · ${c.opp}`, 72, y + 48);
    ctx.fillStyle = '#C6A15B';
    ctx.font = '700 28px ui-monospace, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${c.predMu}–${c.predOpp}`, W - 200, y + 48);
    const badge =
      c.outcome === 'exact' ? 'EXACT' :
      c.outcome === 'result' ? 'RESULT' :
      c.outcome === 'miss' ? 'MISS' : 'LOCKED';
    const bcol =
      c.outcome === 'exact' ? '#2F5233' :
      c.outcome === 'result' ? '#4A6A3A' :
      c.outcome === 'miss' ? '#8C0B20' : '#5A4E42';
    ctx.fillStyle = bcol;
    roundRect(ctx, W - 180, y + 18, 100, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#EFE4C8';
    ctx.font = '600 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badge, W - 130, y + 46);
    ctx.textAlign = 'left';
  });

  ctx.fillStyle = '#5A4E42';
  ctx.font = '400 24px system-ui, sans-serif';
  ctx.fillText("The Red Devils' Matchday Log", 48, H - 60);
  ctx.fillStyle = '#C8102E';
  ctx.fillRect(0, H - 12, W, 12);

  return canvas;
}

export async function shareSeasonCard() {
  const nick = localStorage.getItem(NICK_KEY) || '';
  if (!nick) {
    alert('Lock a prediction with your name first — then your season card is ready to share.');
    return;
  }
  const my = computeMySeason(nick);
  const canvas = drawSeasonCard(my);
  const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
  if (!blob) return;
  const file = new File([blob], `my-season-${nick.slice(0, 12)}.png`, { type: 'image/png' });
  try {
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'My Season · 2026/27',
        text: `${nick} · ${my.pts} pts · ${my.settled ? my.hitRate + '% hit rate' : 'season card'}`,
      });
      return;
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
