/**
 * constants.js — static config & season data (no runtime state)
 */
export const firebaseConfig = {apiKey:"AIzaSyBZ_KO97a6ZjIdQDKADwJD9J5bv0ozfrPs",authDomain:"manumatchlog.firebaseapp.com",databaseURL:"https://manumatchlog-default-rtdb.europe-west1.firebasedatabase.app",projectId:"manumatchlog",storageBucket:"manumatchlog.firebasestorage.app",messagingSenderId:"723395600000",appId:"1:723395600000:web:ee1a72c1288ad7c7345065",measurementId:"G-NRK67M2WTE"};

export const API_BASE = 'https://worldcup26.ir/get/soccer/eng.1';
export const PIPED = 'https://api.piped.private.coffee';
export const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';
export const MU_CHANNEL = 'UC6yW44UGJJBvYTlfC7CRg2Q';

export const MONTHS = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};

export const HIGHLIGHT_IDS = {1:{id:'n72HGVMWzVE',extended:'ICbp7kdsVFg'},2:{id:'o5IagQpM_kE'}};

export const DEFAULT_INJURIES = {updated:'23 Aug 2026',source:'https://www.premierinjuries.com/teams/manchester-united',players:[{name:'Matthijs de Ligt',reason:'Lower back',status:'out',return:'06/09/2026',note:'Back training; not involved yet'},{name:'Mason Mount',reason:'Ankle/foot',status:'doubt',return:'30/08/2026',note:'Touch and go'},{name:'Manuel Ugarte',reason:'Knee (surgery)',status:'out',return:'TBC',note:'World Cup ligament surgery'},{name:'Amad Diallo',reason:'Niggle',status:'out',return:'TBC',note:'Training niggle end of week'},{name:'Tom Heaton',reason:'Knock',status:'doubt',return:'TBC',note:'Being assessed'}]};

