#!/usr/bin/env node
/**
 * scrape.mjs - Playwright-based web scraper
 * Usage: node scrape.mjs <url> [--full]
 * --full: return full HTML content instead of readability-extracted main content
 */

import { chromium } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

const url = process.argv[2];
const fullMode = process.argv.includes('--full');

if (!url) {
  console.error('Usage: node scrape.mjs <url> [--full]');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 800 }
});

const page = await context.newPage();

try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  // 等 JS 渲染
  await page.waitForTimeout(1500);

  const html = await page.content();
  const pageTitle = await page.title();

  if (fullMode) {
    // 直接转 Markdown
    const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    console.log(td.turndown(html));
  } else {
    // 用 Readability 提取正文
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.error('Readability: 无法提取正文，尝试 --full 模式');
      process.exit(1);
    }

    const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    const markdown = td.turndown(article.content);

    console.log(`# ${article.title || pageTitle}\n`);
    console.log(`> 来源: ${url}\n`);
    console.log(markdown);
  }
} catch (err) {
  console.error('抓取失败:', err.message);
  process.exit(1);
} finally {
  await browser.close();
}
