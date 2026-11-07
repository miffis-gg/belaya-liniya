import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
const source = 'C:/Users/miffis/.codex/generated_images/01a1b5db-e3d2-72e0-ac38-7b6e2c2de519';
const images = {
  consultation: 'exec-51658566-b3b5-472b-b598-f4ca2d844455.png',
  anna: 'exec-f3aa0ed1-005c-4407-8fb0-0c54788f5ce7.png',
  mikhail: 'exec-e80c661b-4946-444e-8672-d415bf859925.png',
  elena: 'exec-a7d80e0d-ba8f-4866-8255-364d9d95808d.png',
  darya: 'exec-e55a5204-f8ed-444c-9662-38760ac8435a.png',
  clinic: 'exec-058ea39b-bd0a-4e85-b586-3050a5239d5f.png',
};
await mkdir('public/images', { recursive: true });
await mkdir('public/fonts', { recursive: true });
for (const [name, file] of Object.entries(images)) {
  for (const size of [960, 480]) {
    await sharp(path.join(source, file))
      .resize({ width: size })
      .webp({ quality: 82 })
      .toFile(`public/images/${name}${size === 480 ? '-small' : ''}.webp`);
  }
}
const sheet = path.join(source, 'exec-6b116961-431e-4683-a6dd-fcca09bde66f.png');
const { width, height } = await sharp(sheet).metadata();
for (const [row, name] of ['hygiene', 'shape', 'aesthetic'].entries()) {
  for (const [column, state] of ['before', 'after'].entries()) {
    const buffer = await sharp(sheet)
      .extract({
        left: Math.floor(width / 2) * column + 2,
        top: Math.floor(height / 3) * row + 2,
        width: Math.floor(width / 2) - 4,
        height: Math.floor(height / 3) - 4,
      })
      .toBuffer();
    for (const size of [960, 480])
      await sharp(buffer)
        .resize(size)
        .webp({ quality: 84 })
        .toFile(`public/images/${name}-${state}${size === 480 ? '-small' : ''}.webp`);
  }
}
for (const subset of ['cyrillic', 'latin'])
  await copyFile(
    `node_modules/@fontsource-variable/onest/files/onest-${subset}-wght-normal.woff2`,
    `public/fonts/onest-${subset}.woff2`,
  );
await copyFile('node_modules/@fontsource-variable/onest/LICENSE', 'public/fonts/OFL.txt');
console.log('Prepared 24 WebP files, 2 WOFF2 subsets and font license.');
