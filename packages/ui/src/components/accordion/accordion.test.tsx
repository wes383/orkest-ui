import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from './accordion';

function renderAccordion(props: Partial<ComponentProps<typeof Accordion>> = {}) {
  render(
    <Accordion {...props}>
      <AccordionItem value="account">
        <AccordionTrigger>Account</AccordionTrigger>
        <AccordionPanel>Account settings</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionPanel>Billing settings</AccordionPanel>
      </AccordionItem>
    </Accordion>,
  );

  return {
    account: screen.getByRole('button', { name: 'Account' }),
    billing: screen.getByRole('button', { name: 'Billing' }),
  };
}

describe('Accordion', () => {
  it('renders collapsed triggers inside headings', () => {
    const { account, billing } = renderAccordion();

    expect(account).toHaveAttribute('aria-expanded', 'false');
    expect(billing).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('heading', { level: 3, name: 'Account' })).toBeInTheDocument();
    expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
  });

  it('opens a panel from its trigger and closes it again', async () => {
    const user = userEvent.setup();
    const { account } = renderAccordion();

    await user.click(account);

    expect(await screen.findByText('Account settings')).toBeInTheDocument();
    expect(account).toHaveAttribute('aria-expanded', 'true');

    await user.click(account);

    await waitFor(() => {
      expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
    });
  });

  it('keeps only one item open without multiple', async () => {
    const user = userEvent.setup();
    const { account, billing } = renderAccordion();

    await user.click(account);
    expect(await screen.findByText('Account settings')).toBeInTheDocument();

    await user.click(billing);
    expect(await screen.findByText('Billing settings')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
    });
    expect(account).toHaveAttribute('aria-expanded', 'false');
    expect(billing).toHaveAttribute('aria-expanded', 'true');
  });

  it('allows several open items with multiple', async () => {
    const user = userEvent.setup();
    const { account, billing } = renderAccordion({ multiple: true });

    await user.click(account);
    await user.click(billing);

    expect(await screen.findByText('Account settings')).toBeInTheDocument();
    expect(await screen.findByText('Billing settings')).toBeInTheDocument();
  });

  it('opens the defaultValue items on mount', async () => {
    renderAccordion({ defaultValue: ['billing'] });

    expect(await screen.findByText('Billing settings')).toBeInTheDocument();
    expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
  });

  it('reports changes without opening when controlled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { billing } = renderAccordion({ value: ['account'], onValueChange });

    expect(await screen.findByText('Account settings')).toBeInTheDocument();

    await user.click(billing);

    expect(onValueChange).toHaveBeenCalledWith(['billing'], expect.anything());
    expect(screen.getByText('Account settings')).toBeInTheDocument();
    expect(screen.queryByText('Billing settings')).not.toBeInTheDocument();
  });

  it('ignores interactions when the root is disabled', async () => {
    const user = userEvent.setup();
    const { account } = renderAccordion({ disabled: true });

    await user.click(account);

    expect(account).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
  });

  it('ignores interactions on a disabled item', async () => {
    const user = userEvent.setup();

    render(
      <Accordion>
        <AccordionItem value="account" disabled>
          <AccordionTrigger>Account</AccordionTrigger>
          <AccordionPanel>Account settings</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: 'Account' });
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
  });

  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup();
    const { account } = renderAccordion();

    account.focus();
    await user.keyboard('{Enter}');
    expect(await screen.findByText('Account settings')).toBeInTheDocument();

    await user.keyboard(' ');
    await waitFor(() => {
      expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
    });
  });

  it('renders a custom icon and hides it on request', () => {
    const { unmount } = render(
      <Accordion>
        <AccordionItem value="account">
          <AccordionTrigger icon={Plus}>Account</AccordionTrigger>
          <AccordionPanel>Account settings</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: 'Account' }).querySelector('svg')).not.toBeNull();
    unmount();

    render(
      <Accordion>
        <AccordionItem value="account">
          <AccordionTrigger icon={null}>Account</AccordionTrigger>
          <AccordionPanel>Account settings</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: 'Account' }).querySelector('svg')).toBeNull();
  });
});
