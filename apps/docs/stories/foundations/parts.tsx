import type { ReactNode } from 'react';

import { Text, type TextSize, type TextTone, type TextWeight } from '@orkest/ui';

import { spacingTokens } from './data';
import styles from './foundations.module.css';

export function Page({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>{children}</div>
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: readonly string[];
}) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lede}>{description}</p>
      {meta ? (
        <div className={styles.meta}>
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
    </header>
  );
}

export function Section({
  title,
  description,
  first = false,
  children,
}: {
  title: string;
  description?: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={first ? `${styles.section} ${styles.sectionFirst}` : styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description ? <p className={styles.sectionDescription}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function ColorSwatch({ token, label }: { token: string; label?: string }) {
  return (
    <div className={styles.swatchCard}>
      <div className={styles.swatch} style={{ background: `var(${token})` }} />
      <div className={styles.swatchBody}>
        <code className={styles.tokenName}>{token}</code>
        {label ? <span className={styles.tokenMeta}>{label}</span> : null}
      </div>
    </div>
  );
}

export function TypeRow({
  meta,
  token,
  size,
  weight = 'regular',
  tone = 'default',
  sample,
}: {
  meta: string;
  token: string;
  size: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  sample: string;
}) {
  return (
    <div className={styles.typeRow}>
      <span className={styles.typeMeta}>
        <span>{meta}</span>
        <span className={styles.typeToken}>{token}</span>
      </span>
      <Text as="p" size={size} weight={weight} tone={tone} className={styles.typeSample}>
        {sample}
      </Text>
    </div>
  );
}

export function SpacingRows({
  tokens = spacingTokens,
}: {
  tokens?: readonly { token: string; px: number }[];
}) {
  return (
    <div className={styles.scaleList}>
      {tokens.map(({ token, px }) => (
        <div className={styles.scaleRow} key={token}>
          <code className={styles.scaleLabel}>{token.replace('--ok-', '')}</code>
          <div className={styles.scaleTrack}>
            <div className={styles.scaleBar} style={{ width: `var(${token})` }} />
          </div>
          <span className={styles.scaleValue}>{px}px</span>
        </div>
      ))}
    </div>
  );
}
