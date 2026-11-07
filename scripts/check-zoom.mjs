import { chromium } from '@playwright/test';

// Uses a separate ignored profile; never changes the user's Edge settings.
// Verify zoom through the real browser setting and page geometry. Headless
// screenshot APIs are unreliable with browser zoom, so no zoom raster is saved.
const context = await chromium.launchPersistentContext('.impeccable/zoom-profile', {
  channel: 'msedge', headless: true, viewport: null,
  args: ['--window-size=1440,1000', '--disable-gpu'],
});
try {
  const page = await context.newPage();
  await page.goto('edge://settings/appearance');
  const available = await page.evaluate(() => typeof chrome.settingsPrivate?.setDefaultZoom === 'function');
  if (!available) throw new Error('Browser settings zoom API is unavailable.');
  await page.evaluate(() => new Promise((resolve) => chrome.settingsPrivate.setDefaultZoom(2, resolve)));
  await page.goto('http://127.0.0.1:4173');
  await page.evaluate(() => document.fonts.ready);
  const geometry = await page.evaluate(() => ({
    innerWidth, outerWidth, devicePixelRatio,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  console.log(JSON.stringify(geometry));
  if (Math.abs(geometry.devicePixelRatio - 2) >= 0.02 || geometry.outerWidth / geometry.innerWidth <= 1.95)
    throw new Error('Actual browser zoom 200% was not applied.');
  if (geometry.scrollWidth > geometry.innerWidth) throw new Error('Horizontal overflow at 200%.');
  await page.locator('#problem-children').click();
  await page.locator('#form-direction').selectOption('treatment');
  if ((await page.locator('#form-direction').inputValue()) !== 'treatment')
    throw new Error('Direction change failed at 200%.');
  console.log('Actual browser zoom 200% verified: no horizontal overflow; selector and form usable.');
} finally {
  await context.close();
}
