# mu-matchday-tracker

Manchester United 2026/27 matchday tracker — scores and highlights.

## Live sync (all browsers)

Results sync automatically via **Firebase Realtime Database**. Stamp a result on your phone → it appears on your laptop immediately.

### One-time setup (~2 minutes)

1. Open [Firebase Console](https://console.firebase.google.com) → **Create a project** (name it e.g. `mu-matchday`).
2. Left menu → **Build** → **Realtime Database** → **Create Database**.
   - Pick a region close to you.
   - Start in **test mode** (or set the rules below).
3. Gear icon → **Project settings** → **Your apps** → add a **Web** app.
4. Copy the `firebaseConfig` object.
5. Open `index.html` in this repo, find the config block near the top of the script, and paste your values over the placeholders.
6. Commit & push.

**Database rules** (Realtime Database → Rules) — fine for a personal tracker:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> Anyone with the site URL can read/write. For a private log later, switch to Auth + tighter rules.

### Without Firebase

The app still works: it falls back to `data.json` in the repo + `localStorage` on each device. Tell Grok to log a result if you want the shared file updated.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```
