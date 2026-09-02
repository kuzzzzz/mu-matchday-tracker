# mu-matchday-tracker

Manchester United **2026/27** season companion — scores, highlights, news, predictions.

## Live

- **Focus** (default): last 3 results + next 4 fixtures
- Tabs: Focus · Played · Next up · All
- Premier League + Champions League fixtures
- Auto scores, highlight banners, matchday news, fan predictions

Loader decompresses the full app from `p0.txt`–`p2.txt` (gzip).

## Structure

```
index.html       # thin gzip loader
p0.txt…p2.txt    # compressed full app (Focus + UCL)
js/constants.js  # fixtures + config (source)
styles.css       # styles
```

## Run

Open `index.html` on GitHub Pages or `npx serve .`
