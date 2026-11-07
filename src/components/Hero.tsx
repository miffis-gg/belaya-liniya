import type { ProblemId } from '../types/content';
import { problems } from '../data/problems';
import { services, price } from '../data/services';
import { Arrow, BookingLink, Photo } from './UI';
import u from './UI.module.css';
import s from './Hero.module.css';
export function Hero({
  selected,
  onSelect,
}: {
  selected: ProblemId | null;
  onSelect: (id: ProblemId) => void;
}) {
  return (
    <section id="top" className={s.hero} aria-labelledby="hero-title">
      <div className={s.intro}>
        <p className={s.context}>Семейная стоматология · концептуальный проект</p>
        <h1 id="hero-title">
          Понятный путь
          <br />к здоровой
          <br /> <span>улыбке</span>
        </h1>
        <p className={s.lead}>
          Выберите, что вас беспокоит, — покажем подходящее направление, ориентировочную стоимость и
          следующий шаг.
        </p>
        <div className={s.actions}>
          <button
            className={u.button}
            onClick={() => document.getElementById('problem-pain')?.focus()}
          >
            Выбрать направление
            <Arrow />
          </button>
          <a className={s.priceLink} href="#prices">
            Посмотреть цены
            <Arrow diagonal />
          </a>
        </div>
        <div className={s.facts}>
          <span>Ежедневно, 8:00–21:00</span>
          <span>
            Точная стоимость
            <br />
            после диагностики
          </span>
        </div>
        <p className={s.consult}>Первичная консультация — демонстрационная услуга</p>
      </div>
      <div className={s.workspace}>
        <div className={s.selector} role="group" aria-labelledby="selector-title">
          <div className={s.selectorHead}>
            <h2 id="selector-title">С чего начнём?</h2>
            <span>Ваш первый шаг</span>
          </div>
          {problems.map((p, i) => (
            <div key={p.id} className={`${s.problemWrap} ${selected === p.id ? s.active : ''}`}>
              <button
                id={`problem-${p.id}`}
                className={s.problem}
                aria-pressed={selected === p.id}
                onClick={() => onSelect(p.id)}
              >
                <span className={s.number}>0{i + 1}</span>
                <span className={s.problemText}>
                  <strong>{p.title}</strong>
                  <small>
                    {selected === p.id ? 'Выбрано · ' : ''}
                    {p.description}
                  </small>
                </span>
                <span className={s.marker}>
                  {selected === p.id ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path d="m4 10 4 4 8-8" />
                    </svg>
                  ) : (
                    <Arrow diagonal />
                  )}
                </span>
              </button>
              {selected === p.id && (
                <div className={s.expanded}>
                  <p>{p.next}</p>
                  <a href="#recommendations">
                    Смотреть рекомендации
                    <Arrow />
                  </a>
                </div>
              )}
            </div>
          ))}
          <div className={s.routeNote}>
            <span className={s.routeLine} aria-hidden="true" />
            <span>
              {selected
                ? 'Покажем подходящие услуги'
                : 'Выберите ситуацию — рекомендации появятся ниже'}
            </span>
            <Arrow />
          </div>
        </div>
        <figure className={s.heroPhoto}>
          <Photo
            name="consultation"
            alt="Врач на одном уровне с пациенткой спокойно объясняет диагностический снимок"
            eager
            width={960}
            height={640}
          />
          <figcaption>
            Сначала — разговор. Потом — понятный план.<span>AI-изображение · учебный проект</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
export function Recommendations({ selected }: { selected: ProblemId | null }) {
  const problem = problems.find((p) => p.id === selected);
  const recommended =
    problem?.recommendationIds.map((id) => services.find((s) => s.id === id)!).filter(Boolean) ??
    [];
  return (
    <section
      id="recommendations"
      tabIndex={-1}
      className={s.recommendations}
      aria-labelledby="recommendation-title"
    >
      <div className={s.recIntro}>
        <div className={s.routeSymbol} aria-hidden="true">
          <span /> <Arrow />
        </div>
        <h2 id="recommendation-title">
          {problem
            ? `Ваш маршрут: ${problem.title.toLocaleLowerCase('ru')}`
            : 'У каждого — своя отправная точка'}
        </h2>
        <p>
          {problem
            ? problem.next
            : 'Начните с того, что важно вам сейчас. Мы переведём вашу ситуацию в понятные услуги и следующие шаги.'}
        </p>
      </div>
      {problem ? (
        <>
          <div className={s.recList} key={selected}>
            {recommended.map((service, i) => (
              <article key={service.id}>
                <span>0{i + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div>
                  <span>{service.duration}</span>
                  <strong>{price(service.priceFrom)}</strong>
                </div>
              </article>
            ))}
          </div>
          <div className={s.recFooter}>
            <p>
              Это не диагноз. Точный план определяет врач после осмотра и диагностики. Цены
              демонстрационные.
            </p>
            <BookingLink>Записаться по этому направлению</BookingLink>
            <a href="#services">Посмотреть все услуги</a>
          </div>
        </>
      ) : (
        <a className={s.start} href="#problem-pain">
          Выбрать свою ситуацию
          <Arrow />
        </a>
      )}
    </section>
  );
}
