import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Check, Search } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Input, type InputSize } from './input';

const sizes: InputSize[] = ['sm', 'md', 'lg', 'xl'];

describe('Input', () => {
  it('renders a native text input with the default size', () => {
    const { container } = render(<Input placeholder="Email" />);

    const input = screen.getByPlaceholderText('Email') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(input.type).toBe('text');

    const field = container.firstElementChild;
    expect(field).toHaveAttribute('data-size', 'md');
    expect(field).not.toHaveAttribute('data-invalid');
    expect(field).not.toHaveAttribute('data-disabled');
    expect(field).not.toHaveAttribute('data-read-only');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it.each(sizes)('applies the %s size to the field', (size) => {
    const { container } = render(<Input size={size} placeholder="Field" />);

    expect(container.firstElementChild).toHaveAttribute('data-size', size);
  });

  it('exposes the invalid state', () => {
    const { container } = render(<Input invalid placeholder="Email" />);

    expect(container.firstElementChild).toHaveAttribute('data-invalid', 'true');
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('exposes disabled and read-only states', () => {
    const { container, rerender } = render(<Input disabled placeholder="Disabled" />);

    expect(container.firstElementChild).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();

    rerender(<Input readOnly placeholder="Read only" />);

    expect(container.firstElementChild).toHaveAttribute('data-read-only', 'true');
    expect((screen.getByPlaceholderText('Read only') as HTMLInputElement).readOnly).toBe(true);
  });

  it('renders leading and trailing icons as decorative', () => {
    const { container } = render(
      <Input leftIcon={Search} rightIcon={Check} placeholder="Search" />,
    );

    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);

    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('forwards native attributes, class names, styles, and refs', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Input
        ref={ref}
        id="email"
        name="email"
        type="email"
        className="custom"
        style={{ color: 'red' }}
        aria-describedby="email-help"
        placeholder="Email"
      />,
    );

    const input = screen.getByPlaceholderText('Email') as HTMLInputElement;
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('aria-describedby', 'email-help');
    expect(input).toHaveClass('custom');
    expect(input.style.color).toBe('red');
    expect(ref.current).toBe(input);
  });

  it('calls onChange while typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input onChange={onChange} placeholder="Type" />);
    await user.type(screen.getByPlaceholderText('Type'), 'abc');

    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
