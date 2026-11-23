import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Slider } from './slider';

describe('Slider', () => {
  it('renders a labelled single-thumb slider', () => {
    render(<Slider label="Volume" defaultValue={40} />);

    const thumb = screen.getByRole('slider', { name: 'Volume' });

    expect(thumb).toHaveAttribute('aria-valuenow', '40');
    expect(thumb).toHaveAttribute('min', '0');
    expect(thumb).toHaveAttribute('max', '100');
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('changes the value with arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<Slider label="Volume" defaultValue={40} onValueChange={onValueChange} />);

    const thumb = screen.getByRole('slider', { name: 'Volume' });
    thumb.focus();

    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '41');
    expect(onValueChange).toHaveBeenLastCalledWith(41, expect.objectContaining({}));

    await user.keyboard('{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

  it('reports changes without updating a controlled value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<Slider label="Volume" value={25} onValueChange={onValueChange} />);

    const thumb = screen.getByRole('slider', { name: 'Volume' });
    thumb.focus();

    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenCalledWith(26, expect.objectContaining({}));
    expect(thumb).toHaveAttribute('aria-valuenow', '25');
  });

  it('renders one thumb per range value', () => {
    render(<Slider label="Price" defaultValue={[20, 60]} />);

    const thumbs = screen.getAllByRole('slider', { name: 'Price' });

    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20');
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '60');
  });

  it('does not change when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<Slider label="Volume" defaultValue={50} disabled onValueChange={onValueChange} />);

    const thumb = screen.getByRole('slider', { name: 'Volume' });

    expect(thumb).toBeDisabled();

    await user.click(thumb);
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(thumb).toHaveAttribute('aria-valuenow', '50');
  });

  it('shows the formatted value when showValue is set', () => {
    render(<Slider label="Volume" defaultValue={30} showValue />);

    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('supports vertical orientation', () => {
    const { container } = render(
      <Slider label="Volume" defaultValue={30} orientation="vertical" />,
    );

    expect(container.firstElementChild).toHaveAttribute('data-orientation', 'vertical');
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('forwards className, size, and ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Slider ref={ref} label="Volume" defaultValue={10} className="custom-slider" size="lg" />,
    );

    const root = screen.getByRole('slider', { name: 'Volume' }).closest('[data-size]');

    expect(root).toHaveClass('custom-slider');
    expect(root).toHaveAttribute('data-size', 'lg');
    expect(ref.current).toBe(root);
  });

  it('uses the medium size by default', () => {
    const { container } = render(<Slider label="Volume" defaultValue={10} />);

    expect(container.querySelector('[data-size]')).toHaveAttribute('data-size', 'md');
  });
});
