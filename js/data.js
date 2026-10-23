/**
 * data.js — Firebase writes + external fetches
 */
import { ref, set, push } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js';
import {
  API_BASE, PIPED, RSS2JSON, MU_CHANNEL, HIGHLIGHT_IDS, KNOWN_RESULTS, DEFAULT_INJURIES, FIXTURES,
  STORAGE_KEY, NICK_KEY,
  API_FOOTBALL_BASE, API_FOOTBALL_KEY, API_FOOTBALL_MU_ID, API_FOOTBALL_UCL_ID, API_FOOTBALL_SEASON
} from './constants.js';
import { S } from './state.js';
import {
  parseFixtureDate, isMatchFinished, isOnOrAfterMatchDay, toYmd, normalizeName, namesMatch, isManUnited, resultFor
} from './domain.js';

export async function postPrediction(fid,mu,opp,text){const nick=(localStorage.getItem(NICK_KEY)||'Fan').slice(0,24);const payload={type:'prediction',nick,mu:+mu,opp:+opp,text:(text||'').trim().slice(0,200),ts:Date.now()};if(S.discussRef){try{await push(ref(S.db,`discuss/${fid}`),payload)}catch(e){console.warn('Firebase discuss write failed',e);const key=String(fid);S.discussions[key]=S.discussions[key]||[];S.discussions[key].push(payload)}}else{const key=String(fid);S.discussions[key]=S.discussions[key]||[];S.discussions[key].push(payload)}}

export async function saveData(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(S.records))}catch(_){}
  if(!S.recordsRef)return;
  try{await set(S.recordsRef,S.records)}
  catch(e){
    console.warn('Firebase write /records failed',e);
    if(!S.loadError&&e&&/permission/i.test(String(e.message||e))){
      S.loadError='Firebase blocked writes to /records. Update Realtime Database rules (read+write for records, discuss, injuries). Scores still update locally this session.';
    }
  }
}
export async function searchHighlights(f){const queries=[`${f.opp} v Man Utd | Highlights`,`Man Utd v ${f.opp} | Highlights`,`Manchester United vs ${f.opp} Highlights`];for(const q of queries){try{const res=await fetch(`${PIPED}/search?q=${encodeURIComponent(q)}&filter=videos`);if(!res.ok)continue;const data=await res.json();const items=data.items||data||[];const streams=items.filter(it=>it.type==='stream'||(it.url||'').includes('watch'));const scored=streams.map(it=>{const id=(it.url||'').split('v=')[1]||it.id;const title=(it.title||'').toLowerCase(),up=(it.uploaderName||'').toLowerCase(),upUrl=it.uploaderUrl||'';let score=0;if(up.includes('manchester united')||upUrl.includes(MU_CHANNEL))score+=50;if(up.includes('nbc')||up.includes('sky sports')||up.includes('premier league'))score+=40;if(title.includes('highlight'))score+=30;if(title.includes('extended'))score+=5;if(title.includes('matchday live')||title.includes('build-up')||title.includes('pre-match')||title.includes('post-match interview'))score-=60;if(normalizeName(title).includes(normalizeName(f.opp)))score+=20;if(it.duration&&it.duration>=180&&it.duration<=1200)score+=15;if(it.duration&&it.duration>1800)score-=40;if(it.duration&&it.duration<120)score-=20;return{id,title:it.title,score}}).filter(x=>x.id).sort((a,b)=>b.score-a.score);if(scored[0]&&scored[0].score>=30){const best=scored[0],extended=scored.find(s=>s.id!==best.id&&/extended/i.test(s.title));return{id:best.id,extended:extended?.id||null}}}catch(_){}}return null}

function apiFootballKey(){
  try{
    const ls=localStorage.getItem('mu-api-football-key');
    if(ls&&ls.trim())return ls.trim();
  }catch(_){}
  return (API_FOOTBALL_KEY||'').trim();
}

/**
 * Pull finished UCL results for United from API-Football and map onto FIXTURES.
 * One request: team + league + season + status FT.
 */
