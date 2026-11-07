import { useState } from 'react';
import { faq } from '../data/faq';
import s from './FAQ.module.css';
export function FAQ() {
  const [opened, setOpened] = useState<Set<string>>(new Set());
  return (
    <section id="faq" tabIndex={-1} className={s.faq} aria-label="Частые вопросы">
      <div className={s.intro}>
        <h2>
          Можно
          <br /> спросить обо всём
        </h2>
        <p>Собрали вопросы, с которыми часто начинается знакомство со стоматологией.</p>
        <a href="#appointment">Остался свой вопрос? Добавьте его в комментарий к демозаписи.</a>
      </div>
      <div className={s.list}>
        {faq.map((item) => (
          <div className={s.item} key={item.id}>
            <h3>
              <button
                id={`faq-button-${item.id}`}
                type="button"
                aria-expanded={opened.has(item.id)}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() =>
                  setOpened((previous) => {
                    const next = new Set(previous);
                    if (next.has(item.id)) next.delete(item.id);
                    else next.add(item.id);
                    return next;
                  })
                }
              >
                {item.question}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  {!opened.has(item.id) && <path d="M12 5v14" />}
                </svg>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              aria-labelledby={`faq-button-${item.id}`}
              hidden={!opened.has(item.id)}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
