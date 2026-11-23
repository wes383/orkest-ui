import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from './breadcrumb';
import { BreadcrumbEllipsisMenu } from './breadcrumb-ellipsis-menu';

describe('BreadcrumbEllipsisMenu', () => {
  it('opens a menu with link items', async () => {
    const user = userEvent.setup();

    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsisMenu
              items={[
                { label: 'Docs', href: '/docs' },
                { label: 'Components', href: '/docs/components' },
              ]}
            />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    await user.click(screen.getByRole('button', { name: 'More' }));

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('menuitem', { name: 'Components' })).toHaveAttribute(
      'href',
      '/docs/components',
    );
  });

  it('runs action items and accepts a custom trigger label', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<BreadcrumbEllipsisMenu label="More pages" items={[{ label: 'Archive', onSelect }]} />);

    await user.click(screen.getByRole('button', { name: 'More pages' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Archive' }));

    expect(onSelect).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('opens from the keyboard and closes on Escape', async () => {
    const user = userEvent.setup();

    render(<BreadcrumbEllipsisMenu items={[{ label: 'Docs', href: '/docs' }]} />);

    const trigger = screen.getByRole('button', { name: 'More' });
    trigger.focus();
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
