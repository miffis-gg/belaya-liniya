import { useState } from 'react';
import type { AppSelectionState, ProblemId } from '../types/content';
import { problems } from '../data/problems';
import { Header } from '../components/Header';
import { Hero, Recommendations } from '../components/Hero';
import { Services, Prices } from '../components/Services';
import { Doctors, Journey, Gallery, Safety } from '../components/Story';
import { FAQ } from '../components/FAQ';
import { AppointmentForm } from '../components/AppointmentForm';
import { Contacts, Footer, MobileBookingBar } from '../components/Closing';
import u from '../components/UI.module.css';
import s from './App.module.css';
const initial: AppSelectionState = {
  selectedProblem: null,
  selectedServiceId: null,
  selectedSpecialistId: null,
};
export function App() {
  const [selection, setSelection] = useState(initial);
  const [message, setMessage] = useState('');
  const select = (id: ProblemId | null) => {
    setSelection({ selectedProblem: id, selectedServiceId: null, selectedSpecialistId: null });
    setMessage(
      id
        ? `Выбрано направление ${problems.find((p) => p.id === id)?.title}. Показано 3 рекомендации.`
        : 'Выбор направления сброшен.',
    );
  };
  const choose = (id: ProblemId, detail: string, type: 'service' | 'specialist') => {
    setSelection({
      selectedProblem: id,
      selectedServiceId: type === 'service' ? detail : null,
      selectedSpecialistId: type === 'specialist' ? detail : null,
    });
    setMessage(
      `Выбрано направление ${problems.find((p) => p.id === id)?.title}. Поле формы заполнено.`,
    );
    requestAnimationFrame(() => {
      const element = document.getElementById('appointment');
      element?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
      element?.focus({ preventScroll: true });
    });
  };
  return (
    <>
      <a className={s.skip} href="#main">
        Перейти к содержимому
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero selected={selection.selectedProblem} onSelect={select} />
        <p className={u.sr} role="status" aria-live="polite" aria-atomic="true">
          {message}
        </p>
        <Recommendations selected={selection.selectedProblem} />
        <Services onChoose={(id, detail) => choose(id, detail, 'service')} />
        <Doctors onChoose={(id, detail) => choose(id, detail, 'specialist')} />
        <Journey />
        <Gallery />
        <Safety />
        <Prices />
        <FAQ />
        <AppointmentForm
          direction={selection.selectedProblem}
          serviceId={selection.selectedServiceId}
          specialistId={selection.selectedSpecialistId}
          onDirection={select}
          onReset={() => {
            setSelection(initial);
            setMessage('Форма и выбор направления сброшены.');
          }}
        />
        <Contacts />
      </main>
      <Footer />
      <MobileBookingBar selected={selection.selectedProblem} />
    </>
  );
}
