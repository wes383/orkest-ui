import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Box } from './box';

describe('Box', () => {
  it('renders a div by default and keeps its children', () => {
    render(<Box data-testid="box">Content</Box>);

    const box = screen.getByTestId('box');
    expect(box.tagName).toBe('DIV');
    expect(box).toHaveTextContent('Content');
  });

  it('renders the element requested through as', () => {
    render(<Box as="section" aria-label="Example" />);

    const section = screen.getByRole('region', { name: 'Example' });
    expect(section.tagName).toBe('SECTION');
  });

  it('maps dimensions and spacing to CSS', () => {
    render(
      <Box
        data-testid="box"
        width={320}
        height="50%"
        minWidth={120}
        maxWidth="40rem"
        minHeight="2rem"
        maxHeight={480}
        padding={4}
      />,
    );

    const box = screen.getByTestId('box');
    expect(box.style.width).toBe('320px');
    expect(box.style.height).toBe('50%');
    expect(box.style.minWidth).toBe('120px');
    expect(box.style.maxWidth).toBe('40rem');
    expect(box.style.minHeight).toBe('2rem');
    expect(box.style.maxHeight).toBe('480px');
    expect(box.style.padding).toBe('var(--ok-space-4)');
  });

  it('maps semantic color, border, radius, shadow, and overflow props', () => {
    render(
      <Box
        data-testid="box"
        background="surface"
        color="muted"
        border
        radius="lg"
        shadow="md"
        overflow="hidden"
      />,
    );

    const box = screen.getByTestId('box');
    expect(box.style.background).toBe('var(--ui-surface)');
    expect(box.style.color).toBe('var(--ui-muted-foreground)');
    expect(box.style.borderWidth).toBe('var(--ok-border-width)');
    expect(box.style.borderStyle).toBe('solid');
    expect(box.style.borderColor).toBe('var(--ui-border)');
    expect(box.style.borderRadius).toBe('var(--ok-radius-lg)');
    expect(box.style.boxShadow).toBe('var(--ui-shadow-md)');
    expect(box.style.overflow).toBe('hidden');
  });

  it('supports border tokens and transparent or inherited colors', () => {
    render(
      <Box
        data-testid="box"
        background="transparent"
        color="inherit"
        border="strong"
      />,
    );

    const box = screen.getByTestId('box');
    expect(box.style.background).toBe('transparent');
    expect(box.style.color).toBe('inherit');
    expect(box.style.borderColor).toBe('var(--ui-border-strong)');
  });

  it('lets the style prop override generated values', () => {
    render(<Box data-testid="box" padding={4} style={{ padding: '2rem' }} />);

    expect(screen.getByTestId('box').style.padding).toBe('2rem');
  });

  it('forwards native attributes and merges custom class names', () => {
    render(<Box id="target" className="custom" data-state="open" />);

    const box = document.getElementById('target');
    expect(box).toHaveClass('custom');
    expect(box).toHaveAttribute('data-state', 'open');
  });

  it('forwards refs to the rendered element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Box ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
