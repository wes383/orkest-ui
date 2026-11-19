import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createToast,
  toast,
  Toast,
  ToastContent,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

function renderToastHost({
  limit,
  position,
}: {
  limit?: number;
  position?: 'top-right' | 'bottom-left';
} = {}) {
  return render(
    <ToastProvider limit={limit}>
      <ToastViewport position={position} />
    </ToastProvider>,
  );
}

afterEach(() => {
  act(() => {
    toast.dismissAll();
  });
});

describe('Toast', () => {
  it('renders a polite notification region through a portal', async () => {
    const { container } = renderToastHost();

    act(() => {
      toast.success('Saved', { description: 'Changes were stored.' });
    });

    expect(await screen.findByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Changes were stored.')).toBeInTheDocument();

    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(container.contains(region)).toBe(false);
    expect(document.querySelector('[data-type="success"]')).toBeInTheDocument();
  });

  it('closes from the close button', async () => {
    const user = userEvent.setup();
    renderToastHost();

    act(() => {
      toast.info('Copied to clipboard');
    });

    const closeButton = await screen.findByLabelText('Close notification');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Copied to clipboard')).not.toBeInTheDocument();
    });
  });

  it('runs an action without closing the toast', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    renderToastHost();

    act(() => {
      toast.show({
        title: 'Task deleted',
        action: { label: 'Undo', onClick: onUndo },
      });
    });

    await user.click(await screen.findByRole('button', { name: 'Undo' }));

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Task deleted')).toBeInTheDocument();
  });

  it('updates a toast in place by id', async () => {
    renderToastHost();
    let id = '';

    act(() => {
      id = toast.loading('Uploading…');
    });

    expect(await screen.findByText('Uploading…')).toBeInTheDocument();

    act(() => {
      toast.update(id, { title: 'Uploaded', type: 'success' });
    });

    expect(await screen.findByText('Uploaded')).toBeInTheDocument();
    expect(screen.queryByText('Uploading…')).not.toBeInTheDocument();
  });

  it('tracks a promise from loading to success', async () => {
    renderToastHost();
    let resolveUpload: (value: string) => void = () => {};
    const upload = new Promise<string>((resolve) => {
      resolveUpload = resolve;
    });

    let tracked: Promise<string> | undefined;
    act(() => {
      tracked = toast.promise(upload, {
        loading: 'Uploading…',
        success: 'Upload complete',
        error: 'Upload failed',
      });
    });

    expect(await screen.findByText('Uploading…')).toBeInTheDocument();

    await act(async () => {
      resolveUpload('done');
      await tracked;
    });

    expect(await screen.findByText('Upload complete')).toBeInTheDocument();
  });

  it('marks toasts beyond the limit as limited', async () => {
    renderToastHost({ limit: 1 });

    act(() => {
      toast.info('First');
      toast.info('Second');
    });

    expect(await screen.findByText('Second')).toBeInTheDocument();

    const first = screen.getByText('First').closest('[data-limited]');
    expect(first).not.toBeNull();
  });

  it('dismisses every toast at once', async () => {
    renderToastHost();

    act(() => {
      toast.info('One');
      toast.info('Two');
    });

    expect(await screen.findByText('One')).toBeInTheDocument();

    act(() => {
      toast.dismissAll();
    });

    await waitFor(() => {
      expect(screen.queryByText('One')).not.toBeInTheDocument();
      expect(screen.queryByText('Two')).not.toBeInTheDocument();
    });
  });

  it('defaults to bottom-right and applies the requested position', () => {
    const { unmount } = render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>,
    );

    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveAttribute(
      'data-position',
      'bottom-right',
    );

    unmount();

    renderToastHost({ position: 'bottom-left' });

    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveAttribute(
      'data-position',
      'bottom-left',
    );
  });

  it('supports custom toast rendering', async () => {
    render(
      <ToastProvider>
        <ToastViewport>
          {(toastObject) => (
            <Toast toast={toastObject} data-testid="custom-toast">
              <ToastContent>
                <ToastTitle />
                <ToastDescription />
              </ToastContent>
            </Toast>
          )}
        </ToastViewport>
      </ToastProvider>,
    );

    act(() => {
      toast.info('Custom rendering');
    });

    expect(await screen.findByTestId('custom-toast')).toHaveTextContent('Custom rendering');
  });

  it('isolates a provider that uses its own manager', async () => {
    const scoped = createToast();

    render(
      <ToastProvider toastManager={scoped.manager}>
        <ToastViewport />
      </ToastProvider>,
    );

    act(() => {
      scoped.toast.success('Scoped toast');
      toast.info('Global toast');
    });

    expect(await screen.findByText('Scoped toast')).toBeInTheDocument();
    expect(screen.queryByText('Global toast')).not.toBeInTheDocument();
  });
});
