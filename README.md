# mu-matchday-tracker

Manchester United 2026/27 matchday companion — scores, highlights, news, and **your personal prediction archive**.

Not another football site. A season-long digital companion you own.

## Live features

- Auto score import + curated YouTube highlights (thumbnail banners)
- Matchday build-up: standings, injuries, dynamic news
- Fans area: predictions on upcoming games, comments after kick-off
- **My Season** panel: your prediction history, hit rate, exact scores, form pips, points
- Your call shown on every ticket (exact / correct result / miss)
- Season framed as the primary object (2026/27 live archive; future seasons shell ready)

## Live sync (all browsers)

Results and fan discussion sync via **Firebase Realtime Database**.

Stamp a result or lock a prediction on your phone → it appears everywhere.

### One-time setup (~2 minutes)

1. Open Firebase Console → Create a project.
2. Build → Realtime Database → Create Database (test mode or rules below).
3. Project settings → Your apps → Web app → copy `firebaseConfig`.
4. Paste into the app (search for `firebaseConfig` inside the loaded app).
5. Commit & push.

Suggested rules:

```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

(Tighten later for production.)

## Run locally

Open `index.html` in a browser, or:

```
npx serve .
```

## Design filter

Every feature is filtered by: **memory · utility · identity · ownership**.

Premium archives, personalised season books, and collectibles are the long-term direction for fans who care.
