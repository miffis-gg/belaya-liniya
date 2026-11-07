import { useEffect, useState } from 'react';
import { navigation } from '../data/site';
import { problems } from '../data/problems';
import type { ProblemId } from '../types/content';
import { Arrow, BookingLink, Logo } from './UI';
import s from './Closing.module.css';
export function Contacts() {
  const [route, setRoute] = useState(false);
  return (
    <section id="contacts" tabIndex={-1} className={s.contacts} aria-label="Контакты">
      <div className={s.contactText}>
        <h2>
          Будем рядом.
          <br />В этом концепте.
        </h2>
        <p className={s.address}>
          Демонстрационный адрес:
          <br />
          Центральный район,
          <br />
          улица Примерная, 12
        </p>
        <dl>
          <div>
            <dt>Часы работы</dt>
            <dd>Ежедневно, 8:00–21:00</dd>
          </div>
          <div>
            <dt>Демонстрационные контакты</dt>
            <dd>
              +7 (000) 000-00-00
              <br />
              hello@example.invalid
            </dd>
          </div>
        </dl>
        <button
          className={s.routeButton}
          onClick={() => setRoute(true)}
          aria-describedby={route ? 'route-unavailable' : undefined}
        >
          Построить маршрут
          <Arrow diagonal />
        </button>
        <p id="route-unavailable" role="status" className={s.routeStatus}>
          {route
            ? 'Недоступно в концептуальном проекте. Адрес вымышленный.'
            : 'Адрес и контакты вымышлены.'}
        </p>
      </div>
      <div
        className={s.map}
        role="img"
        aria-label="Карта-заглушка без реального географического положения. Демонстрационный адрес: Центральный район, улица Примерная, 12"
      >
        <svg
          aria-hidden="true"
          className={s.mapLines}
          viewBox="0 0 600 500"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="600" height="500" fill="#DDE7DC" />
          <g fill="#C8D9C9">
            <rect x="40" y="30" width="120" height="110" rx="12" />
            <rect x="210" y="30" width="140" height="110" rx="12" />
            <rect x="40" y="200" width="120" height="130" rx="12" />
            <rect x="210" y="200" width="130" height="130" rx="12" />
            <rect x="390" y="200" width="170" height="130" rx="12" />
            <rect x="50" y="390" width="220" height="90" rx="12" />
            <rect x="330" y="390" width="180" height="90" rx="12" />
          </g>
          <g stroke="#F5F3ED" strokeWidth="17" fill="none">
            <path d="M-20 170h650M185-20v600M365-20v600M-20 360h650M-20 60l660 430" />
          </g>
          <path
            d="M470-20c-80 100 100 170 20 290s30 140 40 260"
            stroke="#A8D8C8"
            strokeWidth="44"
            fill="none"
          />
        </svg>
        <span className={s.mapLabel}>Схематичная карта · не реальная география</span>
        <div className={s.mapPin}>
          <span className={s.pinDot} />
          <strong>Белая линия</strong>
          <span>Демонстрационный адрес</span>
        </div>
        <span className={s.mapBottom}>Центральный район · улица Примерная, 12</span>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerTop}>
        <Logo />
        <nav aria-label="Навигация в подвале">
          {navigation.map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#top" className={s.backTop}>
          Наверх
          <Arrow diagonal />
        </a>
      </div>
      <div className={s.footerBottom}>
        <div>
          <p>Учебный проект для портфолио frontend-разработчика</p>
          <p>© {new Date().getFullYear()} Белая линия · концепт</p>
        </div>
        <div>
          <p>
            Все бренды, специалисты, услуги, цены и изображения результатов являются
            демонстрационными. Форма не отправляет и не сохраняет персональные данные.
          </p>
          <p>Концептуальный проект. Форма не отправляет и не сохраняет персональные данные.</p>
        </div>
      </div>
    </footer>
  );
}
export function MobileBookingBar({ selected }: { selected: ProblemId | null }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let afterHero = false;
    let closingVisible = false;
    let keyboard = false;
    const update = () => setVisible(afterHero && !closingVisible && !keyboard);
    const hero = document.getElementById('top');
    const appointment = document.getElementById('appointment');
    const contacts = document.getElementById('contacts');
    const footer = document.querySelector('footer');
    const heroObserver = new IntersectionObserver(([e]) => {
      afterHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    });
    const closingSet = new Set<Element>();
    const closingObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) closingSet.add(e.target);
        else closingSet.delete(e.target);
      });
      closingVisible = closingSet.size > 0;
      update();
    });
    if (hero) heroObserver.observe(hero);
    [appointment, contacts, footer].forEach((e) => {
      if (e) closingObserver.observe(e);
    });
    const onFocus = () => {
      keyboard = document.activeElement?.matches('input,select,textarea') ?? false;
      update();
    };
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onFocus);
    return () => {
      heroObserver.disconnect();
      closingObserver.disconnect();
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onFocus);
    };
  }, []);
  return visible ? (
    <aside className={s.bookingBar} aria-label="Быстрая демонстрационная запись">
      <div>
        <span>Ваш следующий шаг</span>
        <strong>{problems.find((p) => p.id === selected)?.title ?? 'Первое знакомство'}</strong>
      </div>
      <BookingLink />
    </aside>
  ) : null;
}
