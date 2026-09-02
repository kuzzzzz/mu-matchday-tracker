# mu-matchday-tracker

Manchester United **2026/27** season companion — scores, highlights, news, predictions.

## Structure

```
index.html          # shell only
styles.css          # all styles
js/constants.js     # fixtures (PL + UCL), Firebase config, curated highlights/injuries
js/app.js           # state · domain · data/API · UI · boot
```

No bundler. ES modules. Edit fixtures in `js/constants.js`; UI logic in `js/app.js` (section-marked).

## Features

- **Focus** (default home): last 3 results + next 4 fixtures
- **Played / Next up / All**: full lists when needed
- Premier League + Champions League league-phase fixtures
- Auto PL scores, YouTube highlight banners, matchday news, fan predictions

## Run

Open `index.html` via any static server (`npx serve .`) or GitHub Pages.
