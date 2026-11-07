import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { writeFile, mkdir } from 'node:fs/promises';
await mkdir('.impeccable/review', { recursive: true });
for (const formFactor of ['mobile', 'desktop']) {
  const chrome = await launch({
    chromePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    chromeFlags: ['--headless', '--no-first-run', '--disable-extensions'],
  });
  try {
    const result = await lighthouse('http://127.0.0.1:4173/', {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor,
      screenEmulation:
        formFactor === 'desktop'
          ? { mobile: false, width: 1440, height: 1000, deviceScaleFactor: 1, disabled: false }
          : undefined,
    });
    await writeFile(`.impeccable/review/lighthouse-${formFactor}.json`, result.report);
    console.log(
      formFactor,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, c]) => [key, Math.round(c.score * 100)]),
        ),
      ),
    );
    console.log(
      'metrics',
      JSON.stringify(
        Object.fromEntries(
          [
            'first-contentful-paint',
            'largest-contentful-paint',
            'total-blocking-time',
            'cumulative-layout-shift',
          ].map((key) => [key, result.lhr.audits[key].displayValue]),
        ),
      ),
    );
    console.log(
      'findings',
      JSON.stringify(
        Object.values(result.lhr.audits)
          .filter((a) => a.score !== null && a.score < 0.9 && a.details?.type !== 'opportunity')
          .map((a) => ({ id: a.id, title: a.title, score: a.score }))
          .slice(0, 10),
      ),
    );
  } finally {
    await chrome.kill();
  }
}
