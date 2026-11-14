import Link from 'next/link';

import type { DocsSectionId } from '@/lib/docs-navigation';

export function Breadcrumbs({
  sectionId,
  sectionLabel,
  title,
}: {
  sectionId: DocsSectionId;
  sectionLabel: string;
  title: string;
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href={`/docs/#${sectionId}`}>{sectionLabel}</Link>
        </li>
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}
