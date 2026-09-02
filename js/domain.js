/**
 * domain.js — pure / near-pure helpers
 */
import { FIXTURES, MONTHS } from './constants.js';
import { S } from './state.js';

export function parseFixtureDate(str){const p=str.trim().split(/\s+/);return new Date(+p[3],MONTHS[p[2]],+p[1])}
export function isMatchFinished(f){const d=parseFixtureDate(f.date);d.setHours(23,59,59,999);return d<=new Date()}

export function toYmd(d){return`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`}
export function normalizeName(s){return(s||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]/g,'')}
export function namesMatch(a,b){const x=normalizeName(a),y=normalizeName(b);return x.includes(y)||y.includes(x)||x===y}
export function isManUnited(team){const n=(team?.name||team?.displayName||team?.abbreviation||'').toLowerCase();return n.includes('manchester united')||n==='man united'||n==='man utd'||n==='mun'||n==='man'}
export function resultFor(rec){if(rec.mu>rec.opp)return'W';if(rec.mu<rec.opp)return'L';return'D'}
export function computeStats(){let p=0,w=0,d=0,l=0,gf=0,ga=0;const streak=[];FIXTURES.forEach(f=>{const rec=S.records[f.id]||S.records[String(f.id)];if(rec&&rec.mu!==undefined){p++;gf+=+rec.mu;ga+=+rec.opp;const r=resultFor(rec);if(r==='W')w++;else if(r==='D')d++;else l++;streak.push(r)}});return{p,w,d,l,gf,ga,gd:gf-ga,pts:w*3+d,streak:streak.slice(-6)}}

/** Latest prediction by nick for a fixture id, or null */
export function myPredFor(fid,nick){
  if(!nick)return null;
  const list=S.discussions[String(fid)]||[];
  const n=nick.toLowerCase();
  let best=null;
  for(const c of list){
    if(c.type==='prediction'&&(c.nick||'').toLowerCase()===n){
      if(!best||(c.ts||0)>=(best.ts||0))best=c;
    }
  }
  return best;
}

/** exact | result | miss | pending */
export function predOutcome(pred,rec){
  if(!pred||!rec||rec.mu===undefined)return pred?'pending':null;
  if(+pred.mu===+rec.mu&&+pred.opp===+rec.opp)return'exact';
  const pr=pred.mu>pred.opp?'W':pred.mu<pred.opp?'L':'D';
  return pr===resultFor(rec)?'result':'miss';
}

/**
 * Personal season card from localStorage nick + discuss predictions.
 * Points: exact=3, correct result=1, miss=0.
 */
export function computeMySeason(nick){
  const empty={nick:nick||'',calls:0,settled:0,exact:0,resultHits:0,pts:0,hitRate:0,exactRate:0,form:[],recent:[]};
  if(!nick)return empty;
  const recent=[];
  let calls=0,settled=0,exact=0,resultHits=0,pts=0;
  const form=[];
  FIXTURES.forEach(f=>{
    const pred=myPredFor(f.id,nick);
    if(!pred)return;
    calls++;
    const rec=S.records[f.id]||S.records[String(f.id)];
    const outcome=predOutcome(pred,rec);
    const label=f.comp==='UCL'?`UCL MD${f.md}`:`GW${f.gw}`;
    const entry={fid:f.id,label,opp:f.opp,predMu:+pred.mu,predOpp:+pred.opp,outcome,actual:rec&&rec.mu!==undefined?`${rec.mu}–${rec.opp}`:null};
    recent.push(entry);
    if(outcome==='exact'){settled++;exact++;resultHits++;pts+=3;form.push('E')}
    else if(outcome==='result'){settled++;resultHits++;pts+=1;form.push('R')}
    else if(outcome==='miss'){settled++;form.push('M')}
  });
  const hitRate=settled?Math.round((resultHits/settled)*100):0;
  const exactRate=settled?Math.round((exact/settled)*100):0;
  return{nick,calls,settled,exact,resultHits,pts,hitRate,exactRate,form:form.slice(-8),recent:recent.slice(-6).reverse()};
}

export function escapeHtml(str){const d=document.createElement('div');d.textContent=str;return d.innerHTML}
export function fireConfetti(){const canvas=document.createElement('canvas');canvas.className='confetti-canvas';canvas.width=innerWidth;canvas.height=innerHeight;document.body.appendChild(canvas);const ctx=canvas.getContext('2d'),colors=['#C8102E','#C6A15B','#EFE4C8','#2F5233'],pieces=Array.from({length:80},()=>({x:Math.random()*canvas.width,y:-20-Math.random()*canvas.height*.3,vy:2+Math.random()*3,vx:-1.5+Math.random()*3,size:4+Math.random()*5,color:colors[Math.floor(Math.random()*colors.length)],rot:Math.random()*360,vr:-6+Math.random()*12}));let frame=0;(function tick(){ctx.clearRect(0,0,canvas.width,canvas.height);pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.6);ctx.restore()});if(++frame<110)requestAnimationFrame(tick);else canvas.remove()})()}
export function ytThumb(id){return`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
export function ytWatch(id){return`https://www.youtube.com/watch?v=${id}`}
export function ytSearchUrl(f){return`https://www.youtube.com/results?search_query=${encodeURIComponent('Manchester United vs '+f.opp+' Highlights')}`}
export function defaultBannerSvg(){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8C0B20"/><stop offset="100%" stop-color="#241E17"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="320" y="160" fill="#EFE4C8" font-family="Arial" font-size="28" text-anchor="middle" font-weight="700">MATCH HIGHLIGHTS</text><text x="320" y="200" fill="#C6A15B" font-family="Arial" font-size="16" text-anchor="middle">Tap to watch on YouTube</text></svg>`;return'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
