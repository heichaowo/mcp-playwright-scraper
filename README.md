# mcp-playwright-scraper

A lightweight Node.js web scraper that uses Playwright to render JavaScript-heavy pages and converts them to clean Markdown.

## Features

- 🎭 Playwright-powered headless browser — handles JS-rendered pages
- 📄 [Readability](https://github.com/mozilla/readability) for main content extraction
- ✨ Clean Markdown output via [Turndown](https://github.com/mixmark-io/turndown)
- 🔓 Basic anti-scraping bypass (realistic user agent, viewport)
- 🚀 Zero config, single script

## Requirements

- Node.js 18+
- Playwright Chromium browser

## Installation

```bash
npm install
npx playwright install chromium
```

## Usage

```bash
# Extract main article content (default)
node scrape.mjs https://example.com

# Full page content
node scrape.mjs https://example.com --full
```

## Output

Outputs clean Markdown to stdout. Redirect to a file:

```bash
node scrape.mjs https://example.com > output.md
```

## How it works

1. Launches a headless Chromium browser via Playwright
2. Navigates to the URL and waits for JS to render
3. Extracts the main content using Mozilla's Readability
4. Converts HTML to Markdown using Turndown
5. Outputs to stdout

## License

MIT
