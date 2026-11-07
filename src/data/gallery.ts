import type { GalleryItem } from '../types/content';
export const gallery: GalleryItem[] = [
  {
    id: 'hygiene',
    title: 'Профессиональная гигиена',
    category: 'Уход',
    beforeImage: 'hygiene-before',
    afterImage: 'hygiene-after',
    description: 'Иллюстрация изменения видимого налёта.',
    disclaimer: 'Учебная визуализация, не результат реального пациента',
  },
  {
    id: 'shape',
    title: 'Реставрация формы',
    category: 'Форма',
    beforeImage: 'shape-before',
    afterImage: 'shape-after',
    description: 'Иллюстрация восстановления края зуба.',
    disclaimer: 'Учебная визуализация, не результат реального пациента',
  },
  {
    id: 'aesthetic',
    title: 'Эстетическое восстановление',
    category: 'Оттенок',
    beforeImage: 'aesthetic-before',
    afterImage: 'aesthetic-after',
    description: 'Иллюстрация согласования формы и оттенка.',
    disclaimer: 'Учебная визуализация, не результат реального пациента',
  },
];
