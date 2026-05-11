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
        <a href="https://github.com/ModernAmusements" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.reddit.com/user/princessinsomnia/" target="_blank" rel="noopener noreferrer">Reddit</a>
        <a href="https://www.instagram.com/modernamusements" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.behance.net/stawfik" target="_blank" rel="noopener noreferrer">Behance</a>
      </div>
    </footer>
  );
}