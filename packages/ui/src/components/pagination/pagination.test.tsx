import { createRef } from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  getPaginationRange,
} from './pagination';

describe('getPaginationRange', () => {
  it('renders every page when the total fits', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('returns nothing for an empty collection', () => {
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it('keeps the start of the list anchored on early pages', () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 20]);
  });

  it('keeps the end of the list anchored on late pages', () => {
    expect(getPaginationRange(20, 20)).toEqual([1, 'start-ellipsis', 16, 17, 18, 19, 20]);
  });

  it('surrounds the current page in the middle', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, 'start-ellipsis', 9, 10, 11, 'end-ellipsis', 20]);
  });

  it('honours siblingCount', () => {
    expect(getPaginationRange(10, 20, 2)).toEqual([
      1,
      'start-ellipsis',
      8,
      9,
      10,
      11,
      12,
      'end-ellipsis',
      20,
    ]);
  });

  it('clamps an out-of-range page', () => {
    expect(getPaginationRange(99, 20)).toEqual(getPaginationRange(20, 20));
    expect(getPaginationRange(-4, 20)).toEqual(getPaginationRange(1, 20));
  });
});

describe('Pagination', () => {
  it('renders a labelled navigation with the current page marked', () => {
    render(<Pagination page={2} totalPages={5} onPageChange={() => {}} />);

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(within(nav).getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('button', { name: '1' })).not.toHaveAttribute('aria-current');
  });

  it('calls onPageChange with the requested page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '4' }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('does not report the page it is already on', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '3' }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('disables the step in the direction the list cannot go', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    const { rerender } = render(
      <Pagination page={1} totalPages={5} onPageChange={onPageChange} />,
    );

    const previous = screen.getByRole('button', { name: 'Previous page' });
    expect(previous).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    rerender(<Pagination page={5} totalPages={5} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
  });

  it('clamps a page outside the range', () => {
    render(<Pagination page={99} totalPages={4} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: '4' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('renders nothing for an empty collection', () => {
    const { container } = render(<Pagination page={1} totalPages={0} onPageChange={() => {}} />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('collapses long ranges into non-interactive ellipses', () => {
    render(<Pagination page={10} totalPages={20} onPageChange={() => {}} />);

    expect(screen.getAllByText('More pages')).toHaveLength(2);

    for (const dots of screen.getAllByText('…')) {
      expect(dots).toHaveAttribute('aria-hidden', 'true');
    }

    expect(screen.queryByRole('button', { name: 'More pages' })).not.toBeInTheDocument();
  });

  it('adds first and last jumps when requested', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination page={10} totalPages={20} showFirstLast onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).toHaveBeenCalledWith(20);

    await user.click(screen.getByRole('button', { name: 'First page' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables every control when disabled', () => {
    render(<Pagination page={5} totalPages={20} disabled onPageChange={() => {}} />);

    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
  });

  it('applies the size and forwards attributes and refs', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Pagination
        ref={ref}
        page={1}
        totalPages={3}
        size="lg"
        className="custom"
        aria-describedby="hint"
        onPageChange={() => {}}
      />,
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-size', 'lg');
    expect(nav).toHaveClass('custom');
    expect(nav).toHaveAttribute('aria-describedby', 'hint');
    expect(ref.current).toBe(nav);
  });

  it('renders custom composition through the parts', () => {
    render(
      <Pagination page={1} totalPages={3} onPageChange={() => {}} label="Results pages">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink page={1} isActive>
              First
            </PaginationLink>
          </PaginationItem>
          <PaginationEllipsis />
        </PaginationContent>
      </Pagination>,
    );

    const nav = screen.getByRole('navigation', { name: 'Results pages' });
    expect(within(nav).getByRole('button', { name: 'First' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
  });
});
