# mu-matchday-tracker

Manchester United **2026/27** season companion.

## Structure

```
index.html          # shell
styles.css          # styles
js/constants.js     # fixtures (PL + UCL), config, curated data
js/state.js         # shared mutable state + Firebase refs
js/domain.js        # pure helpers (scores, dates, stats)
js/data.js          # saves, auto-import, standings, news, highlights
js/ui-panels.js     # buildup panels, video banner, fan dialog
js/ui.js            # tickets + main render (Focus home view)
js/main.js          # boot
```

No bundler. ES modules only.

## Features

- **Focus** (default): last 3 results + next 4 fixtures
- Tabs: Focus · Played · Next up · All
- Premier League + Champions League fixtures
- Auto scores, highlight banners, news, fan predictions

## Run

`npx serve .` or GitHub Pages
