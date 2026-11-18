import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/docs/breadcrumbs';
import { CopyMarkdownButton } from '@/components/docs/copy-markdown-button';
import { PrevNext } from '@/components/docs/prev-next';
import { TableOfContents } from '@/components/docs/table-of-contents';
import { getAdjacentDocs, getDocBySlug, getDocs } from '@/lib/docs-source';
import { MdxContent } from '@/lib/mdx';

type DocRouteProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getDocs().map((doc) => ({ slug: doc.slugSegments }));
}

export async function generateMetadata({ params }: DocRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug.join('/'));

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocRoute({ params }: DocRouteProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug.join('/'));

  if (!doc) {
    notFound();
  }

  const { previous, next } = getAdjacentDocs(doc.slug);
  const wordCount = doc.plainText.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className={doc.headings.length > 0 ? 'page-grid' : 'page-grid page-grid-no-toc'}>
      <article className="doc-article">
        <div className="page-topbar">
          <Breadcrumbs sectionId={doc.section} sectionLabel={doc.sectionLabel} title={doc.title} />
          <CopyMarkdownButton />
        </div>

        <header className="page-header">
          <p className="page-eyebrow">{doc.sectionLabel}</p>
          <h1 className="page-title">{doc.title}</h1>
          <p className="page-description">{doc.description}</p>
          <p className="page-meta">
            <span>{readingMinutes} min read</span>
          </p>
        </header>

        <div className="prose">
          <MdxContent source={doc.content} />
        </div>

        <PrevNext previous={previous} next={next} />
      </article>

      <TableOfContents headings={doc.headings} />
    </div>
  );
}
