# mu-matchday-tracker

Manchester United **2026/27** season companion.

## Current live app

GitHub Pages loads the last stable full single-file app (commit `77f6aaa`) via a thin loader.

## Target structure (in progress)

```
index.html          # shell only
styles.css          # all styles
js/constants.js     # fixtures (PL + UCL), Firebase config, curated data  ✓ landed
js/app.js           # state · domain · data · UI · boot  (landing next)
```

No bundler. ES modules.

## Planned UX

- **Focus** home: last 3 results + next 4 fixtures only
- Tabs: Focus | Played | Next up | All
- Champions League league-phase fixtures on the same timeline

## Run locally

Open `index.html` or `npx serve .`
