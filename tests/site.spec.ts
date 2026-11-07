import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
});
test('all sections, assets and initial state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await expect(page.locator('h1')).toHaveCount(1);
  for (const id of [
    'top',
    'recommendations',
    'services',
    'doctors',
    'first-visit',
    'results',
    'safety',
    'prices',
    'faq',
    'appointment',
    'contacts',
  ])
    await expect(page.locator('#' + id)).toBeAttached();
  await expect(page.locator('#form-direction')).toHaveValue('');
  await expect(page.locator('#services article')).toHaveCount(14);
  await expect(page.locator('#prices tbody tr')).toHaveCount(14);
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  for (const img of await page.locator('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  }
  expect(errors).toEqual([]);
});
test('five problems, announcement and prefilled form', async ({ page }) => {
  for (const id of ['pain', 'treatment', 'implantation', 'aesthetics', 'children']) {
    await page.locator('#problem-' + id).click();
    await expect(page.locator('#problem-' + id)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#recommendations article')).toHaveCount(3);
    await expect(page.locator('#form-direction')).toHaveValue(id);
  }
  await page.getByRole('link', { name: 'Записаться по этому направлению' }).click();
  await expect(page.locator('#form-direction')).toHaveValue('children');
  await page.locator('#form-direction').selectOption('treatment');
  await expect(page.locator('#problem-treatment')).toHaveAttribute('aria-pressed', 'true');
});
test('service and specialist choices', async ({ page }) => {
  await page
    .locator('#services')
    .getByRole('button', { name: 'Выбрать: Имплантация одного зуба', exact: true })
    .click();
  await expect(page.locator('#form-direction')).toHaveValue('implantation');
  await expect(page.locator('#appointment')).toContainText('Вы выбрали: Имплантация одного зуба');
  await page.getByRole('button', { name: 'Выбрать специалиста: Елена Орлова' }).click();
  await expect(page.locator('#form-direction')).toHaveValue('children');
  await expect(page.locator('#appointment')).toContainText('Елена Орлова');
});
test('all service and price filters', async ({ page }) => {
  for (const section of ['services', 'prices']) {
    const group = page.locator('#' + section).getByRole('group');
    for (const b of await group.getByRole('button').all()) {
      await b.click();
      await expect(b).toHaveAttribute('aria-pressed', 'true');
      expect(
        await page
          .locator('#' + section + (section === 'services' ? ' article' : ' tbody tr'))
          .count(),
      ).toBeGreaterThan(0);
    }
  }
});
test('FAQ keyboard and multiple panels', async ({ page }) => {
  const first = page.locator('#faq-button-pain');
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  const second = page.locator('#faq-button-cost');
  await second.focus();
  await page.keyboard.press('Space');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-panel-pain')).toBeVisible();
  await first.click();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
});
test('empty form and validation boundaries', async ({ page }) => {
  const submit = page.getByRole('button', { name: 'Показать подтверждение' });
  await submit.click();
  await expect(page.locator('#form-name')).toBeFocused();
  await expect(page.locator('[id^=error-]')).toHaveCount(5);
  for (const name of ['А', 'А'.repeat(61), '123', '@Имя']) {
    await page.locator('#form-name').fill(name);
    await submit.click();
    await expect(page.locator('#error-name')).toBeVisible();
  }
  for (const phone of ['123', '1'.repeat(16), 'abcdefghij']) {
    await page.locator('#form-phone').fill(phone);
    await submit.click();
    await expect(page.locator('#error-phone')).toBeVisible();
  }
  await page.locator('#form-comment').fill('я'.repeat(501));
  await submit.click();
  await expect(page.locator('#error-comment')).toBeVisible();
  await expect(page.locator('#form-comment')).toHaveValue('я'.repeat(501));
});
test('valid boundaries, duplicate protection, success, reset and privacy', async ({ page }) => {
  let network = 0;
  page.on('request', (r) => {
    if (['POST', 'PUT', 'PATCH'].includes(r.method())) network++;
  });
  await page.locator('#form-name').fill('Анна-Мария');
  await page.locator('#form-phone').fill('+7 (999) 123-45-67');
  await page.locator('#form-direction').selectOption('aesthetics');
  await page.locator('#form-preferredTime').selectOption('Вечер, 17:00–21:00');
  await page.locator('#form-comment').fill('я'.repeat(500));
  await page.locator('#form-consent').check();
  await page.getByRole('button', { name: 'Показать подтверждение' }).click();
  await expect(page.getByRole('button', { name: 'Проверяем данные…' })).toBeDisabled();
  await expect(page.getByRole('heading', { name: 'Демонстрационная запись готова' })).toBeFocused();
  await expect(
    page.getByText('Данные не были отправлены или сохранены.', { exact: true }),
  ).toBeVisible();
  expect(network).toBe(0);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookie: document.cookie,
    })),
  ).toEqual({ local: 0, session: 0, cookie: '' });
  await page.getByRole('button', { name: 'Заполнить ещё раз' }).click();
  await expect(page.locator('#form-name')).toHaveValue('');
  await expect(page.locator('#form-phone')).toHaveValue('');
  await expect(page.locator('#form-direction')).toHaveValue('');
  await expect(page.locator('#form-preferredTime')).toHaveValue('');
  await expect(page.locator('#form-comment')).toHaveValue('');
  await expect(page.locator('#form-consent')).not.toBeChecked();
  await expect(page.locator('[id^=error-]')).toHaveCount(0);
});
test('min and max valid name and phone lengths', async ({ page }) => {
  for (const [name, phone] of [
    ['Ан', '1234567890'],
    ['А'.repeat(60), '1'.repeat(15)],
  ]) {
    await page.locator('#form-name').fill(name);
    await page.locator('#form-phone').fill(phone);
    await page.locator('#form-direction').selectOption('pain');
    await page.locator('#form-preferredTime').selectOption('Утро, 8:00–12:00');
    await page.locator('#form-consent').check();
    await page.getByRole('button', { name: 'Показать подтверждение' }).click();
    await expect(
      page.getByRole('heading', { name: 'Демонстрационная запись готова' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Заполнить ещё раз' }).click();
  }
});
test('mobile menu trap, Escape, return focus and sticky CTA', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const open = page.getByRole('button', { name: 'Открыть меню' });
  await open.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await open.click();
  await page
    .getByRole('navigation', { name: 'Мобильная навигация' })
    .getByRole('link', { name: 'Цены', exact: true })
    .click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('complementary', { name: 'Быстрая демонстрационная запись' }),
  ).toBeVisible();
  await page.locator('#appointment').scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('complementary', { name: 'Быстрая демонстрационная запись' }),
  ).toHaveCount(0);
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('complementary', { name: 'Быстрая демонстрационная запись' }),
  ).toHaveCount(0);
});
for (const width of [390, 768, 1440])
  test(`layout and accessibility ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    for (const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).not.toHaveJSProperty('naturalWidth', 0);
    }
    const comparisonLabelsFit = await page.locator('#results figcaption').evaluateAll((labels) =>
      labels.every((label) => {
        const bounds = label.getBoundingClientRect();
        const pair = label.parentElement!.parentElement!.getBoundingClientRect();
        return bounds.left >= pair.left && bounds.right <= pair.right;
      }),
    );
    expect(comparisonLabelsFit).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
  });
test('visible keyboard focus after choosing a service', async ({ page }) => {
  const choose = page
    .locator('#services')
    .getByRole('button', { name: 'Выбрать: Лечение кариеса', exact: true });
  await choose.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#appointment')).toBeFocused();
  await expect(page.locator('#appointment')).toHaveCSS('outline-width', '3px');
});
test('200 percent equivalent reflow and map placeholder', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 500 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Построить маршрут' }).click();
  await expect(page.locator('#route-unavailable')).toContainText(
    'Недоступно в концептуальном проекте',
  );
});
