# mu-matchday-tracker

Manchester United **2026/27** season companion — scores, highlights, news, predictions.

## Structure (no bundler)

```
index.html           # shell only
styles.css           # all styles
js/
  constants.js       # fixtures (PL + UCL), Firebase config, curated data
  state.js           # shared mutable state + Firebase refs
  domain.js          # pure helpers (dates, scores, stats, yt URLs)
  data.js            # saves, auto-import, standings, news, highlights
  ui-buildup.js      # table, injuries, news, next-match notes
  ui-fans.js         # video banner + fan dialog markup
  ui-tickets.js      # match ticket cards
  ui.js              # main render (Focus home) + dialog binding
  main.js            # boot + live listeners
```

Edit fixtures in `js/constants.js`. UI logic is split so each file stays small and clear.

## Features

- **Focus** (default home): last 3 results + next 4 fixtures only
- Tabs: Focus · Played · Next up · All
- Premier League + Champions League league-phase fixtures
- Auto PL scores, YouTube highlight banners, matchday news, fan predictions

## Run

GitHub Pages, or locally:

```bash
npx serve .
```
