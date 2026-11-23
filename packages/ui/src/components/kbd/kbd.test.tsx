import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Kbd } from './kbd';

describe('Kbd', () => {
  it('renders a kbd with the default size', () => {
    render(<Kbd>K</Kbd>);

    const kbd = screen.getByText('K');
    expect(kbd.tagName).toBe('KBD');
    expect(kbd).toHaveAttribute('data-size', 'md');
  });

  it('applies the small size', () => {
    render(<Kbd size="sm">Esc</Kbd>);

    expect(screen.getByText('Esc')).toHaveAttribute('data-size', 'sm');
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Kbd ref={ref} id="save-shortcut" className="custom" title="Save the document">
        Ctrl S
      </Kbd>,
    );

    const kbd = screen.getByText('Ctrl S');
    expect(kbd).toHaveAttribute('id', 'save-shortcut');
    expect(kbd).toHaveAttribute('title', 'Save the document');
    expect(kbd).toHaveClass('custom');
    expect(ref.current).toBe(kbd);
  });
});
