import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArrowRight, Plus } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Button, type ButtonSize, type ButtonVariant } from './button';

const variants: ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
];

const sizes: ButtonSize[] = ['sm', 'md', 'lg', 'xl'];

describe('Button', () => {
  it('renders a native button with the default props', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).not.toHaveAttribute('data-loading');
    expect(button).not.toHaveAttribute('data-icon-only');
    expect(button).not.toHaveAttribute('data-full-width');
    expect(button).not.toHaveAttribute('aria-busy');
  });

  it.each(variants)('applies the %s variant', (variant) => {
    render(<Button variant={variant}>Action</Button>);

    expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute(
      'data-variant',
      variant,
    );
  });

  it.each(sizes)('applies the %s size', (size) => {
    render(<Button size={size}>Action</Button>);

    expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute('data-size', size);
  });

  it('forwards native attributes, custom class names, and refs', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <Button ref={ref} id="save" className="custom" name="action" value="save">
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('id', 'save');
    expect(button).toHaveClass('custom');
    expect(button).toHaveAttribute('name', 'action');
    expect(button).toHaveAttribute('value', 'save');
    expect(ref.current).toBe(button);
  });

  it('keeps an explicit native type', () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('renders leading and trailing icons as decorative', () => {
    const { container } = render(
      <Button leftIcon={Plus} rightIcon={ArrowRight}>
        Create
      </Button>,
    );

    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);

    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Run</Button>);
    await user.click(screen.getByRole('button', { name: 'Run' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('blocks interaction and exposes busy state while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <Button loading leftIcon={Plus} onClick={onClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Saving' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(container.querySelectorAll('svg')).toHaveLength(1);

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports full-width buttons', () => {
    render(<Button fullWidth>Continue</Button>);

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute(
      'data-full-width',
      'true',
    );
  });

  it('supports icon-only buttons when an accessible name is provided', () => {
    render(<Button iconOnly leftIcon={Plus} aria-label="Add item" />);

    const button = screen.getByRole('button', { name: 'Add item' });
    expect(button).toHaveAttribute('data-icon-only', 'true');
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
