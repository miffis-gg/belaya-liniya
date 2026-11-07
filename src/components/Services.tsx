import { useState } from 'react';
import type { Category, ProblemId } from '../types/content';
import { services, categories, categoryLabel, price } from '../data/services';
import { prices } from '../data/prices';
import { Arrow, BookingLink, Filters, Heading } from './UI';
import s from './Services.module.css';
export function Services({
  onChoose,
}: {
  onChoose: (direction: ProblemId, serviceId: string) => void;
}) {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const filtered = services.filter((item) => filter === 'all' || item.category === filter);
  return (
    <section id="services" tabIndex={-1} className={s.section} aria-labelledby="services-title">
      <Heading
        id="services-title"
        title="Услуги без сложных формулировок"
        description="Стоимость указана для учебного проекта и помогает сравнить направления. Итоговый план всегда зависит от диагностики."
      />
      <Filters items={categories} value={filter} onChange={setFilter} label="Категории услуг" />
      <p className={s.count} role="status">
        Показано услуг: {filtered.length}
      </p>
      <div className={s.services}>
        {filtered.length ? (
          filtered.map((item, i) => (
            <article className={s.service} key={item.id}>
              <div className={s.category}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {categoryLabel(item.category)}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className={s.duration}>{item.duration}</span>
              <strong className={s.price}>{price(item.priceFrom)}</strong>
              <button
                type="button"
                className={s.choose}
                onClick={() => onChoose(item.problemIds[0], item.id)}
                aria-label={`Выбрать: ${item.title}`}
              >
                Выбрать
                <Arrow diagonal />
              </button>
            </article>
          ))
        ) : (
          <p>В этой категории пока нет услуг. Выберите другую.</p>
        )}
      </div>
      <p className={s.note}>
        Все услуги и цены демонстрационные. Точная стоимость определяется после диагностики.
      </p>
    </section>
  );
}
export function Prices() {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const filtered = prices.filter((p) => filter === 'all' || p.category === filter);
  return (
    <section id="prices" tabIndex={-1} className={s.section} aria-labelledby="prices-title">
      <Heading
        id="prices-title"
        title="Ориентиры до консультации"
        description="Узнать порядок стоимости — хороший первый шаг. У каждой ситуации будет свой план."
      />
      <Filters
        items={categories.map((c) => ({ id: c.id, label: c.priceLabel }))}
        value={filter}
        onChange={setFilter}
        label="Группы цен"
      />
      <p className={s.count} role="status">
        Показано позиций: {filtered.length}
      </p>
      <table className={s.table}>
        <caption>Демонстрационные ориентировочные цены</caption>
        <thead>
          <tr>
            <th scope="col">Услуга</th>
            <th scope="col">Что входит</th>
            <th scope="col">Длительность</th>
            <th scope="col">Цена от</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <th scope="row">{p.title}</th>
              <td data-label="Что входит">{p.description}</td>
              <td data-label="Длительность">{p.duration}</td>
              <td data-label="Цена от">{price(p.priceFrom)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filtered.length && <p>В этой группе пока нет цен.</p>}
      <div className={s.priceFooter}>
        <p>
          Все цены демонстрационные. Точная стоимость зависит от клинической ситуации и определяется
          после диагностики.
        </p>
        <BookingLink>Выбрать направление и записаться</BookingLink>
      </div>
    </section>
  );
}
