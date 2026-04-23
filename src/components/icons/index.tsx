import Image from 'next/image';
import styles from './icons.module.scss';

export const FolderIcon = () => (
  <Image src="/images/icons/sf-symbols/folder.svg" alt="folder" width={16} height={14} className={styles.sfIcon} unoptimized />
);

export const OpenFolderIcon = () => (
  <Image src="/images/icons/sf-symbols/folder.svg" alt="open folder" width={16} height={14} className={styles.sfIcon} unoptimized />
);

export const FileIcon = () => (
  <Image src="/images/icons/sf-symbols/text.document.svg" alt="file" width={13} height={16} className={styles.sfIcon} unoptimized />
);

export const PersonIcon = () => (
  <Image src="/images/icons/sf-symbols/person.crop.circle.svg" alt="person" width={16} height={16} className={styles.sfIcon} unoptimized />
);

export const PaperplaneIcon = () => (
  <Image src="/images/icons/sf-symbols/paperplane.svg" alt="paperplane" width={16} height={16} className={styles.sfIcon} unoptimized />
);

export const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <span className={`${styles.chevron} ${isExpanded ? styles.chevronDown : ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </span>
);