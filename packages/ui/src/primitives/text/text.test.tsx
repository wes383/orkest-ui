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

  it('supports the full size scale including inherit', () => {
    const sizes = [
      '2xs',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      'inherit',
    ] as const;
    const { rerender } = render(<Text size="2xs">Text</Text>);

    for (const size of sizes) {
      rerender(<Text size={size}>Text</Text>);
      expect(screen.getByText('Text')).toHaveAttribute('data-size', size);
    }
  });

  it('supports the bold weight', () => {
    render(<Text weight="bold">Bold</Text>);

    expect(screen.getByText('Bold')).toHaveAttribute('data-weight', 'bold');
  });

  it('applies line height and letter spacing', () => {
    render(
      <Text lineHeight="relaxed" letterSpacing="wide">
        Spaced
      </Text>,
    );

    const text = screen.getByText('Spaced');
    expect(text).toHaveAttribute('data-line-height', 'relaxed');
    expect(text).toHaveAttribute('data-letter-spacing', 'wide');
  });

  it('applies italic and underline', () => {
    render(
      <Text italic underline>
        Emphasis
      </Text>,
    );

    const text = screen.getByText('Emphasis');
    expect(text).toHaveAttribute('data-italic', 'true');
    expect(text).toHaveAttribute('data-underline', 'true');
  });

  it('clamps multiple lines and preserves the caller style', () => {
    render(
      <Text lineClamp={2} truncate style={{ color: 'red' }}>
        Long content
      </Text>,
    );

    const text = screen.getByText('Long content');
    expect(text).toHaveAttribute('data-line-clamp', 'true');
    expect(text).not.toHaveAttribute('data-truncate');
    expect(text.style.getPropertyValue('-webkit-line-clamp')).toBe('2');
    expect(text.style.color).toBe('red');
  });
});
