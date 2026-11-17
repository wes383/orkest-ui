import { createRef, type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  type CardPadding,
  type CardVariant,
} from './card';

const variants: CardVariant[] = ['default', 'elevated', 'outline'];
const paddings: CardPadding[] = ['none', 'sm', 'md', 'lg'];

function renderCard(element: ReactElement) {
  const { container } = render(element);

  return container.firstElementChild as HTMLElement;
}

describe('Card', () => {
  it('renders a div with the default attributes', () => {
    const card = renderCard(<Card>Content</Card>);

    expect(card.tagName).toBe('DIV');
    expect(card).toHaveAttribute('data-variant', 'default');
    expect(card).toHaveAttribute('data-padding', 'md');
    expect(card).toHaveAttribute('data-shadow', 'none');
    expect(card).toHaveTextContent('Content');
  });

  it.each(variants)('applies the %s variant', (variant) => {
    expect(renderCard(<Card variant={variant} />)).toHaveAttribute('data-variant', variant);
  });

  it.each(paddings)('applies the %s padding', (padding) => {
    expect(renderCard(<Card padding={padding} />)).toHaveAttribute('data-padding', padding);
  });

  it('raises the elevated variant by default', () => {
    expect(renderCard(<Card variant="elevated" />)).toHaveAttribute('data-shadow', 'md');
    expect(renderCard(<Card variant="outline" />)).toHaveAttribute('data-shadow', 'none');
  });

  it('lets the shadow prop override the variant default', () => {
    expect(renderCard(<Card variant="elevated" shadow="none" />)).toHaveAttribute(
      'data-shadow',
      'none',
    );
    expect(renderCard(<Card shadow="lg" />)).toHaveAttribute('data-shadow', 'lg');
  });

  it('treats a numeric radius as pixels', () => {
    const card = renderCard(<Card radius={20} />);

    expect(card.style.getPropertyValue('--card-radius')).toBe('20px');
  });

  it('keeps string radii unchanged', () => {
    const card = renderCard(<Card radius="calc(1rem + 2px)" />);

    expect(card.style.getPropertyValue('--card-radius')).toBe('calc(1rem + 2px)');
  });

  it('renders as the element passed through as', () => {
    const card = renderCard(
      <Card as="a" href="/docs/components/card/">
        Open
      </Card>,
    );

    expect(card.tagName).toBe('A');
    expect(card).toHaveAttribute('href', '/docs/components/card/');
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLDivElement>();
    const card = renderCard(
      <Card ref={ref} id="card" className="custom" aria-label="Account summary" />,
    );

    expect(card).toHaveAttribute('id', 'card');
    expect(card).toHaveAttribute('aria-label', 'Account summary');
    expect(card).toHaveClass('custom');
    expect(ref.current).toBe(card);
  });
});

describe('Card parts', () => {
  it('renders the expected elements', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Title' }).tagName).toBe('H3');
    expect(screen.getByText('Description').tagName).toBe('P');
    expect(screen.getByText('Content').tagName).toBe('DIV');
    expect(screen.getByText('Footer').tagName).toBe('DIV');
    expect(container.querySelectorAll('div')).toHaveLength(4);
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('renders the title as h%s', (level) => {
    render(<CardTitle level={level}>Title</CardTitle>);

    expect(screen.getByRole('heading', { level, name: 'Title' })).toBeInTheDocument();
  });

  it('renders media as a div that can hold an image', () => {
    const media = renderCard(
      <Card>
        <CardMedia>
          <img src="cover.png" alt="Cover" />
        </CardMedia>
      </Card>,
    );

    expect(media.firstElementChild?.tagName).toBe('DIV');
    expect(screen.getByRole('img', { name: 'Cover' })).toBeInTheDocument();
  });

  it('forwards class names and refs on parts', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Card>
        <CardHeader ref={ref} className="custom" />
      </Card>,
    );

    expect(ref.current).toHaveClass('custom');
  });
});
