import type { ReactNode } from 'react';
import s from './UI.module.css';
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}
export function Logo() {
  return (
    <a href="#top" className={s.logo}>
      <svg aria-hidden="true" width="38" height="38" viewBox="0 0 44 44" fill="none">
        <path
          d="M5 33V15a7 7 0 0 1 14 0v15a7 7 0 0 0 14 0V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>
        Белая линия<span className={s.logoSub}>семейная стоматология</span>
      </span>
    </a>
  );
}
export function Heading({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div className={s.heading}>
      <h2 id={id}>{title}</h2>
      <div>
        {description && <p>{description}</p>}
        {children}
      </div>
    </div>
  );
}
export function BookingLink({
  children = 'Записаться',
  className = '',
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a className={`${s.button} ${className}`} href="#appointment">
      {children}
      <Arrow />
    </a>
  );
}
export function Filters<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div className={s.filters} role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
        >
          {value === item.id && <span aria-hidden="true" className={s.dot} />} {item.label}
          <span className={s.sr}>{value === item.id ? ' — выбран' : ''}</span>
        </button>
      ))}
    </div>
  );
}
export function Photo({
  name,
  alt,
  width = 800,
  height = 600,
  eager = false,
  className = '',
}: {
  name: string;
  alt: string;
  width?: number;
  height?: number;
  eager?: boolean;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={`${import.meta.env.BASE_URL}images/${name}.webp`}
      srcSet={`${import.meta.env.BASE_URL}images/${name}-small.webp 480w, ${import.meta.env.BASE_URL}images/${name}.webp 960w`}
      sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 50vw, 40vw"
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
