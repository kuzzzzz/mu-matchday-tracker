/**
 * main.js — boot + Firebase listeners
 */
import { onValue } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js';
import { STORAGE_KEY } from './constants.js';
import { S } from './state.js';
import { nextUnplayed } from './ui-buildup.js';
import { render } from './ui.js';
import { fetchStandings, autoImportResults, fetchNews, seedInjuries } from './data.js';

export async function boot(){render();if(S.recordsRef){onValue(S.recordsRef,async snap=>{const val=snap.val();S.records=val&&typeof val==='object'?val:{};const n={};Object.keys(S.records).forEach(k=>{n[String(k)]=S.records[k]});S.records=n;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(S.records))}catch(_){}render();await fetchStandings();await autoImportResults();await fetchNews(nextUnplayed());render()},err=>{S.loadError=err.message||'Firebase read failed';render()})}else{try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)S.records=JSON.parse(raw)}catch(_){}await fetchStandings();await autoImportResults();await fetchNews(nextUnplayed());render()}if(S.injuriesRef){onValue(S.injuriesRef,snap=>{const val=snap.val();if(val&&val.players)S.injuries=val;else seedInjuries();render()})}if(S.discussRef){onValue(S.discussRef,snap=>{const val=snap.val()||{};S.discussions={};Object.keys(val).forEach(fid=>{const obj=val[fid]||{};S.discussions[fid]=Object.keys(obj).map(k=>({id:k,...obj[k]})).sort((a,b)=>(a.ts||0)-(b.ts||0))});render()})}}

boot();
