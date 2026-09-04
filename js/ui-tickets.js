/**
 * ui-tickets.js — match ticket cards + post-match reckoning
 */
import { NICK_KEY } from './constants.js';
import { S } from './state.js';
import { escapeHtml, resultFor, isMatchFinished, myPredFor, predOutcome } from './domain.js';
import { videoBanner, fanIconBtn } from './ui-fans.js';

/** Pending lock strip (upcoming / not yet played) */
function predPendingHtml(f){
  const nick=localStorage.getItem(NICK_KEY)||'';
  const pred=myPredFor(f.id,nick);
  if(!pred)return'';
  return`<div class="ticket-pred pending">Your call ${pred.mu}–${pred.opp} · locked</div>`;
}

/**
 * Full post-match reckoning: call vs actual, points, short line.
 * Only when the match is played and this nick locked a prediction.
 */
function renderReckoning(f,rec){
  const nick=localStorage.getItem(NICK_KEY)||'';
  const pred=myPredFor(f.id,nick);
  if(!pred||!rec||rec.mu===undefined)return'';
  const outcome=predOutcome(pred,rec);
  if(outcome==='pending')return predPendingHtml(f);

  const pts=outcome==='exact'?3:outcome==='result'?1:0;
  const headline=outcome==='exact'?'Exact score':outcome==='result'?'Right result':'Missed';
  const blurb=outcome==='exact'
    ?'Nailed the scoreline. That one stays on your season card.'
    :outcome==='result'
      ?'Had the result, missed the score. Still on the board.'
      :'The game had other ideas. Next call is live when the fixtures roll on.';

  return`<div class="reckoning ${outcome}">
    <div class="reckoning-kicker">Your reckoning</div>
    <div class="reckoning-row">
      <div class="reckoning-side">
        <div class="reckoning-lab">Your call</div>
        <div class="reckoning-score">${pred.mu}–${pred.opp}</div>
      </div>
      <div class="reckoning-vs">vs</div>
      <div class="reckoning-side">
        <div class="reckoning-lab">Final</div>
        <div class="reckoning-score actual">${rec.mu}–${rec.opp}</div>
      </div>
      <div class="reckoning-outcome">
        <span class="reckoning-badge">${headline}</span>
        <span class="reckoning-pts">${pts>0?`+${pts} pts`:'0 pts'}</span>
      </div>
    </div>
    <p class="reckoning-blurb">${blurb}</p>
  </div>`;
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
    return`<div class="ticket"><div class="stub">${stub} · ${f.comp}</div><div class="body stamp-block"><div class="result-stamp ${r}">${r==='W'?'WIN':r==='D'?'DRAW':'LOSS'}</div><div class="row1"><span class="gw">${gwLabel}</span><span class="comp">${compLabel}</span></div><div class="date">${f.date} · ${venueLabel}</div><div class="fixture-line">Man United <span class="venue-tag">${f.venue}</span> vs ${f.opp}</div><div class="final-score">${rec.mu} – ${rec.opp}</div>${rec.auto?'<div class="auto-tag">Auto score</div>':''}${renderReckoning(f,rec)}<div class="highlight-display ${rec.highlight?'':'empty'}">${rec.highlight?escapeHtml(rec.highlight):'No note.'}</div>${videoBanner(f,rec)}<div class="card-actions">${fanIconBtn(f)}<button class="edit-link" id="edit-${f.id}">Edit result</button></div></div></div>`;
  }

  return`<div class="ticket"><div class="stub">${stub} · ${f.comp}</div><div class="body"><div class="row1"><span class="gw">${gwLabel}</span><span class="comp">${compLabel}</span></div><div class="date">${f.date} · ${venueLabel}</div><div class="fixture-line">Man United <span class="venue-tag">${f.venue}</span> vs ${f.opp}</div>${predPendingHtml(f)}<div class="score-form"><span class="mu-mono">MUFC</span><input type="number" min="0" id="mu-${f.id}" placeholder="-"/><span class="vs">:</span><input type="number" min="0" id="opp-${f.id}" placeholder="-"/><span class="mu-mono">${escapeHtml(f.opp).slice(0,4).toUpperCase()}</span></div><textarea class="highlight-input" id="hl-${f.id}" placeholder="Optional note for your prediction...">${rec&&rec.highlight?escapeHtml(rec.highlight):''}</textarea><div class="card-actions">${fanIconBtn(f)}<button class="save-btn" id="save-${f.id}">${isMatchFinished(f)?'Stamp result':'Lock prediction'}</button></div></div></div>`;
}
