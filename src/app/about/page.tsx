import styles from './page.module.scss';

export const metadata = {
  title: 'About',
  description: 'Learn more about me.',
};

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <h1>About Me</h1>
      <div className={styles.content}>
        <p>
          Hi, I'm a developer based in [Your Location]. I specialize in building
          web applications with a focus on performance, accessibility, and clean code.
        </p>
        <p>
          My journey in development started when I built my first website in college.
          Since then, I've worked on a variety of projects ranging from small business
          websites to enterprise applications.
        </p>
        <h2>Skills</h2>
        <ul className={styles.skills}>
          <li>JavaScript / TypeScript</li>
          <li>React / Next.js</li>
          <li>Node.js</li>
          <li>Python</li>
          <li>CSS / SCSS</li>
          <li>PostgreSQL</li>
          <li>Docker</li>
          <li>AWS</li>
        </ul>
        <h2>When I'm Not Coding</h2>
        <p>
          You can find me exploring new technologies, contributing to open source,
          or enjoying outdoor activities. I'm always open to connecting with other
          developers and learning new things.
        </p>
      </div>
    </div>
  );
}