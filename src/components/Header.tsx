import { useEffect, useRef, useState } from 'react';
import { navigation } from '../data/site';
import { BookingLink, Logo } from './UI';
import s from './Header.module.css';
export function Header() {
  const [open, setOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;
    const o = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting), { threshold: 0 });
    o.observe(hero);
    return () => o.disconnect();
  }, []);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.current?.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };
  return (
    <>
      <div className={s.notice}>
        Концептуальный проект для портфолио. Клиника, специалисты и цены вымышлены.
      </div>
      <div className={s.headerSpace}>
        <header className={`${s.header} ${sticky ? s.sticky : ''}`}>
          <div className={s.inner}>
            <Logo />
            <nav className={s.desktop} aria-label="Основная навигация">
              {navigation.map((n) => (
                <a key={n.id} href={`#${n.id}`}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className={s.hours}>
              Ежедневно
              <br />
              <span>8:00–21:00</span>
            </div>
            <div className={s.desktopCta}>
              <BookingLink />
            </div>
            <button
              ref={toggle}
              className={s.menuButton}
              aria-label="Открыть меню"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M3 7h18M3 15h18" />
              </svg>
            </button>
          </div>
        </header>
      </div>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className={s.dialog}
        aria-label="Навигация по сайту"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className={s.menuPanel}>
          <div className={s.menuTop}>
            <Logo />
            <button autoFocus className={s.menuButton} onClick={close} aria-label="Закрыть меню">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="m5 5 14 14M5 19 19 5" />
              </svg>
            </button>
          </div>
          <nav aria-label="Мобильная навигация">
            {navigation.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => {
                  close();
                  requestAnimationFrame(() =>
                    document.getElementById(n.id)?.focus({ preventScroll: true }),
                  );
                }}
              >
                {n.label}
              </a>
            ))}
            <a href="#appointment" onClick={close}>
              Демонстрационная запись
            </a>
          </nav>
          <p>
            Ежедневно, 8:00–21:00
            <br />
            Учебный проект. Реальной записи нет.
          </p>
        </div>
      </dialog>
    </>
  );
}
