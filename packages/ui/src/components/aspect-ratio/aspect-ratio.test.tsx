import { createRef, type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AspectRatio } from './aspect-ratio';

function renderRatio(element: ReactElement) {
  const { container } = render(element);

  return container.firstElementChild as HTMLElement;
}

describe('AspectRatio', () => {
  it('applies the default 16 / 9 ratio', () => {
    const ratio = renderRatio(<AspectRatio />);

    expect(ratio.tagName).toBe('DIV');
    expect(ratio.style.aspectRatio).toBe('16 / 9');
  });

  it('accepts a numeric ratio', () => {
    // jsdom serializes a bare number as an explicit ratio.
    expect(renderRatio(<AspectRatio ratio={4} />).style.aspectRatio).toBe('4 / 1');
  });

  it('accepts a string ratio', () => {
    expect(renderRatio(<AspectRatio ratio="1 / 1" />).style.aspectRatio).toBe('1 / 1');
  });

  it('lets the consumer style override the ratio', () => {
    const ratio = renderRatio(
      <AspectRatio ratio="4 / 3" style={{ aspectRatio: '2 / 1', width: '50%' }} />,
    );

    expect(ratio.style.aspectRatio).toBe('2 / 1');
    expect(ratio.style.width).toBe('50%');
  });

  it('renders children and forwards class names and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <AspectRatio ref={ref} className="custom" data-testid="ratio">
        <span>Content</span>
      </AspectRatio>,
    );

    const ratio = screen.getByTestId('ratio');
    expect(ratio).toHaveClass('custom');
    expect(ratio).toContainElement(screen.getByText('Content'));
    expect(ref.current).toBe(ratio);
  });
});
