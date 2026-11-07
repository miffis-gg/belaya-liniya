import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const dir = '.impeccable/review';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', args: ['--disable-gpu'] });
for (const width of [1440, 768, 390]) {
  const name = width === 1440 ? 'desktop' : width === 768 ? 'tablet' : 'mobile';
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: 'reduce',
  });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  await page.goto('http://127.0.0.1:5173');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${dir}/hero-${width}.png` });
  for (const img of await page.locator('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((i) => i.decode());
  }
  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${dir}/sticky-${width}.png` });
  if (width === 390) {
    await page.getByRole('button', { name: 'Открыть меню' }).click();
    await page.screenshot({ path: `${dir}/menu-390.png` });
    await page.keyboard.press('Escape');
  }
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(200);
  // Record native chrome separately, then stitch the long content without repeated
  // fixed UI over each strip. Header retains its normal reserved layout space.
  await page.addStyleTag({
    content:
      'header{position:static!important;animation:none!important}a[href="#main"]{visibility:hidden!important}aside[aria-label="Быстрая демонстрационная запись"]{visibility:hidden!important}',
  });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const pieces = [];
  for (let y = 0; y < height; y += 1000) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(35);
    const top = Math.round(await page.evaluate(() => scrollY));
    pieces.push({ input: await page.screenshot(), top, left: 0 });
    if (top + 1000 >= height) break;
  }
  const full = `${dir}/${name}.png`;
  await sharp({ create: { width, height, channels: 3, background: '#F5F3ED' } })
    .composite(pieces)
    .png()
    .toFile(full);
  for (let y = 0, index = 1; y < height; y += 4000, index++)
    await sharp(full)
      .extract({ left: 0, top: y, width, height: Math.min(4000, height - y) })
      .png()
      .toFile(`${dir}/${name}-part-${index}.png`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(100);
  for (const id of [
    'doctors',
    'first-visit',
    'results',
    'safety',
    'appointment',
    'contacts',
    'faq',
  ]) {
    const box = await page.locator('#' + id).boundingBox();
    const top = Math.round(box.y);
    await sharp(full)
      .extract({
        left: Math.max(0, Math.round(box.x)),
        top,
        width: Math.min(width, Math.round(box.width)),
        height: Math.min(height - top, Math.round(box.height)),
      })
      .png()
      .toFile(`${dir}/${id}-${width}.png`);
  }
  await page.locator('#problem-pain').click();
  await page
    .locator('#recommendations')
    .screenshot({ path: `${dir}/recommendations-${width}.png` });
  await page
    .locator('#appointment')
    .getByRole('button', { name: 'Показать подтверждение' })
    .click();
  await page.locator('#appointment').screenshot({ path: `${dir}/errors-${width}.png` });
  await page.locator('#form-name').fill('Анна');
  await page.locator('#form-phone').fill('+7 999 123 45 67');
  await page.locator('#form-preferredTime').selectOption('Утро, 8:00–12:00');
  await page.locator('#form-consent').check();
  await page.getByRole('button', { name: 'Показать подтверждение' }).click();
  await page.getByRole('heading', { name: 'Демонстрационная запись готова' }).waitFor();
  await page.locator('#appointment').screenshot({ path: `${dir}/success-${width}.png` });
  console.log(
    JSON.stringify({
      width,
      height,
      consoleErrors,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    }),
  );
  await page.close();
}
await browser.close();
