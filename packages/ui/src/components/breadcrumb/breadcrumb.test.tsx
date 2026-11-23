import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

function renderTrail() {
  return render(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>,
  );
}

describe('Breadcrumb', () => {
  it('renders a navigation landmark with the default accessible name', () => {
    renderTrail();

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('accepts a custom landmark label', () => {
    render(
      <Breadcrumb label="Trail">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole('navigation', { name: 'Trail' })).toBeInTheDocument();
  });

  it('renders a nav > ol > li structure', () => {
    const { container } = renderTrail();
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const list = nav.querySelector('ol');

    expect(screen.getByRole('list')).toBe(list);
    expect(list).not.toBeNull();
    expect(list?.parentElement).toBe(nav);

    for (const child of Array.from(list?.children ?? [])) {
      expect(child.tagName).toBe('LI');
    }

    expect(container.querySelectorAll('ol > li')).toHaveLength(5);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('forwards href and anchor attributes to links', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" className="custom" title="Read the docs" target="_self">
              Docs
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveAttribute('title', 'Read the docs');
    expect(link).toHaveAttribute('target', '_self');
    expect(link).toHaveClass('custom');
  });

  it('marks the current page without rendering a link', () => {
    renderTrail();

    const current = screen.getByText('Breadcrumb');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).not.toHaveAttribute('href');
    expect(screen.queryByRole('link', { name: 'Breadcrumb' })).not.toBeInTheDocument();
  });

  it('hides the default separator from assistive technology', () => {
    const { container } = renderTrail();
    const separators = container.querySelectorAll('li[aria-hidden="true"]');

    expect(separators).toHaveLength(2);

    for (const separator of Array.from(separators)) {
      expect(separator.querySelector('svg')).not.toBeNull();
    }
  });

  it('renders custom separator content instead of the icon', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const separator = screen.getByText('/');
    expect(separator.tagName).toBe('LI');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(separator.querySelector('svg')).toBeNull();
    expect(container.querySelectorAll('li')).toHaveLength(3);
  });

  it('announces a visually hidden label for the ellipsis', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbEllipsis label="More pages" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText('More')).toBeInTheDocument();
    const custom = screen.getByText('More pages');
    expect(custom.parentElement?.querySelector('svg')).not.toBeNull();
    expect(custom.parentElement).not.toHaveAttribute('aria-hidden');
  });

  it('forwards class names and refs from every part', () => {
    const navRef = createRef<HTMLElement>();
    const listRef = createRef<HTMLOListElement>();
    const itemRef = createRef<HTMLLIElement>();
    const linkRef = createRef<HTMLAnchorElement>();
    const pageRef = createRef<HTMLSpanElement>();
    const separatorRef = createRef<HTMLLIElement>();
    const ellipsisRef = createRef<HTMLSpanElement>();

    render(
      <Breadcrumb ref={navRef} className="nav">
        <BreadcrumbList ref={listRef} className="list">
          <BreadcrumbItem ref={itemRef} className="item">
            <BreadcrumbLink ref={linkRef} href="/" className="link">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator ref={separatorRef} className="separator" />
          <BreadcrumbItem>
            <BreadcrumbEllipsis ref={ellipsisRef} className="ellipsis" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage ref={pageRef} className="page">
              Current
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const list = nav.querySelector('ol');

    expect(nav).toHaveClass('nav');
    expect(navRef.current).toBe(nav);
    expect(list).toHaveClass('list');
    expect(listRef.current).toBe(list);
    expect(itemRef.current?.tagName).toBe('LI');
    expect(itemRef.current).toHaveClass('item');
    expect(linkRef.current).toBe(screen.getByRole('link', { name: 'Home' }));
    expect(linkRef.current).toHaveClass('link');
    expect(pageRef.current).toBe(screen.getByText('Current'));
    expect(pageRef.current).toHaveClass('page');
    expect(separatorRef.current).toHaveClass('separator');
    expect(ellipsisRef.current?.tagName).toBe('SPAN');
    expect(ellipsisRef.current).toHaveClass('ellipsis');
  });
});
