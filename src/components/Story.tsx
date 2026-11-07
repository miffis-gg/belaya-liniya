import type { ProblemId } from '../types/content';
import { specialists } from '../data/specialists';
import { problems } from '../data/problems';
import { gallery } from '../data/gallery';
import { steps, safety } from '../data/site';
import { Arrow, Heading, Photo } from './UI';
import s from './Story.module.css';
export function Doctors({ onChoose }: { onChoose: (id: ProblemId, specialistId: string) => void }) {
  return (
    <section id="doctors" tabIndex={-1} className={s.doctors} aria-label="Специалисты">
      <div className={s.container}>
        <Heading
          title="Специалисты для каждого этапа"
          description="У каждого направления есть свой специалист. В концепте показываем, как может выглядеть знакомство с командой."
        />
        <div className={s.doctorGrid}>
          {specialists.map((d, i) => (
            <article className={s.doctor} key={d.id}>
              <div className={s.portrait}>
                <Photo name={d.image} alt={d.alt} width={768} height={960} />
                <span>Демонстрационный профиль</span>
              </div>
              <div className={s.doctorBody}>
                <span className={s.role}>{d.role}</span>
                <h3>{d.name}</h3>
                <p className={s.experience}>{d.experience}</p>
                <p>{d.phrase}</p>
                <p className={s.directions}>
                  {d.problemIds.map((id) => problems.find((p) => p.id === id)?.title).join(' · ')}
                </p>
                <button
                  onClick={() => onChoose(d.problemIds[0], d.id)}
                  aria-label={`Выбрать специалиста: ${d.name}`}
                >
                  Выбрать специалиста
                  <Arrow diagonal />
                </button>
                <span className={s.doctorIndex} aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Journey() {
  return (
    <section id="first-visit" tabIndex={-1} className={s.journey} aria-label="Первый визит">
      <div className={s.container}>
        <div className={s.journeyTitle}>
          <h2>
            Первый визит —<br />
            без неожиданностей
          </h2>
          <p>
            Можно не знать названия процедур.
            <br />
            Можно волноваться и задавать вопросы.
            <br />
            Начнём с разговора.
          </p>
        </div>
        <ol className={s.steps}>
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className={s.stepNumber}>0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className={s.bring}>
          <span>Что взять с собой</span>
          <p>
            Документы, предыдущие снимки при наличии
            <br />и список важных для вас вопросов.
          </p>
          <span className={s.bringNote}>
            Рекомендация для сценария знакомства,
            <br />
            не обязательный перечень документов.
          </span>
        </div>
      </div>
    </section>
  );
}
export function Gallery() {
  return (
    <section
      id="results"
      tabIndex={-1}
      className={`${s.container} ${s.gallery}`}
      aria-label="Учебные результаты"
    >
      <Heading
        title="Как может меняться улыбка"
        description="Все изображения в этом разделе — учебные визуализации и не являются результатами лечения реальных пациентов."
      />
      <div className={s.galleryGrid}>
        {gallery.map((item) => (
          <article className={s.galleryItem} key={item.id}>
            <div className={s.pair}>
              {[
                { name: item.beforeImage, label: 'До' },
                { name: item.afterImage, label: 'После' },
              ].map((img) => (
                <figure key={img.name}>
                  <Photo
                    name={img.name}
                    alt={`${item.title}: ${img.label.toLowerCase()}, учебная 3D-модель зубов`}
                    width={480}
                    height={320}
                  />
                  <figcaption>{img.label}</figcaption>
                </figure>
              ))}
            </div>
            <span className={s.educational}>Учебный материал</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <small>{item.disclaimer}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
export function Safety() {
  return (
    <section
      id="safety"
      tabIndex={-1}
      className={s.safety}
      aria-label="Оборудование и безопасность"
    >
      <div className={`${s.container} ${s.safetyGrid}`}>
        <figure className={s.room}>
          <Photo
            name="clinic"
            alt="Светлый концептуальный кабинет с мятным креслом, диагностическим экраном и дубовой мебелью"
            width={960}
            height={640}
          />
          <figcaption>
            Пространство, в котором есть место спокойствию.
            <span>AI-изображение · концепт кабинета</span>
          </figcaption>
        </figure>
        <div className={s.safetyText}>
          <h2>Технологии помогают видеть больше, решения принимает врач</h2>
          {safety.map((item) => (
            <div className={s.safetyItem} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
          <p className={s.safetyNote}>
            Описание оборудования и процессов приведено для демонстрации структуры сайта и не
            подтверждает оснащение реальной клиники.
          </p>
        </div>
      </div>
    </section>
  );
}
