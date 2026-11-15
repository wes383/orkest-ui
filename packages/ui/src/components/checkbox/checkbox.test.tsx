import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox, type CheckboxSize } from './checkbox';

const sizes: CheckboxSize[] = ['sm', 'md', 'lg'];

describe('Checkbox', () => {
  it('renders a labelled native checkbox', () => {
    render(<Checkbox label="Accept terms" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toBeDisabled();
  });

  it('supports uncontrolled and controlled checked state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { unmount } = render(
      <Checkbox label="Default checked" defaultChecked onChange={onChange} />,
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
    await user.click(screen.getByText('Default checked'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    unmount();

    render(<Checkbox label="Controlled checked" checked onChange={onChange} />);
    expect(screen.getByRole('checkbox', { name: 'Controlled checked' })).toBeChecked();
  });

  it('exposes an independent indeterminate state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox label="Select all" indeterminate onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).not.toBeChecked();

    await user.click(screen.getByText('Select all'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(checkbox.indeterminate).toBe(true);
  });

  it('blocks interaction when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox label="Disabled" disabled onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Disabled' });
    expect(checkbox).toBeDisabled();

    await user.click(screen.getByText('Disabled'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards native form attributes', () => {
    render(
      <Checkbox
        label="Newsletter"
        name="newsletter"
        value="weekly"
        required
        aria-describedby="newsletter-help"
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Newsletter' });
    expect(checkbox).toHaveAttribute('name', 'newsletter');
    expect(checkbox).toHaveAttribute('value', 'weekly');
    expect(checkbox).toBeRequired();
    expect(checkbox).toHaveAttribute('aria-describedby', 'newsletter-help');
  });

  it.each(sizes)('applies the %s size', (size) => {
    const { container } = render(<Checkbox size={size} label="Size" />);

    expect(container.querySelector(`[data-size="${size}"]`)).toBeInTheDocument();
  });

  it('forwards refs to the input and merges class names', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Checkbox ref={ref} label="Ref" className="custom" id="terms" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Ref' });
    expect(ref.current).toBe(checkbox);
    expect(checkbox).toHaveAttribute('id', 'terms');
    expect(checkbox.closest('label')).toHaveClass('custom');
  });
});
