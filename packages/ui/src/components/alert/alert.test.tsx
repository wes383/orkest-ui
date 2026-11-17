import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Circle } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  type AlertVariant,
} from './alert';

const variants: AlertVariant[] = ['info', 'success', 'warning', 'error'];

describe('Alert', () => {
  it('renders an info alert with status semantics by default', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something changed.</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole('status');
    expect(alert).toHaveAttribute('data-variant', 'info');
    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it.each(variants)('applies the %s variant', (variant) => {
    const { container } = render(
      <Alert variant={variant}>
        <AlertTitle>{variant}</AlertTitle>
      </Alert>,
    );

    expect(container.firstElementChild).toHaveAttribute(
      'data-variant',
      variant,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('hides the icon when icon is null', () => {
    const { container } = render(
      <Alert icon={null}>
        <AlertTitle>No icon</AlertTitle>
      </Alert>,
    );

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders a custom icon', () => {
    const { container } = render(
      <Alert icon={Circle}>
        <AlertTitle>Custom icon</AlertTitle>
      </Alert>,
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('uses alert for errors and status for other variants', () => {
    const { unmount } = render(
      <Alert variant="error">
        <AlertTitle>Upload failed</AlertTitle>
      </Alert>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    unmount();

    render(
      <Alert variant="warning">
        <AlertTitle>Unsaved changes</AlertTitle>
      </Alert>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('allows overriding and removing the live region role', () => {
    const { unmount } = render(
      <Alert role="note">
        <AlertTitle>Note</AlertTitle>
      </Alert>,
    );

    expect(screen.getByRole('note')).toBeInTheDocument();
    unmount();

    const { container } = render(
      // `role={null}` is a supported API that removes the live region role.
      // eslint-disable-next-line jsx-a11y/aria-role
      <Alert role={null}>
        <AlertTitle>Static</AlertTitle>
      </Alert>,
    );

    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('renders the title and description as paragraphs', () => {
    render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>,
    );

    expect(screen.getByText('Title').tagName).toBe('P');
    expect(screen.getByText('Description').tagName).toBe('P');
  });

  it('renders a close button and calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Alert closable onClose={onClose}>
        <AlertTitle>Dismissible</AlertTitle>
      </Alert>,
    );

    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close).toHaveAttribute('type', 'button');

    await user.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('supports a custom close label', () => {
    render(
      <Alert closable closeLabel="Dismiss warning">
        <AlertTitle>Warning</AlertTitle>
      </Alert>,
    );

    expect(
      screen.getByRole('button', { name: 'Dismiss warning' }),
    ).toBeInTheDocument();
  });

  it('does not render a close button by default', () => {
    render(
      <Alert>
        <AlertTitle>Static</AlertTitle>
      </Alert>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders an action area', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <Alert variant="error">
        <AlertTitle>Upload failed</AlertTitle>
        <AlertAction>
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        </AlertAction>
      </Alert>,
    );

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('supports a standalone icon with an accessible name', () => {
    render(<AlertIcon variant="warning" label="Warning" />);

    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  it('supports a manual close button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<AlertClose onClick={onClick} label="Close alert" />);

    await user.click(screen.getByRole('button', { name: 'Close alert' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Alert
        ref={ref}
        id="account-status"
        className="custom"
        aria-label="Account status"
      >
        <AlertTitle>Active</AlertTitle>
      </Alert>,
    );

    const alert = screen.getByRole('status');
    expect(alert).toHaveAttribute('id', 'account-status');
    expect(alert).toHaveAttribute('aria-label', 'Account status');
    expect(alert).toHaveClass('custom');
    expect(ref.current).toBe(alert);
  });
});
