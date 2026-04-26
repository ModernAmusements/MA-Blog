import type { Metadata } from 'next';
import styles from './page.module.scss';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { BriefcaseIcon, GraduationIcon, CoffeeIcon } from '@/components/icons';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';
  const t = translations[lang].about;

  return {
    title: t.title,
    description: `${t.aboutMeText} ${t.aboutMeText2}`,
    keywords: ['developer', 'fullstack', 'web development', 'data scientist', 'TypeScript', 'React', 'Next.js', 'Python', 'Bielefeld', 'Germany', 'Shady Nathan Tawfik'],
    authors: [{ name: 'Shady Nathan Tawfik' }],
    openGraph: {
      type: 'profile',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${SITE_URL}/${lang}/about`,
      siteName: SITE_NAME,
      title: `${t.title} | ${SITE_NAME}`,
      description: t.aboutMeText,
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.title} | ${SITE_NAME}`,
      description: t.aboutMeText,
      creator: '@modernamusements',
      images: ['/og-image.svg'],
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}/about`,
      languages: {
        en: `${SITE_URL}/en/about`,
        de: `${SITE_URL}/de/about`,
      },
    },
  };
}

export default async function AboutPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].about;

  const getIcon = (type: string) => {
    if (type === 'education') return GraduationIcon;
    if (type === 'internship') return CoffeeIcon;
    return BriefcaseIcon;
  };

  return (
    <div className={styles.about}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
      </header>

      <div className={styles.twoColumn}>
        <div className={styles.mainColumn}>
          <div className={styles.terminalFrame}>
            <div className={styles.terminalHeader}>
              <span>~/about</span>
              <span className={styles.status}>Me</span>
            </div>
            <div className={styles.terminalContent}>
              <div className={styles.profileSection}>
                <div className={styles.profileInfo}>
                  <h2>{t.aboutMe}</h2>
                  <p>{t.aboutMeText}</p>
                  <p>{t.aboutMeText2}</p>
                  <p className={styles.highlight}>{t.aboutMeText3}</p>
                </div>
                <div className={styles.profileImage}>
                  <img src="/images/about/mA-Avatar.png" alt="Shady Nathan Tawfik" />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.terminalFrame}>
            <div className={styles.terminalHeader}>
              <span>~/experience</span>
              <span className={styles.status}>Timeline</span>
            </div>
            <div className={styles.terminalContent}>
              <h2 className={styles.sectionTitle}>{t.workExperience}</h2>
              <div className={styles.timeline}>
                {t.timeline.map((item, index) => {
                  const Icon = getIcon(item.type);
                  return (
                    <div key={index} className={styles.timelineItem}>
                      <div className={styles.timelineIcon}>
                        <Icon />
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <h3>{item.role}</h3>
                          <span className={styles.timelinePeriod}>{item.period}</span>
                        </div>
                        <p className={styles.timelineCompany}>{item.company} • {item.location}</p>
                        <p className={styles.timelineDesc}>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.terminalFrame}>
            <div className={styles.terminalHeader}>
              <span>~/stats</span>
              <span className={styles.status}>Overview</span>
            </div>
            <div className={styles.terminalContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>9+</span>
                  <span className={styles.statLabel}>{t.experienceYears}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>30+</span>
                  <span className={styles.statLabel}>{t.projects}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.terminalFrame}>
            <div className={styles.terminalHeader}>
              <span>~/skills</span>
              <span className={styles.status}>Tech</span>
            </div>
            <div className={styles.terminalContent}>
              <h2 className={styles.sectionTitle}>{t.techStack}</h2>
              <div className={styles.skillsGrid}>
                {t.skillsList.map((skill, index) => (
                  <span key={index} className={styles.skill}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.terminalFrame}>
            <div className={styles.terminalHeader}>
              <span>~/portfolio</span>
              <span className={styles.status}>Work</span>
            </div>
            <div className={styles.terminalContent}>
              <h2 className={styles.sectionTitle}>{t.bigProjects}</h2>
              <div className={styles.projectsGrid}>
                {t.projectList.map((project, index) => (
                  <span key={index} className={styles.project}>{project}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}