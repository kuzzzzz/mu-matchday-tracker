/**
 * state.js — shared mutable state bag
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getDatabase, ref } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js';
import { firebaseConfig, DEFAULT_INJURIES } from './constants.js';

export const root = document.getElementById('mu-root');

export const S = {
  records: {},
  discussions: {},
  filter: 'focus',
  standings: [],
  muTable: null,
  injuries: DEFAULT_INJURIES,
  newsItems: [],
  loadError: null,
  autoImportDone: false,
  openDialogFid: null,
  recordsRef: null,
  injuriesRef: null,
  discussRef: null,
  db: null,
};

try {
  const app = initializeApp(firebaseConfig);
  S.db = getDatabase(app);
  S.recordsRef = ref(S.db, 'records');
  S.injuriesRef = ref(S.db, 'injuries');
  S.discussRef = ref(S.db, 'discuss');
} catch (e) {
  S.loadError = e.message || 'Firebase init failed';
}
