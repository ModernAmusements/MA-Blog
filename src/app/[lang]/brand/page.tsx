import type { Metadata } from 'next';
import styles from './page.module.scss';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { Button } from '@/components/Button';
import { Card, CardContent, CardTags } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Input, Textarea } from '@/components/Input';
import { Skeleton, Spinner, CardSkeleton } from '@/components/Loading';
import { FolderIcon, FileIcon, PersonIcon, PaperplaneIcon, ChevronIcon } from '@/components/icons';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';

  return {
    title: 'Brand Guidelines',
    description: 'Design system and UI components for ModernAmusements Development',
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${SITE_URL}/${lang}/brand`,
      siteName: SITE_NAME,
      title: 'Brand Guidelines',
      description: 'Design system and UI components for ModernAmusements Development',
    },
  };
}

export default async function BrandPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';

  return (
    <div className={styles.brand}>
      <header className={styles.header}>
        <h1>Brand Guidelines</h1>
        <p className={styles.subtitle}>Design system and UI components for ModernAmusements Development</p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Typography</h2>
          <p className={styles.description}>Our typography system uses a monospace-inspired aesthetic for headings and clean sans-serif for body text.</p>
        </div>

        <div className={styles.subsection}>
          <h3>Headings</h3>
          <div className={styles.typeScale}>
            <div className={styles.typeItem}>
              <span className={styles.typeLabel}>H1 - Page Title</span>
              <h1 className={styles.h1}>Welcome to My Portfolio</h1>
            </div>
            <div className={styles.typeItem}>
              <span className={styles.typeLabel}>H2 - Section Title</span>
              <h2 className={styles.h2}>Featured Projects</h2>
            </div>
            <div className={styles.typeItem}>
              <span className={styles.typeLabel}>H3 - Subsection</span>
              <h3 className={styles.h3}>Latest Posts</h3>
            </div>
            <div className={styles.typeItem}>
              <span className={styles.typeLabel}>H4 - Minor Heading</span>
              <h4 className={styles.h4}>Contents</h4>
            </div>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>Paragraphs</h3>
          <div className={styles.paragraphs}>
            <div className={styles.paragraphItem}>
              <span className={styles.typeLabel}>Large</span>
              <p className={styles.paragraphLg}>Fullstack developer based in Bielefeld, NRW, Germany. Specializing in Swift, Python backend, React, and Next.js.</p>
            </div>
            <div className={styles.paragraphItem}>
              <span className={styles.typeLabel}>Medium (default)</span>
              <p className={styles.paragraphMd}>I build performant, accessible web applications and mobile apps. My journey in development started when I built my first website in college.</p>
            </div>
            <div className={styles.paragraphItem}>
              <span className={styles.typeLabel}>Small</span>
              <p className={styles.paragraphSm}>Thoughts on development, design, and everything in between.</p>
            </div>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>Lists</h3>
          <div className={styles.listExamples}>
            <div className={styles.listItem}>
              <span className={styles.typeLabel}>Unordered List</span>
              <ul className={styles.ul}>
                <li>JavaScript / TypeScript</li>
                <li>React / Next.js</li>
                <li>Python / Node.js</li>
              </ul>
            </div>
            <div className={styles.listItem}>
              <span className={styles.typeLabel}>Navigation List</span>
              <ul className={styles.navList}>
                <li>Blog</li>
                <li>Projects</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>Code</h3>
          <div className={styles.codeExamples}>
            <code className={styles.inlineCode}>npm install next</code>
            <pre className={styles.codeBlock}>{`const greeting = 'Hello World';
function sayHello() {
  console.log(greeting);
}`}</pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Colors</h2>
          <p className={styles.description}>Our color palette features a vibrant orange accent with alternative accent colors for specific use cases.</p>
        </div>

        <div className={styles.colorPalette}>
          <div className={styles.colorItem}>
            <div className={styles.colorSwatch} style={{ background: 'var(--bg)' }} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Background</span>
              <code>var(--bg)</code>
              <span className={styles.colorHex}>#0a0a0a / #fafafa</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={styles.colorSwatch} style={{ background: 'var(--text)' }} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Text</span>
              <code>var(--text)</code>
              <span className={styles.colorHex}>#ffffff / #1a1a1a</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={styles.colorSwatch} style={{ background: 'var(--accent)' }} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Primary Orange</span>
              <code>var(--accent)</code>
              <span className={styles.colorHex}>#ff6600</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={`${styles.colorSwatch} ${styles.accentSwatch}`} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Neon Green Accent</span>
              <code>#4BFF00</code>
              <span className={styles.colorHex}>Alt accent color</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={`${styles.colorSwatch} ${styles.errorSwatch}`} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Error Red</span>
              <code>#ef4444</code>
              <span className={styles.colorHex}>Error states</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={styles.colorSwatch} style={{ background: 'var(--muted)' }} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Muted</span>
              <code>var(--muted)</code>
              <span className={styles.colorHex}>#888 / #666</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={styles.colorSwatch} style={{ background: 'var(--border)' }} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Border</span>
              <code>var(--border)</code>
              <span className={styles.colorHex}>#262626 / #e5e5e5</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={styles.colorSwatch} style={{ background: 'var(--card-bg)' }} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Card Background</span>
              <code>var(--card-bg)</code>
              <span className={styles.colorHex}>#18181b / #f4f4f5</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={`${styles.colorSwatch} ${styles.accentSwatch}`} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Primary Orange</span>
              <code>var(--accent)</code>
              <span className={styles.colorHex}>#ff6600</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div className={styles.colorSwatch} style={{ background: '#FF9CEA' }} />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Pink</span>
              <code>#FF9CEA</code>
              <span className={styles.colorHex}>Accent option</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Buttons</h2>
          <p className={styles.description}>Buttons are used for primary actions. Use sparingly to maintain emphasis.</p>
        </div>

        <div className={styles.buttonExamples}>
          <div className={styles.buttonGroup}>
            <span className={styles.typeLabel}>Primary</span>
            <Button variant="primary">Get in Touch</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className={styles.buttonGroup}>
            <span className={styles.typeLabel}>Secondary</span>
            <Button variant="secondary">View Projects</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
          <div className={styles.buttonGroup}>
            <span className={styles.typeLabel}>Ghost</span>
            <Button variant="ghost">Learn More</Button>
            <Button variant="ghost" disabled>Disabled</Button>
          </div>
        </div>

        <div className={styles.buttonSizes}>
          <span className={styles.typeLabel}>Sizes</span>
          <div className={styles.sizeRow}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className={styles.buttonLoading}>
          <span className={styles.typeLabel}>Loading State</span>
          <div className={styles.sizeRow}>
            <Button loading>Sending...</Button>
            <Button variant="secondary" loading>Loading</Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Form Elements</h2>
          <p className={styles.description}>Input fields for user data collection. Always include labels for accessibility.</p>
        </div>

        <div className={styles.formExamples}>
          <div className={styles.formItem}>
            <span className={styles.typeLabel}>Text Input</span>
            <Input label="Email" placeholder="your@email.com" type="email" />
          </div>
          <div className={styles.formItem}>
            <span className={styles.typeLabel}>Textarea</span>
            <Textarea label="Message" placeholder="Your message..." rows={4} />
          </div>
          <div className={styles.formItem}>
            <span className={styles.typeLabel}>With Error</span>
            <Input label="Email" error="Invalid email address" defaultValue="invalid" />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Cards</h2>
          <p className={styles.description}>Cards display grouped content. Used for blog posts, projects, and featured items.</p>
        </div>

        <div className={styles.cardExamples}>
          <div className={styles.cardItem}>
            <span className={styles.typeLabel}>Project Card</span>
            <Card className={styles.demoCard}>
              <CardContent>
                <h4>German Police Shootings</h4>
                <p>Interactive timeline analyzing police shootings in Germany from 2000-2024.</p>
                <CardTags>
                  <span className={styles.tag}>Data Analysis</span>
                  <span className={styles.tag}>D3.js</span>
                </CardTags>
              </CardContent>
            </Card>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.typeLabel}>Blog Post Card</span>
            <Card className={styles.demoCard}>
              <CardContent>
                <span className={styles.cardDate}>March 15, 2024</span>
                <h4>Building Accessible Web Apps</h4>
                <p>A deep dive into ARIA attributes and keyboard navigation.</p>
                <CardTags>
                  <span className={styles.tag}>Accessibility</span>
                  <span className={styles.tag}>React</span>
                </CardTags>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Icons</h2>
          <p className={styles.description}>SF Symbol-inspired icons for navigation and file system visualization.</p>
        </div>

        <div className={styles.iconExamples}>
          <div className={styles.iconItem}>
            <FolderIcon />
            <span className={styles.iconName}>Folder</span>
          </div>
          <div className={styles.iconItem}>
            <FileIcon />
            <span className={styles.iconName}>File</span>
          </div>
          <div className={styles.iconItem}>
            <PersonIcon />
            <span className={styles.iconName}>Person</span>
          </div>
          <div className={styles.iconItem}>
            <PaperplaneIcon />
            <span className={styles.iconName}>Paperplane</span>
          </div>
          <div className={styles.iconItem}>
            <ChevronIcon isExpanded={false} />
            <span className={styles.iconName}>Chevron</span>
          </div>
          <div className={styles.iconItem}>
            <ChevronIcon isExpanded={true} />
            <span className={styles.iconName}>Chevron Expanded</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Loading States</h2>
          <p className={styles.description}>Loading indicators for async operations and content placeholders.</p>
        </div>

        <div className={styles.loadingExamples}>
          <div className={styles.loadingItem}>
            <span className={styles.typeLabel}>Spinner</span>
            <Spinner size={32} />
          </div>
          <div className={styles.loadingItem}>
            <span className={styles.typeLabel}>Skeleton</span>
            <Skeleton width={200} height={20} />
          </div>
          <div className={styles.loadingItem}>
            <span className={styles.typeLabel}>Card Skeleton</span>
            <CardSkeleton />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Borders & Dividers</h2>
          <p className={styles.description}>Subtle borders for separation and structure.</p>
        </div>

        <div className={styles.borderExamples}>
          <div className={styles.borderItem}>
            <span className={styles.typeLabel}>Default Border</span>
            <div className={styles.borderBox} />
          </div>
          <div className={styles.borderItem}>
            <span className={styles.typeLabel}>Accent Border</span>
            <div className={styles.borderBox} style={{ border: '1px solid var(--accent)' }} />
          </div>
          <div className={styles.borderItem}>
            <span className={styles.typeLabel}>Hover State</span>
            <div className={`${styles.borderBox} ${styles.borderHover}`} />
          </div>
        </div>

        <div className={styles.dividerExamples}>
          <span className={styles.typeLabel}>Dividers</span>
          <hr className={styles.divider} />
          <hr className={styles.dividerAccent} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Tags & Badges</h2>
          <p className={styles.description}>Small labels for categorization and metadata.</p>
        </div>

        <div className={styles.tagExamples}>
          <span className={styles.tag}>JavaScript</span>
          <span className={styles.tag}>React</span>
          <span className={styles.tag}>TypeScript</span>
          <span className={styles.tag}>Next.js</span>
          <span className={styles.tagActive}>Active Tag</span>
          <span className={styles.tagLink}>Clickable Tag</span>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Layout Sections</h2>
          <p className={styles.description}>Common page layouts and content arrangements.</p>
        </div>

        <div className={styles.layoutExamples}>
          <div className={styles.layoutItem}>
            <span className={styles.typeLabel}>Content Grid</span>
            <div className={styles.contentGrid}>
              <div className={styles.gridBox}>
                <div className={styles.gridContent}>Card 1</div>
              </div>
              <div className={styles.gridBox}>
                <div className={styles.gridContent}>Card 2</div>
              </div>
              <div className={styles.gridBox}>
                <div className={styles.gridContent}>Card 3</div>
              </div>
            </div>
          </div>

          <div className={styles.layoutItem}>
            <span className={styles.typeLabel}>Two Column Layout</span>
            <div className={styles.twoColumn}>
              <div className={styles.column}>
                <div className={styles.columnContent}>
                  <h4>Left Column</h4>
                  <p>Primary content area with detailed information.</p>
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.columnContent}>
                  <h4>Right Column</h4>
                  <p>Secondary content or navigation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.layoutItem}>
            <span className={styles.typeLabel}>Terminal Frame</span>
            <div className={styles.terminalFrame}>
              <div className={styles.terminalHeader}>
                <span>~/portfolio</span>
                <span className={styles.status}>Online</span>
              </div>
              <div className={styles.terminalContent}>
                <p><span className={styles.prompt}>~ &gt;</span> <span className={styles.cursor}>Featured Projects</span></p>
              </div>
            </div>
          </div>

          <div className={styles.layoutItem}>
            <span className={styles.typeLabel}>Hero Section</span>
            <div className={styles.heroSection}>
              <div className={styles.heroPane}>
                <span className={styles.subHeader}>C++ • Swift • Python • TS</span>
                <h2 className={styles.heroTitle}>Welcome to My Portfolio</h2>
                <p className={styles.heroSubtitle}>Senior Data Scientist at Opencode</p>
                <ul className={styles.heroList}>
                  <li>ModernAmusements Development</li>
                  <li>Shady Nathan Tawfik</li>
                  <li>Data Science | Machine Learning | AI</li>
                </ul>
                <div className={styles.heroCta}>
                  <Button variant="primary">View Projects</Button>
                  <Button variant="secondary">Get in Touch</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Brand Guidelines v1.0 • ModernAmusements Development</p>
      </footer>
    </div>
  );
}