export async function importUclFromApiFootball(){
  const key=apiFootballKey();
  if(!key){
    console.info('API-Football: no key — set API_FOOTBALL_KEY or localStorage mu-api-football-key');
    return false;
  }
  const pending=FIXTURES.filter(f=>{
    if(f.comp!=='UCL')return false;
    const rec=S.records[f.id]||S.records[String(f.id)];
    return !(rec&&rec.mu!==undefined) && isOnOrAfterMatchDay(f);
  });
  if(!pending.length)return false;

  const url=`${API_FOOTBALL_BASE}/fixtures?team=${API_FOOTBALL_MU_ID}&league=${API_FOOTBALL_UCL_ID}&season=${API_FOOTBALL_SEASON}&status=FT-AET-PEN`;
  let data;
  try{
    const res=await fetch(url,{headers:{'x-apisports-key':key}});
    if(!res.ok){console.warn('API-Football UCL',res.status);return false}
    data=await res.json();
  }catch(e){console.warn('API-Football UCL fetch',e);return false}

  if(data?.errors && Object.keys(data.errors).length){
    console.warn('API-Football errors',data.errors);
    return false;
  }
  const rows=data?.response||[];
  let changed=false;
  for(const fixture of pending){
    const keyId=String(fixture.id);
    if(S.records[keyId]?.mu!==undefined)continue;
    const match=rows.find(row=>{
      const home=row.teams?.home?.name||'';
      const away=row.teams?.away?.name||'';
      const oppName=fixture.venue==='H'?away:home;
      if(!namesMatch(oppName,fixture.opp)&&!namesMatch(fixture.opp,oppName))return false;
      try{
        const fd=parseFixtureDate(fixture.date);
        const apiD=row.fixture?.date?new Date(row.fixture.date):null;
        if(apiD&&fd){
          const diff=Math.abs(apiD-fd);
          if(diff>3*24*3600*1000)return false;
        }
      }catch(_){}
      return true;
    });
    if(!match)continue;
    const homeId=match.teams?.home?.id;
    const isHome=homeId===API_FOOTBALL_MU_ID;
    const gh=+match.goals?.home, ga=+match.goals?.away;
    if(Number.isNaN(gh)||Number.isNaN(ga))continue;
    const muScore=isHome?gh:ga;
    const oppScore=isHome?ga:gh;
    const oppLabel=isHome?(match.teams?.away?.name||fixture.opp):(match.teams?.home?.name||fixture.opp);
    const hl=HIGHLIGHT_IDS[fixture.id];
    const hlText=fixture.venue==='H'
      ?`Full time · Man United ${muScore}–${oppScore} ${oppLabel}.`
      :`Full time · ${oppLabel} ${oppScore}–${muScore} Man United.`;
    S.records[keyId]={
      mu:muScore,opp:oppScore,auto:true,
      highlight:hlText,
      videoId:hl?.id||null,videoExtended:hl?.extended||null,
      source:'api-football'
    };
    changed=true;
  }
  if(changed){try{await saveData()}catch(_){}}
  return changed;
}

