import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VisuallyHidden } from './visually-hidden';

describe('VisuallyHidden', () => {
  it('renders its text in a span', () => {
    render(<VisuallyHidden>Search the documentation</VisuallyHidden>);

    const hidden = screen.getByText('Search the documentation');
    expect(hidden.tagName).toBe('SPAN');
  });

  it('hides visually while keeping the content readable for assistive technology', () => {
    render(<VisuallyHidden>Additional context</VisuallyHidden>);

    const hidden = screen.getByText('Additional context');
    expect(hidden.className).not.toBe('');
    expect(hidden).not.toHaveAttribute('hidden');
    expect(hidden).not.toHaveAttribute('aria-hidden');
    expect(hidden).not.toHaveStyle({ display: 'none' });
    expect(hidden).not.toHaveStyle({ visibility: 'hidden' });
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <VisuallyHidden ref={ref} id="description" className="custom" data-testid="hidden">
        More
      </VisuallyHidden>,
    );

    const hidden = screen.getByTestId('hidden');
    expect(hidden).toHaveAttribute('id', 'description');
    expect(hidden).toHaveClass('custom');
    expect(ref.current).toBe(hidden);
  });
});
