import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Text } from './text';

describe('Text', () => {
  it('renders a span with the default text style', () => {
    render(<Text>Body copy</Text>);

    const text = screen.getByText('Body copy');
    expect(text.tagName).toBe('SPAN');
    expect(text).toHaveAttribute('data-size', 'md');
    expect(text).toHaveAttribute('data-weight', 'regular');
    expect(text).toHaveAttribute('data-tone', 'default');
    expect(text).toHaveAttribute('data-align', 'start');
    expect(text).toHaveAttribute('data-font', 'sans');
    expect(text).not.toHaveAttribute('data-truncate');
  });

  it('renders the element requested through as', () => {
    render(<Text as="p">Paragraph</Text>);

    expect(screen.getByText('Paragraph').tagName).toBe('P');
  });

  it('applies variant props as observable attributes', () => {
    render(
      <Text size="xl" weight="semibold" tone="danger" align="center" truncate>
        Alert
      </Text>,
    );

    const text = screen.getByText('Alert');
    expect(text).toHaveAttribute('data-size', 'xl');
    expect(text).toHaveAttribute('data-weight', 'semibold');
    expect(text).toHaveAttribute('data-tone', 'danger');
    expect(text).toHaveAttribute('data-align', 'center');
    expect(text).toHaveAttribute('data-truncate', 'true');
  });

  it('forwards native attributes and custom class names', () => {
    render(
      <Text as="p" id="copy" className="custom" title="Tooltip">
        Content
      </Text>,
    );

    const text = screen.getByText('Content');
    expect(text).toHaveAttribute('id', 'copy');
    expect(text).toHaveAttribute('title', 'Tooltip');
    expect(text).toHaveClass('custom');
  });

  it('supports display, monospace, and numeric font families', () => {
    const { rerender } = render(<Text font="display">Display</Text>);
    expect(screen.getByText('Display')).toHaveAttribute('data-font', 'display');

    rerender(<Text font="mono">Code</Text>);
    expect(screen.getByText('Code')).toHaveAttribute('data-font', 'mono');

    rerender(<Text font="numeric">1,248.50</Text>);
    expect(screen.getByText('1,248.50')).toHaveAttribute('data-font', 'numeric');
  });
});
