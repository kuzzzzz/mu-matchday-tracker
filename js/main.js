/**
 * main.js — boot + Firebase listeners
 */
import { onValue } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js';
import { STORAGE_KEY } from './constants.js';
import { S } from './state.js';
import { nextUnplayed } from './ui-buildup.js';
import { render } from './ui.js';
import { fetchStandings, autoImportResults, fetchNews, seedInjuries } from './data.js';

function loadLocalRecords(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed=JSON.parse(raw);
      if(parsed&&typeof parsed==='object'){
        const n={};
        Object.keys(parsed).forEach(k=>{n[String(k)]=parsed[k]});
        S.records=n;
      }
    }
  }catch(_){}
}

async function hydrate(){
  await fetchStandings();
  await autoImportResults();
  await fetchNews(nextUnplayed());
  render();
}

function attachRecordsListener(){
  if(!S.recordsRef){
    loadLocalRecords();
    hydrate();
    return;
  }
  onValue(
    S.recordsRef,
    async snap=>{
      S.loadError=null;
      const val=snap.val();
      S.records=val&&typeof val==='object'?val:{};
      const n={};
      Object.keys(S.records).forEach(k=>{n[String(k)]=S.records[k]});
      S.records=n;
      try{localStorage.setItem(STORAGE_KEY,JSON.stringify(S.records))}catch(_){}
      render();
      await hydrate();
    },
    err=>{
      const msg=err&&err.message?err.message:'Firebase read failed';
      if(/permission_denied/i.test(msg)){
        S.loadError='Firebase blocked /records (permission_denied). Open Firebase Console → Realtime Database → Rules and allow read/write for records, discuss, injuries. Falling back to local data.';
      }else{
        S.loadError=msg;
      }
      loadLocalRecords();
      render();
      hydrate();
    }
  );
}

function attachInjuriesListener(){
  if(!S.injuriesRef)return;
  onValue(
    S.injuriesRef,
    snap=>{
      const val=snap.val();
      if(val&&val.players)S.injuries=val;
      else seedInjuries();
      render();
    },
    ()=>{/* ignore — local DEFAULT_INJURIES already set */}
  );
}

function attachDiscussListener(){
  if(!S.discussRef)return;
  onValue(
    S.discussRef,
    snap=>{
      const val=snap.val()||{};
      S.discussions={};
      Object.keys(val).forEach(fid=>{
        const obj=val[fid]||{};
        const list=obj&&typeof obj==='object'&&!Array.isArray(obj)
          ?Object.keys(obj).map(k=>({id:k,...obj[k]}))
          :Array.isArray(obj)?obj:[];
        S.discussions[String(fid)]=list.sort((a,b)=>(a.ts||0)-(b.ts||0));
      });
      render();
    },
    ()=>{/* discuss optional when rules block */}
  );
}

export async function boot(){
  render();
  attachRecordsListener();
  attachInjuriesListener();
  attachDiscussListener();
}

boot();
