'use client';

import { useEffect, useState } from 'react';

import type { DocHeading } from '@/lib/docs-types';

import { useScrollOverflow } from './use-scroll-overflow';

export function TableOfContents({ headings }: { headings: DocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const { ref: scrollRef, overflowing, atTop, atBottom } = useScrollOverflow<HTMLDivElement>(
    headings,
  );
  const bodyClassName = [
    'toc-body',
    overflowing && !atTop ? 'toc-fade-top' : '',
    overflowing && !atBottom ? 'toc-fade-bottom' : '',
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-96px 0px -70% 0px',
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="toc" aria-label="On this page">
      <p className="toc-title">On this page</p>
      <div className={bodyClassName}>
        <div ref={scrollRef} className="toc-scroll">
          <ul className="toc-list">
            {headings.map((heading) => (
              <li
                className={heading.level === 3 ? 'toc-item toc-item-nested' : 'toc-item'}
                key={heading.id}
              >
                <a
                  className="toc-link"
                  href={`#${heading.id}`}
                  aria-current={activeId === heading.id ? 'location' : undefined}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
