import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('renders a square icon-only button with an accessible name', () => {
    render(<IconButton icon={Settings} label="Settings" />);

    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).toHaveAttribute('data-icon-only', 'true');
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies variant and size', () => {
    render(<IconButton icon={Settings} label="Settings" variant="outline" size="xl" />);

    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'xl');
  });

  it('forwards native attributes, custom class names, and refs', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <IconButton
        ref={ref}
        icon={Settings}
        label="Settings"
        id="settings"
        name="settings"
        className="custom"
      />,
    );

    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveAttribute('id', 'settings');
    expect(button).toHaveAttribute('name', 'settings');
    expect(button).toHaveClass('custom');
    expect(ref.current).toBe(button);
  });

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<IconButton icon={Settings} label="Settings" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Settings' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('blocks interaction and exposes busy state while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<IconButton icon={Settings} label="Settings" loading onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', 'true');

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
