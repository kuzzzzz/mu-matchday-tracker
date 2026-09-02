# mu-matchday-tracker

Manchester United **2026/27** season companion — scores, highlights, news, predictions, and personal archive.

## Live view

- **Focus** (default): last few results + next few fixtures only — clean first screen
- **Played / Next up / All**: full list when you want it
- **Premier League + Champions League** fixtures in one timeline
- Auto scores, YouTube highlight banners, matchday news, fan predictions

## Setup (Firebase — optional live sync)

1. Create a Firebase project → Realtime Database (europe-west1)
2. Add a web app and paste `firebaseConfig` into the loaded app if you self-host a full copy
3. Rules: allow read/write for `/records`, `/injuries`, `/discuss` in test mode while developing

The public GitHub Pages site loads a compressed full app (focus + UCL) via chunked gzip.

## Run locally

Open `index.html` or `npx serve .`
