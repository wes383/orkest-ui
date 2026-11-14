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

    const field = container.querySelector('[data-size="md"]');
    expect(field).toHaveAttribute('data-size', 'md');
    expect(field).not.toHaveAttribute('data-invalid');
    expect(field).not.toHaveAttribute('data-disabled');
    expect(field).not.toHaveAttribute('data-read-only');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it.each(sizes)('applies the %s size to the field', (size) => {
    const { container } = render(<Input size={size} placeholder="Field" />);

    expect(container.querySelector(`[data-size="${size}"]`)).toBeInTheDocument();
  });

  it('exposes the invalid state', () => {
    const { container } = render(<Input invalid placeholder="Email" />);

    expect(container.querySelector('[data-invalid="true"]')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('exposes disabled and read-only states', () => {
    const { container, rerender } = render(<Input disabled placeholder="Disabled" />);

    expect(container.querySelector('[data-disabled="true"]')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();

    rerender(<Input readOnly placeholder="Read only" />);

    expect(container.querySelector('[data-read-only="true"]')).toBeInTheDocument();
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

  it('renders prefix and suffix content', () => {
    render(<Input prefix="$" suffix="USD" placeholder="Amount" />);

    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('clears the value and hides the clear action', async () => {
    const user = userEvent.setup();

    render(<Input clearable defaultValue="hello" aria-label="Name" />);

    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    expect(input.value).toBe('hello');

    await user.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(input.value).toBe('');
    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
  });

  it('does not show the clear action for an empty input', () => {
    render(<Input clearable aria-label="Empty" />);

    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
  });

  it('marks the field when an action is present', () => {
    const { container } = render(<Input clearable defaultValue="Value" aria-label="Name" />);

    expect(container.querySelector('[data-actions="true"]')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(
      <Input type="password" passwordToggle defaultValue="secret" aria-label="Password" />,
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input.type).toBe('text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input.type).toBe('password');
  });

  it('shows a character count', async () => {
    const user = userEvent.setup();

    render(<Input showCount maxLength={10} defaultValue="abc" aria-label="Bio" />);

    expect(screen.getByText('3 / 10')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Bio' }), 'd');

    expect(screen.getByText('4 / 10')).toBeInTheDocument();
  });

  it('derives the character count from a controlled value', () => {
    render(
      <Input showCount maxLength={10} value="abcd" onChange={() => {}} aria-label="Controlled" />,
    );

    expect(screen.getByText('4 / 10')).toBeInTheDocument();
  });

  it('hides actions when disabled', () => {
    render(
      <Input
        clearable
        passwordToggle
        type="password"
        defaultValue="secret"
        disabled
        aria-label="Password"
      />,
    );

    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show password' })).not.toBeInTheDocument();
  });
});
