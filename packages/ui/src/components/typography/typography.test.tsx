import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Caption } from './caption';
import { Code } from './code';
import { Heading } from './heading';
import { Label } from './label';
import { Link } from './link';
import { Paragraph } from './paragraph';
import { Small } from './small';
import { Strong } from './strong';

describe('Heading', () => {
  it('renders an h2 with the level-two defaults', () => {
    render(<Heading>Section</Heading>);

    const heading = screen.getByRole('heading', { level: 2, name: 'Section' });
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveAttribute('data-size', '4xl');
    expect(heading).toHaveAttribute('data-weight', 'semibold');
    expect(heading).toHaveAttribute('data-font', 'sans');
    expect(heading).toHaveAttribute('data-line-height', 'tight');
    expect(heading).toHaveAttribute('data-letter-spacing', 'tighter');
    expect(heading).not.toHaveAttribute('level');
  });

  it.each([
    [1, '5xl'],
    [2, '4xl'],
    [3, '3xl'],
    [4, '2xl'],
    [5, 'xl'],
    [6, 'lg'],
  ] as const)('maps level %i to the %s size', (level, size) => {
    render(<Heading level={level}>Level</Heading>);

    const heading = screen.getByRole('heading', { level, name: 'Level' });
    expect(heading).toHaveAttribute('data-size', size);
  });

  it('decouples semantics from visual size', () => {
    render(
      <Heading as="div" level={1} size="xl" id="title">
        Title
      </Heading>,
    );

    const heading = screen.getByText('Title');
    expect(heading.tagName).toBe('DIV');
    expect(heading).toHaveAttribute('id', 'title');
    expect(heading).toHaveAttribute('data-size', 'xl');
  });

  it('forwards refs to the rendered heading', () => {
    const ref = createRef<HTMLHeadingElement>();

    render(<Heading ref={ref}>Ref target</Heading>);

    expect(ref.current).toBe(screen.getByRole('heading', { level: 2, name: 'Ref target' }));
  });
});

describe('Paragraph', () => {
  it('renders a paragraph with comfortable line height', () => {
    render(<Paragraph>Body copy</Paragraph>);

    const paragraph = screen.getByText('Body copy');
    expect(paragraph.tagName).toBe('P');
    expect(paragraph).toHaveAttribute('data-size', 'md');
    expect(paragraph).toHaveAttribute('data-line-height', 'relaxed');
  });

  it('supports custom elements through as', () => {
    render(<Paragraph as="div">Loose copy</Paragraph>);

    expect(screen.getByText('Loose copy').tagName).toBe('DIV');
  });
});

describe('Label', () => {
  it('renders a native label with the form defaults', () => {
    render(<Label htmlFor="email">Email</Label>);

    const label = screen.getByText('Email');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'email');
    expect(label).toHaveAttribute('data-size', 'sm');
    expect(label).toHaveAttribute('data-weight', 'medium');
  });
});

describe('Caption', () => {
  it('renders small muted supporting text', () => {
    render(<Caption>Helper text</Caption>);

    const caption = screen.getByText('Helper text');
    expect(caption.tagName).toBe('SPAN');
    expect(caption).toHaveAttribute('data-size', 'xs');
    expect(caption).toHaveAttribute('data-tone', 'muted');
  });
});

describe('Small', () => {
  it('renders small text that inherits color', () => {
    render(<Small>Fine print</Small>);

    const small = screen.getByText('Fine print');
    expect(small.tagName).toBe('SMALL');
    expect(small).toHaveAttribute('data-size', 'sm');
    expect(small).toHaveAttribute('data-tone', 'inherit');
  });
});

describe('Strong', () => {
  it('renders semantic emphasis that inherits size and color', () => {
    render(<Strong>Important</Strong>);

    const strong = screen.getByText('Important');
    expect(strong.tagName).toBe('STRONG');
    expect(strong).toHaveAttribute('data-size', 'inherit');
    expect(strong).toHaveAttribute('data-weight', 'semibold');
    expect(strong).toHaveAttribute('data-tone', 'inherit');
  });
});

describe('Code', () => {
  it('renders inline code with a monospace face', () => {
    render(<Code>const value = 1;</Code>);

    const code = screen.getByText('const value = 1;');
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveAttribute('data-font', 'mono');
    expect(code).toHaveAttribute('data-size', 'inherit');
    expect(code).toHaveAttribute('data-tone', 'inherit');
  });
});

describe('Link', () => {
  it('renders an anchor with accent color and an underline', () => {
    render(<Link href="/docs/components/text/">Documentation</Link>);

    const link = screen.getByRole('link', { name: 'Documentation' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/docs/components/text/');
    expect(link).toHaveAttribute('data-tone', 'accent');
    expect(link).toHaveAttribute('data-underline', 'true');
  });

  it('allows the underline to be disabled', () => {
    render(
      <Link href="/plain" underline={false}>
        Plain
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Plain' })).not.toHaveAttribute('data-underline');
  });
});
