/**
 * ui-tickets.js — match ticket cards
 */
import { NICK_KEY } from './constants.js';
import { S } from './state.js';
import { escapeHtml, resultFor, isMatchFinished, myPredFor, predOutcome } from './domain.js';
import { videoBanner, fanIconBtn } from './ui-fans.js';

function predBadgeHtml(f,rec){
  const nick=localStorage.getItem(NICK_KEY)||'';
  const pred=myPredFor(f.id,nick);
  if(!pred)return'';
  const outcome=predOutcome(pred,rec);
  const call=`Your call ${pred.mu}–${pred.opp}`;
  if(outcome==='pending')return`<div class="ticket-pred pending">${call} · locked</div>`;
  if(outcome==='exact')return`<div class="ticket-pred exact">${call} · Exact · +3</div>`;
  if(outcome==='result')return`<div class="ticket-pred result">${call} · Result · +1</div>`;
  return`<div class="ticket-pred miss">${call} · Miss</div>`;
}

export function renderTicket(f){
  const rec=S.records[f.id]||S.records[String(f.id)];
  const played=rec&&rec.mu!==undefined;
  const venueLabel=f.venue==='H'?'Home':'Away';
  const stub=f.comp==='UCL'?`UCL MD${f.md}`:`GW ${f.gw}`;
  const gwLabel=f.comp==='UCL'?`UCL MD${f.md}`:`Matchday ${f.gw}`;
  const compLabel=f.comp==='PL'?'Prem':f.comp==='UCL'?'Champions League':f.comp;
  if(played){
    const r=resultFor(rec);
    return`<div class="ticket"><div class="stub">${stub} · ${f.comp}</div><div class="body stamp-block"><div class="result-stamp ${r}">${r==='W'?'WIN':r==='D'?'DRAW':'LOSS'}</div><div class="row1"><span class="gw">${gwLabel}</span><span class="comp">${compLabel}</span></div><div class="date">${f.date} · ${venueLabel}</div><div class="fixture-line">Man United <span class="venue-tag">${f.venue}</span> vs ${f.opp}</div><div class="final-score">${rec.mu} – ${rec.opp}</div>${rec.auto?'<div class="auto-tag">Auto score</div>':''}${predBadgeHtml(f,rec)}<div class="highlight-display ${rec.highlight?'':'empty'}">${rec.highlight?escapeHtml(rec.highlight):'No note.'}</div>${videoBanner(f,rec)}<div class="card-actions">${fanIconBtn(f)}<button class="edit-link" id="edit-${f.id}">Edit result</button></div></div></div>`;
  }
  return`<div class="ticket"><div class="stub">${stub} · ${f.comp}</div><div class="body"><div class="row1"><span class="gw">${gwLabel}</span><span class="comp">${compLabel}</span></div><div class="date">${f.date} · ${venueLabel}</div><div class="fixture-line">Man United <span class="venue-tag">${f.venue}</span> vs ${f.opp}</div>${predBadgeHtml(f,rec)}<div class="score-form"><span class="mu-mono">MUFC</span><input type="number" min="0" id="mu-${f.id}" placeholder="-"/><span class="vs">:</span><input type="number" min="0" id="opp-${f.id}" placeholder="-"/><span class="mu-mono">${escapeHtml(f.opp).slice(0,4).toUpperCase()}</span></div><textarea class="highlight-input" id="hl-${f.id}" placeholder="Optional note for your prediction...">${rec&&rec.highlight?escapeHtml(rec.highlight):''}</textarea><div class="card-actions">${fanIconBtn(f)}<button class="save-btn" id="save-${f.id}">${isMatchFinished(f)?'Stamp result':'Lock prediction'}</button></div></div></div>`;
}
