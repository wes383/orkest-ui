import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { Inbox } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from './empty-state';

describe('EmptyState', () => {
  it('renders the shorthand content', () => {
    render(
      <EmptyState
        title="No invoices"
        description="Invoices appear here once a customer is billed."
        icon={Inbox}
        action={<button type="button">Create invoice</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'No invoices' })).toBeInTheDocument();
    expect(
      screen.getByText('Invoices appear here once a customer is billed.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create invoice' })).toBeInTheDocument();
  });

  it('renders only what it is given', () => {
    render(<EmptyState title="Nothing here" />);

    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
    expect(document.querySelector('svg')).toBeNull();
  });

  it('keeps the icon decorative', () => {
    const { container } = render(<EmptyState icon={Inbox} title="No invoices" />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('prefers the illustration over the icon', () => {
    const { container } = render(
      <EmptyState
        icon={Inbox}
        image={{ src: '/empty.png', alt: 'An empty mailbox' }}
        title="No invoices"
      />,
    );

    expect(screen.getByRole('img', { name: 'An empty mailbox' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('omits the action area when there is nothing to do', () => {
    render(<EmptyState title="No invoices" description="Nothing to do yet." />);

    expect(screen.getByText('Nothing to do yet.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies the default size and alignment', () => {
    const { container } = render(<EmptyState title="Empty" />);
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-align', 'center');
  });

  it('applies the requested size and alignment', () => {
    const { container } = render(<EmptyState size="lg" align="start" title="Empty" />);
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('data-size', 'lg');
    expect(root).toHaveAttribute('data-align', 'start');
  });

  it('renders custom composition instead of the shorthand', () => {
    render(
      <EmptyState>
        <EmptyStateIcon icon={Inbox} />
        <EmptyStateTitle level={2}>Custom heading</EmptyStateTitle>
        <EmptyStateDescription>Composed by hand.</EmptyStateDescription>
        <EmptyStateAction>
          <button type="button">Retry</button>
        </EmptyStateAction>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Custom heading' })).toBeInTheDocument();
    expect(screen.getByText('Composed by hand.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('sets the heading level through the title part', () => {
    render(
      <EmptyState>
        <EmptyStateTitle level={4}>Fourth level</EmptyStateTitle>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { level: 4, name: 'Fourth level' })).toBeInTheDocument();
  });

  it('lets a composition repeat titles, descriptions, and actions', () => {
    render(
      <EmptyState align="start">
        <EmptyStateTitle>First run</EmptyStateTitle>
        <EmptyStateDescription>Invite your team to get started.</EmptyStateDescription>
        <EmptyStateDescription>You can also import an existing list.</EmptyStateDescription>
        <EmptyStateAction>
          <button type="button">Invite</button>
          <button type="button">Import</button>
        </EmptyStateAction>
        <EmptyStateAction>
          <button type="button">Read the guide</button>
        </EmptyStateAction>
      </EmptyState>,
    );

    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByText('You can also import an existing list.')).toBeInTheDocument();
  });

  it('accepts a custom visual instead of a Lucide icon', () => {
    const { container } = render(
      <EmptyState>
        <EmptyStateIcon>
          <img src="/illustration.svg" alt="" />
        </EmptyStateIcon>
        <EmptyStateTitle level={2}>No results</EmptyStateTitle>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'No results' })).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', '/illustration.svg');
    expect(container.querySelector('svg')).toBeNull();
  });

  it('forwards class names and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(<EmptyState ref={ref} className="custom" title="Empty" id="empty" />);

    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('id', 'empty');
  });

  it('forwards class names and refs through the parts', () => {
    const titleRef = createRef<HTMLHeadingElement>();

    render(
      <EmptyState>
        <EmptyStateIcon className="visual" />
        <EmptyStateTitle ref={titleRef} className="heading">
          Empty
        </EmptyStateTitle>
        <EmptyStateDescription className="copy">Nothing here.</EmptyStateDescription>
        <EmptyStateAction className="controls">Actions</EmptyStateAction>
      </EmptyState>,
    );

    expect(titleRef.current).toHaveClass('heading');
    expect(document.querySelector('.visual')).toBeInTheDocument();
    expect(document.querySelector('.copy')).toBeInTheDocument();
    expect(document.querySelector('.controls')).toHaveTextContent('Actions');
  });
});
