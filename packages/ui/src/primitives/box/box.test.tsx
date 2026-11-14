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
