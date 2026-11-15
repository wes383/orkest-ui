import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Grid } from './grid';

describe('Grid', () => {
  it('renders a div with no inline variables by default', () => {
    render(<Grid data-testid="grid" />);

    const grid = screen.getByTestId('grid');
    expect(grid.tagName).toBe('DIV');
    expect(grid.style.getPropertyValue('--grid-columns-base')).toBe('');
    expect(grid.style.getPropertyValue('--grid-gap-base')).toBe('');
  });

  it('turns a numeric column count into an equal track template', () => {
    render(<Grid columns={3} data-testid="grid" />);

    expect(screen.getByTestId('grid').style.getPropertyValue('--grid-columns-base')).toBe(
      'repeat(3, minmax(0, 1fr))',
    );
  });

  it('passes native grid templates through', () => {
    render(<Grid columns="repeat(auto-fit, minmax(12rem, 1fr))" data-testid="grid" />);

    expect(screen.getByTestId('grid').style.getPropertyValue('--grid-columns-base')).toBe(
      'repeat(auto-fit, minmax(12rem, 1fr))',
    );
  });

  it('expands responsive column values into breakpoint variables', () => {
    render(<Grid columns={{ base: 1, md: 3 }} data-testid="grid" />);

    const grid = screen.getByTestId('grid');
    expect(grid.style.getPropertyValue('--grid-columns-base')).toBe(
      'repeat(1, minmax(0, 1fr))',
    );
    expect(grid.style.getPropertyValue('--grid-columns-sm')).toBe(
      'repeat(1, minmax(0, 1fr))',
    );
    expect(grid.style.getPropertyValue('--grid-columns-md')).toBe(
      'repeat(3, minmax(0, 1fr))',
    );
  });

  it('supports numeric and template rows', () => {
    render(<Grid rows={2} data-testid="grid" />);
    expect(screen.getByTestId('grid').style.getPropertyValue('--grid-rows-base')).toBe(
      'repeat(2, minmax(0, 1fr))',
    );

    render(<Grid rows="auto 1fr" data-testid="rows" />);
    expect(screen.getByTestId('rows').style.getPropertyValue('--grid-rows-base')).toBe(
      'auto 1fr',
    );
  });

  it('maps gap props to spacing tokens', () => {
    render(<Grid gap={4} columnGap={2} rowGap={6} data-testid="grid" />);

    const grid = screen.getByTestId('grid');
    expect(grid.style.getPropertyValue('--grid-gap-base')).toBe('var(--ok-space-4)');
    expect(grid.style.getPropertyValue('--grid-column-gap-base')).toBe(
      'var(--ok-space-2)',
    );
    expect(grid.style.getPropertyValue('--grid-row-gap-base')).toBe('var(--ok-space-6)');
  });

  it('expands responsive gap values into breakpoint variables', () => {
    render(<Grid gap={{ base: 2, lg: 6 }} data-testid="grid" />);

    const grid = screen.getByTestId('grid');
    expect(grid.style.getPropertyValue('--grid-gap-base')).toBe('var(--ok-space-2)');
    expect(grid.style.getPropertyValue('--grid-gap-sm')).toBe('var(--ok-space-2)');
    expect(grid.style.getPropertyValue('--grid-gap-lg')).toBe('var(--ok-space-6)');
  });

  it('maps alignment and auto flow to data attributes', () => {
    render(
      <Grid
        data-testid="grid"
        align="center"
        justify="end"
        autoFlow="row dense"
      />,
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveAttribute('data-align', 'center');
    expect(grid).toHaveAttribute('data-justify', 'end');
    expect(grid).toHaveAttribute('data-auto-flow', 'row dense');
  });

  it('renders the element requested through as and preserves semantics', () => {
    render(
      <Grid as="section" aria-label="Gallery" columns={2}>
        <article>One</article>
        <article>Two</article>
      </Grid>,
    );

    const section = screen.getByRole('region', { name: 'Gallery' });
    expect(section.tagName).toBe('SECTION');
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Grid ref={ref} id="grid" className="custom" data-testid="grid" />);

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveAttribute('id', 'grid');
    expect(grid).toHaveClass('custom');
    expect(ref.current).toBe(grid);
  });

  it('lets the style prop override generated values', () => {
    render(<Grid gap={4} style={{ gap: '2rem' }} data-testid="grid" />);

    expect(screen.getByTestId('grid').style.gap).toBe('2rem');
  });
});
