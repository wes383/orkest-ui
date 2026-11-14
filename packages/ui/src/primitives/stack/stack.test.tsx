import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stack } from './stack';

describe('Stack', () => {
  it('renders a vertical stack with the default gap', () => {
    render(<Stack data-testid="stack" />);

    const stack = screen.getByTestId('stack');
    expect(stack.tagName).toBe('DIV');
    expect(stack).toHaveAttribute('data-direction', 'column');
    expect(stack).toHaveAttribute('data-gap', '2');
    expect(stack).toHaveAttribute('data-align', 'stretch');
    expect(stack).toHaveAttribute('data-justify', 'start');
    expect(stack).not.toHaveAttribute('data-wrap');
  });

  it('maps layout props to data attributes', () => {
    render(
      <Stack data-testid="stack" direction="row" gap={4} align="center" justify="between" wrap />,
    );

    const stack = screen.getByTestId('stack');
    expect(stack).toHaveAttribute('data-direction', 'row');
    expect(stack).toHaveAttribute('data-gap', '4');
    expect(stack).toHaveAttribute('data-align', 'center');
    expect(stack).toHaveAttribute('data-justify', 'between');
    expect(stack).toHaveAttribute('data-wrap', 'true');
  });

  it('renders the element requested through as and preserves semantics', () => {
    render(
      <Stack as="ul" aria-label="Items">
        <li>One</li>
        <li>Two</li>
      </Stack>,
    );

    const list = screen.getByRole('list', { name: 'Items' });
    expect(list.tagName).toBe('UL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('forwards native attributes and custom class names', () => {
    render(<Stack className="custom" data-testid="stack" id="layout" />);

    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass('custom');
    expect(stack).toHaveAttribute('id', 'layout');
  });
});
