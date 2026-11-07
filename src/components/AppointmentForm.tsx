import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { LeadFormData, ProblemId } from '../types/content';
import { problems } from '../data/problems';
import { services } from '../data/services';
import { specialists } from '../data/specialists';
import { times } from '../data/site';
import { Arrow } from './UI';
import u from './UI.module.css';
import s from './AppointmentForm.module.css';
type Errors = Partial<Record<keyof LeadFormData, string>>;
const empty: LeadFormData = {
  name: '',
  phone: '',
  direction: '',
  preferredTime: '',
  comment: '',
  consent: false,
};
export function validate(data: LeadFormData): Errors {
  const errors: Errors = {};
  const name = data.name.trim();
  if (name.length < 2 || name.length > 60 || !/^\p{L}[\p{L}\s'’\-]*$/u.test(name))
    errors.name = 'Введите имя: 2–60 символов, буквы, пробел, дефис или апостроф.';
  const phone = data.phone.replace(/\D/g, '');
  if (phone.length < 10 || phone.length > 15 || !/^[+\d\s().\-]+$/.test(data.phone))
    errors.phone = 'Введите телефон, содержащий от 10 до 15 цифр.';
  if (!problems.some((p) => p.id === data.direction))
    errors.direction = 'Выберите направление приёма.';
  if (!times.includes(data.preferredTime))
    errors.preferredTime = 'Выберите удобное время из списка.';
  if (data.comment.length > 500) errors.comment = 'Сократите комментарий до 500 символов.';
  if (!data.consent) errors.consent = 'Подтвердите, что понимаете демонстрационный характер формы.';
  return errors;
}
export function AppointmentForm({
  direction,
  serviceId,
  specialistId,
  onDirection,
  onReset,
}: {
  direction: ProblemId | null;
  serviceId: string | null;
  specialistId: string | null;
  onDirection: (id: ProblemId | null) => void;
  onReset: () => void;
}) {
  const [data, setData] = useState<LeadFormData>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'initial' | 'submitting' | 'success'>('initial');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processing = useRef(false);
  const success = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    processing.current = false;
    setData((d) => ({ ...d, direction: direction ?? '' }));
    setErrors((e) => ({ ...e, direction: undefined }));
    setStatus('initial');
  }, [direction, serviceId, specialistId]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (status === 'success') success.current?.focus();
  }, [status]);
  const update = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (processing.current) return;
    const next = validate(data);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      requestAnimationFrame(() => document.getElementById(`form-${first}`)?.focus());
      return;
    }
    processing.current = true;
    setStatus('submitting');
    timer.current = setTimeout(() => {
      processing.current = false;
      setStatus('success');
      setData((d) => ({ ...empty, direction: d.direction, preferredTime: d.preferredTime }));
    }, 750);
  };
  const fieldProps = (key: keyof LeadFormData) => ({
    id: `form-${key}`,
    name: key,
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key]
      ? `error-${key}`
      : key === 'comment'
        ? 'comment-count'
        : undefined,
  });
  const error = (key: keyof LeadFormData) =>
    errors[key] ? (
      <p className={s.error} id={`error-${key}`}>
        Ошибка: {errors[key]}
      </p>
    ) : null;
  const chosenService = services.find((item) => item.id === serviceId);
  const chosenSpecialist = specialists.find((item) => item.id === specialistId);
  return (
    <section
      id="appointment"
      tabIndex={-1}
      className={s.appointment}
      aria-label="Демонстрационная запись"
    >
      <div className={s.inner}>
        <div className={s.intro}>
          <span className={s.routeEnd} aria-hidden="true" />
          <h2>Выберите удобное время для первого шага</h2>
          <p>
            Это демонстрационная форма: она показывает сценарий записи, но не отправляет и не
            сохраняет данные.
          </p>
          <div className={s.reassurance}>
            <span>
              Без спешки.
              <br />С понятным следующим шагом.
            </span>
            <Arrow />
          </div>
          <p className={s.disclaimer}>
            Концептуальный проект. Форма не отправляет и не сохраняет персональные данные.
          </p>
        </div>
        <div className={s.formPanel}>
          {status === 'success' ? (
            <div className={s.success}>
              <span className={s.successMark} aria-hidden="true">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="m4 12 5 5L20 6" />
                </svg>
              </span>
              <h3 ref={success} tabIndex={-1}>
                Демонстрационная запись готова
              </h3>
              <p>
                {problems.find((p) => p.id === data.direction)?.title}
                <br />
                {data.preferredTime}
              </p>
              <strong>Данные не были отправлены или сохранены.</strong>
              <p>Реальная запись не создана. Это завершение учебного сценария.</p>
              <button
                className={u.button}
                onClick={() => {
                  setData(empty);
                  setErrors({});
                  setStatus('initial');
                  onReset();
                  requestAnimationFrame(() => document.getElementById('form-name')?.focus());
                }}
              >
                Заполнить ещё раз
                <Arrow />
              </button>
            </div>
          ) : (
            <form ref={form} onSubmit={submit} noValidate aria-busy={status === 'submitting'}>
              <p className={s.formNote}>Все поля, кроме комментария, обязательны</p>
              {(chosenService || chosenSpecialist) && (
                <p className={s.selection}>
                  Вы выбрали: {chosenService?.title ?? chosenSpecialist?.name}
                </p>
              )}
              <fieldset disabled={status === 'submitting'} className={s.fields}>
                <legend className={u.sr}>Данные для демонстрационной записи</legend>
                <div className={s.field}>
                  <label htmlFor="form-name">Ваше имя</label>
                  <input
                    {...fieldProps('name')}
                    autoComplete="off"
                    value={data.name}
                    placeholder="Как к вам обращаться"
                    onChange={(e) => update('name', e.target.value)}
                    required
                  />
                  {error('name')}
                </div>
                <div className={s.field}>
                  <label htmlFor="form-phone">Телефон</label>
                  <input
                    {...fieldProps('phone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="off"
                    value={data.phone}
                    placeholder="+7 (___) ___-__-__"
                    onChange={(e) => update('phone', e.target.value)}
                    required
                  />
                  {error('phone')}
                </div>
                <div className={s.field}>
                  <label htmlFor="form-direction">Направление</label>
                  <select
                    {...fieldProps('direction')}
                    value={data.direction}
                    onChange={(e) => {
                      const id = e.target.value as ProblemId | '';
                      update('direction', id);
                      onDirection(id || null);
                    }}
                    required
                  >
                    <option value="">Выберите направление</option>
                    {problems.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  {error('direction')}
                </div>
                <div className={s.field}>
                  <label htmlFor="form-preferredTime">Предпочтительное время</label>
                  <select
                    {...fieldProps('preferredTime')}
                    value={data.preferredTime}
                    onChange={(e) => update('preferredTime', e.target.value)}
                    required
                  >
                    <option value="">Когда вам удобно</option>
                    {times.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {error('preferredTime')}
                </div>
                <div className={`${s.field} ${s.full}`}>
                  <label htmlFor="form-comment">
                    Комментарий <span>необязательно</span>
                  </label>
                  <textarea
                    {...fieldProps('comment')}
                    rows={3}
                    value={data.comment}
                    placeholder="Что важно знать перед знакомством?"
                    onChange={(e) => update('comment', e.target.value)}
                  />
                  <span id="comment-count" className={s.counter}>
                    {data.comment.length} / 500
                  </span>
                  {error('comment')}
                </div>
                <div className={s.full}>
                  <label className={s.consent} htmlFor="form-consent">
                    <input
                      {...fieldProps('consent')}
                      type="checkbox"
                      checked={data.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                      required
                    />
                    <span>Я понимаю, что это демоформа и данные никуда не отправляются</span>
                  </label>
                  {error('consent')}
                </div>
              </fieldset>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`${u.button} ${s.submit}`}
              >
                {status === 'submitting' ? 'Проверяем данные…' : 'Показать подтверждение'}
                <Arrow />
              </button>
              <p role="status" className={s.localStatus}>
                {status === 'submitting'
                  ? 'Локальная проверка. Данные остаются в браузере.'
                  : 'Никаких звонков и реальной записи — только демонстрация.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