/** PL + UCL league phase, chronological */
export const FIXTURES = [
  { id: 1, gw: 1, date: 'Sat 22 Aug 2026', opp: 'Hull City', venue: 'A', comp: 'PL' },
  { id: 2, gw: 2, date: 'Sun 30 Aug 2026', opp: 'Ipswich Town', venue: 'H', comp: 'PL' },
  { id: 3, gw: 3, date: 'Sun 6 Sep 2026', opp: 'Everton', venue: 'A', comp: 'PL' },
  { id: 101, gw: null, date: 'Thu 10 Sep 2026', opp: 'Sabah', venue: 'H', comp: 'UCL', md: 1 },
  { id: 4, gw: 4, date: 'Sun 13 Sep 2026', opp: 'Manchester City', venue: 'H', comp: 'PL' },
  { id: 5, gw: 5, date: 'Sun 20 Sep 2026', opp: 'Fulham', venue: 'A', comp: 'PL' },
  { id: 6, gw: 6, date: 'Sat 10 Oct 2026', opp: 'Tottenham', venue: 'H', comp: 'PL' },
  { id: 102, gw: null, date: 'Tue 13 Oct 2026', opp: 'Atlético Madrid', venue: 'A', comp: 'UCL', md: 2 },
  { id: 7, gw: 7, date: 'Sun 18 Oct 2026', opp: 'Leeds United', venue: 'A', comp: 'PL' },
  { id: 103, gw: null, date: 'Wed 21 Oct 2026', opp: 'Como', venue: 'A', comp: 'UCL', md: 3 },
  { id: 8, gw: 8, date: 'Sun 25 Oct 2026', opp: 'Bournemouth', venue: 'H', comp: 'PL' },
  { id: 9, gw: 9, date: 'Sat 31 Oct 2026', opp: 'Chelsea', venue: 'A', comp: 'PL' },
  { id: 104, gw: null, date: 'Tue 3 Nov 2026', opp: 'Roma', venue: 'H', comp: 'UCL', md: 4 },
  { id: 10, gw: 10, date: 'Sat 7 Nov 2026', opp: 'Aston Villa', venue: 'H', comp: 'PL' },
  { id: 11, gw: 11, date: 'Sat 21 Nov 2026', opp: 'Liverpool', venue: 'A', comp: 'PL' },
  { id: 105, gw: null, date: 'Wed 25 Nov 2026', opp: 'Sporting CP', venue: 'A', comp: 'UCL', md: 5 },
  { id: 12, gw: 12, date: 'Sat 28 Nov 2026', opp: 'Brentford', venue: 'H', comp: 'PL' },
  { id: 13, gw: 13, date: 'Wed 2 Dec 2026', opp: 'Newcastle', venue: 'A', comp: 'PL' },
  { id: 14, gw: 14, date: 'Sat 5 Dec 2026', opp: 'Coventry City', venue: 'H', comp: 'PL' },
  { id: 106, gw: null, date: 'Tue 8 Dec 2026', opp: 'RB Leipzig', venue: 'H', comp: 'UCL', md: 6 },
  { id: 15, gw: 15, date: 'Sat 12 Dec 2026', opp: 'Crystal Palace', venue: 'A', comp: 'PL' },
  { id: 16, gw: 16, date: 'Sat 19 Dec 2026', opp: 'Arsenal', venue: 'A', comp: 'PL' },
  { id: 17, gw: 17, date: 'Sat 26 Dec 2026', opp: 'Nottingham Forest', venue: 'H', comp: 'PL' },
  { id: 18, gw: 18, date: 'Wed 30 Dec 2026', opp: 'Sunderland', venue: 'H', comp: 'PL' },
  { id: 19, gw: 19, date: 'Sat 2 Jan 2027', opp: 'Brighton', venue: 'A', comp: 'PL' },
  { id: 20, gw: 20, date: 'Wed 6 Jan 2027', opp: 'Newcastle', venue: 'H', comp: 'PL' },
  { id: 21, gw: 21, date: 'Sat 16 Jan 2027', opp: 'Aston Villa', venue: 'A', comp: 'PL' },
  { id: 107, gw: null, date: 'Wed 20 Jan 2027', opp: 'Bayern Munich', venue: 'H', comp: 'UCL', md: 7 },
  { id: 22, gw: 22, date: 'Sat 23 Jan 2027', opp: 'Liverpool', venue: 'H', comp: 'PL' },
  { id: 108, gw: null, date: 'Wed 27 Jan 2027', opp: 'Villarreal', venue: 'A', comp: 'UCL', md: 8 },
  { id: 23, gw: 23, date: 'Sat 30 Jan 2027', opp: 'Brentford', venue: 'A', comp: 'PL' },
  { id: 24, gw: 24, date: 'Sat 6 Feb 2027', opp: 'Chelsea', venue: 'H', comp: 'PL' },
  { id: 25, gw: 25, date: 'Wed 10 Feb 2027', opp: 'Brighton', venue: 'H', comp: 'PL' },
  { id: 26, gw: 26, date: 'Sat 20 Feb 2027', opp: 'Nottingham Forest', venue: 'A', comp: 'PL' },
  { id: 27, gw: 27, date: 'Sat 27 Feb 2027', opp: 'Arsenal', venue: 'H', comp: 'PL' },
  { id: 28, gw: 28, date: 'Wed 3 Mar 2027', opp: 'Sunderland', venue: 'A', comp: 'PL' },
  { id: 29, gw: 29, date: 'Sat 13 Mar 2027', opp: 'Everton', venue: 'H', comp: 'PL' },
  { id: 30, gw: 30, date: 'Sat 20 Mar 2027', opp: 'Manchester City', venue: 'A', comp: 'PL' },
  { id: 31, gw: 31, date: 'Sat 10 Apr 2027', opp: 'Hull City', venue: 'H', comp: 'PL' },
  { id: 32, gw: 32, date: 'Sat 17 Apr 2027', opp: 'Ipswich Town', venue: 'A', comp: 'PL' },
  { id: 33, gw: 33, date: 'Sat 24 Apr 2027', opp: 'Crystal Palace', venue: 'H', comp: 'PL' },
  { id: 34, gw: 34, date: 'Sat 1 May 2027', opp: 'Coventry City', venue: 'A', comp: 'PL' },
  { id: 35, gw: 35, date: 'Sat 8 May 2027', opp: 'Bournemouth', venue: 'A', comp: 'PL' },
  { id: 36, gw: 36, date: 'Sat 15 May 2027', opp: 'Leeds United', venue: 'H', comp: 'PL' },
  { id: 37, gw: 37, date: 'Sun 23 May 2027', opp: 'Tottenham', venue: 'A', comp: 'PL' },
  { id: 38, gw: 38, date: 'Sun 30 May 2027', opp: 'Fulham', venue: 'H', comp: 'PL' },
];

export const STORAGE_KEY = 'mu-tracker-data-v1';
export const NICK_KEY = 'mu-tracker-nick';
