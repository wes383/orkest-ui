import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner, type SpinnerSize } from './spinner';

const sizes: SpinnerSize[] = ['sm', 'md', 'lg'];

describe('Spinner', () => {
  it('announces the default label through a status region', () => {
    render(<Spinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveTextContent('Loading');
    expect(spinner).toHaveAttribute('data-size', 'md');
    expect(spinner).not.toHaveAttribute('aria-hidden');
  });

  it('announces a custom label', () => {
    render(<Spinner label="Saving changes" />);

    expect(screen.getByRole('status')).toHaveTextContent('Saving changes');
  });

  it.each(sizes)('applies the %s size', (size) => {
    render(<Spinner size={size} />);

    expect(screen.getByRole('status')).toHaveAttribute('data-size', size);
  });

  it('renders decoratively when the label is null', () => {
    const { container } = render(<Spinner label={null} />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    const spinner = container.firstElementChild as HTMLElement;
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  it('renders decoratively when hidden from assistive technology', () => {
    const { container } = render(<Spinner aria-hidden="true" />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    const spinner = container.firstElementChild as HTMLElement;
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the ring itself out of the accessibility tree', () => {
    const { container } = render(<Spinner />);

    const ring = container.querySelector('[class*="track"]');
    expect(ring).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies a custom colour', () => {
    render(<Spinner color="rebeccapurple" />);

    // jsdom normalises named colours when writing to the style attribute.
    expect(screen.getByRole('status')).toHaveStyle({ color: 'rgb(102, 51, 153)' });
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Spinner ref={ref} id="saving" className="custom" />);

    const spinner = container.firstElementChild as HTMLElement;
    expect(spinner).toHaveAttribute('id', 'saving');
    expect(spinner).toHaveClass('custom');
    expect(ref.current).toBe(spinner);
  });
});
