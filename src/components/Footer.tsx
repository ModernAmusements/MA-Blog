import styles from './Footer.module.scss';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.info}>
        <p>ModernAmusements Development</p>
        <p>Shady Nathan Tawfik</p>
        <p>C++ • Swift • Python • TS</p>
        <p>Algorithms | Performance</p>
        <p>© {currentYear}</p>
      </div>
      <div className={styles.social}>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </footer>
  );
}