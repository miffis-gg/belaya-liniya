import type { Problem } from '../types/content';
export const problems: Problem[] = [
  {
    id: 'pain',
    title: 'Острая боль',
    description: 'Нужна быстрая оценка состояния',
    next: 'Начнём с осмотра: врач оценит состояние и обсудит подходящий объём помощи.',
    recommendationIds: ['exam', 'caries', 'urgent'],
  },
  {
    id: 'treatment',
    title: 'Лечение зубов',
    description: 'Кариес, чувствительность, восстановление',
    next: 'Сначала диагностика. Затем — варианты восстановления, сроки и понятный план.',
    recommendationIds: ['diagnosis', 'caries', 'restore'],
  },
  {
    id: 'implantation',
    title: 'Имплантация',
    description: 'План восстановления отсутствующего зуба',
    next: 'На консультации обсудим варианты восстановления и необходимые исследования.',
    recommendationIds: ['surgeon', 'scan', 'implant'],
  },
  {
    id: 'aesthetics',
    title: 'Эстетика улыбки',
    description: 'Цвет, форма и аккуратная реставрация',
    next: 'Обсудим ваши пожелания и состояние зубов. Подберём последовательность ухода и восстановления.',
    recommendationIds: ['photo', 'hygiene', 'art'],
  },
  {
    id: 'children',
    title: 'Детский приём',
    description: 'Знакомство, профилактика и лечение ребёнка',
    next: 'Начнём со знакомства. Покажем кабинет и дадим ребёнку время освоиться.',
    recommendationIds: ['child-meeting', 'child-hygiene', 'child-treatment'],
  },
];
