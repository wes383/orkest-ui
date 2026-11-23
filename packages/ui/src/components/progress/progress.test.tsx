import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from './progress';

describe('Progress', () => {
  it('exposes determinate progress semantics', () => {
    render(<Progress value={40} />);

    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders a label and uses it as the accessible name', () => {
    render(<Progress value={40} label="Upload progress" />);

    expect(screen.getByText('Upload progress')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toBeInTheDocument();
  });

  it('falls back to aria-label and forwards aria-valuetext', () => {
    render(<Progress value={3} min={0} max={5} aria-label="Steps" aria-valuetext="3 of 5 steps" />);

    const bar = screen.getByRole('progressbar', { name: 'Steps' });

    expect(bar).toHaveAttribute('aria-valuetext', '3 of 5 steps');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
  });

  it('shows the formatted value when showValue is set', () => {
    render(<Progress value={70} label="Upload" showValue />);

    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('renders an indeterminate bar without a value', () => {
    render(<Progress value={null} label="Preparing" showValue />);

    const bar = screen.getByRole('progressbar', { name: 'Preparing' });

    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-indeterminate');
    expect(bar).toHaveAttribute('aria-valuetext', 'indeterminate progress');
  });

  it('respects custom min and max', () => {
    render(<Progress value={5} min={0} max={5} />);

    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveAttribute('aria-valuenow', '5');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(bar).toHaveAttribute('aria-valuetext', '100%');
  });

  it('forwards className, size, and ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Progress ref={ref} value={25} className="custom-progress" size="lg" />);

    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveClass('custom-progress');
    expect(bar).toHaveAttribute('data-size', 'lg');
    expect(ref.current).toBe(bar);
  });

  it('uses the medium size by default', () => {
    render(<Progress value={10} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'md');
  });
});