export async function autoImportResults(){
  /* Seed curated results (UCL etc.) that the PL scoreboard cannot provide */
  let changed=false;
  for(const f of FIXTURES){
    const key=String(f.id);
    if(S.records[key]?.mu!==undefined)continue;
    const known=KNOWN_RESULTS[f.id]||KNOWN_RESULTS[key];
    if(!known)continue;
    if(!isOnOrAfterMatchDay(f))continue;
    const hl=HIGHLIGHT_IDS[f.id];
    S.records[key]={
      mu:+known.mu,opp:+known.opp,auto:true,
      highlight:known.highlight||`Full time · Man United ${known.mu}–${known.opp} ${f.opp}.`,
      videoId:hl?.id||null,videoExtended:hl?.extended||null
    };
    changed=true;
  }
  if(changed){try{await saveData()}catch(_){}}

  /* UCL via API-Football (when key is set) */
  try{await importUclFromApiFootball()}catch(e){console.warn('UCL import',e)}

  /* Allow retries while unfinished fixtures still lack scores (match can finish mid-afternoon). */
  const toCheck=FIXTURES.filter(f=>{
    const rec=S.records[f.id]||S.records[String(f.id)];
    return !(rec&&rec.mu!==undefined) && isOnOrAfterMatchDay(f);
  });
  if(!toCheck.length){
    for(const f of FIXTURES){
      const key=String(f.id),rec=S.records[key];
      if(!rec||rec.mu===undefined)continue;
      const known=HIGHLIGHT_IDS[f.id];
      if(known&&(!rec.videoId||rec.videoId!==known.id)){
        rec.videoId=known.id;rec.videoExtended=known.extended||null;changed=true;
      }
    }
    if(changed){try{await saveData()}catch(_){}}
    return;
  }
  const byDate={};
  for(const fixture of toCheck){
    const ymd=toYmd(parseFixtureDate(fixture.date));
    (byDate[ymd]=byDate[ymd]||[]).push(fixture);
  }
  for(const [ymd,fixtures] of Object.entries(byDate)){
    try{
      const res=await fetch(`${API_BASE}/scoreboard?dates=${ymd}`);
      if(!res.ok){console.warn('autoImport scoreboard',ymd,res.status);continue}
      const data=await res.json();
      const events=data.events||[];
      for(const fixture of fixtures){
        if(S.records[String(fixture.id)]?.mu!==undefined)continue;
        for(const ev of events){
          const st=ev.status?.type||{};
          const completed=!!st.completed || st.name==='STATUS_FULL_TIME' || (st.state||'')==='post';
          if(!completed)continue;
          const comps=ev.competitions||[];
          for(const c of comps){
            const competitors=c.competitors||[];
            let mu=null,opp=null;
            for(const t of competitors){
              if(isManUnited(t.team))mu=t;else opp=t;
            }
            if(!mu||!opp)continue;
            const oppName=opp.team?.displayName||opp.team?.name||'';
            if(fixture.opp && !namesMatch(oppName,fixture.opp) && !namesMatch(fixture.opp,oppName))continue;
            const muScore=+mu.score,oppScore=+opp.score;
            if(Number.isNaN(muScore)||Number.isNaN(oppScore))continue;
            const key=String(fixture.id);
            const known=HIGHLIGHT_IDS[fixture.id];
            const hlText=fixture.venue==='H'
              ?`Full time · Man United ${muScore}–${oppScore} ${oppName}.`
              :`Full time · ${oppName} ${oppScore}–${muScore} Man United.`;
            S.records[key]={mu:muScore,opp:oppScore,auto:true,highlight:hlText,videoId:known?.id||null,videoExtended:known?.extended||null};
            changed=true;
          }
        }
      }
    }catch(e){console.warn('autoImport',ymd,e)}
  }
  for(const f of FIXTURES){
    const key=String(f.id),rec=S.records[key];
    if(!rec||rec.mu===undefined)continue;
    const known=HIGHLIGHT_IDS[f.id];
    if(known){
      if(rec.videoId!==known.id||(known.extended&&rec.videoExtended!==known.extended)){
        rec.videoId=known.id;rec.videoExtended=known.extended||null;changed=true;
      }
    }else if(!rec.videoId){
      const found=await searchHighlights(f);
      if(found){rec.videoId=found.id;rec.videoExtended=found.extended;changed=true}
    }
  }
  if(changed){try{await saveData()}catch(_){}}
}

export async function fetchStandings(){try{const res=await fetch(`${API_BASE}/standings?season=2026`);if(!res.ok)return;const data=await res.json();const entries=data?.children?.[0]?.standings?.entries||[];S.standings=entries.map(e=>{const stats={};(e.stats||[]).forEach(s=>{stats[s.name]=s.displayValue});return{name:e.team?.displayName||e.team?.name||'?',rank:+stats.rank||0,p:+stats.gamesPlayed||0,gd:+stats.pointDifferential||0,pts:+stats.points||0,isMu:isManUnited(e.team)}}).sort((a,b)=>a.rank-b.rank);S.muTable=S.standings.find(s=>s.isMu)||null}catch(e){console.warn(e)}}

export async function fetchNews(next){const queries=[];if(next){queries.push(`Manchester United ${next.opp} when:14d`);queries.push(`"Man United" OR "Manchester United" preview ${next.opp} when:14d`)}queries.push('Manchester United team news when:7d');const items=[],seen=new Set();for(const q of queries){try{const rss=`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-GB&gl=GB&ceid=GB:en`;const res=await fetch(RSS2JSON+encodeURIComponent(rss));if(!res.ok)continue;const data=await res.json();for(const it of(data.items||[]).slice(0,6)){const title=it.title||'';if(seen.has(title))continue;seen.add(title);let src=it.author||'',clean=title;const dash=title.lastIndexOf(' - ');if(dash>0){src=title.slice(dash+3);clean=title.slice(0,dash)}items.push({title:clean,link:it.link,source:src,date:it.pubDate})}}catch(e){console.warn(e)}if(items.length>=8)break}S.newsItems=items.slice(0,8)}

export async function seedInjuries(){if(S.injuriesRef){try{await set(S.injuriesRef,DEFAULT_INJURIES)}catch(_){}}}
