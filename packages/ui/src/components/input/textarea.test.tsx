import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Textarea, type TextareaSize } from './textarea';

const sizes: TextareaSize[] = ['sm', 'md', 'lg', 'xl'];

describe('Textarea', () => {
  it('renders a native textarea with the default rows and size', () => {
    const { container } = render(<Textarea placeholder="Message" />);

    const textarea = screen.getByPlaceholderText('Message') as HTMLTextAreaElement;
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '3');
    expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
  });

  it.each(sizes)('applies the %s size to the field', (size) => {
    const { container } = render(<Textarea size={size} placeholder="Message" />);

    expect(container.firstElementChild).toHaveAttribute('data-size', size);
  });

  it('exposes the invalid state', () => {
    const { container } = render(<Textarea invalid placeholder="Message" />);

    expect(container.firstElementChild).toHaveAttribute('data-invalid', 'true');
    expect(screen.getByPlaceholderText('Message')).toHaveAttribute('aria-invalid', 'true');
  });

  it('exposes disabled and read-only states', () => {
    const { container, rerender } = render(<Textarea disabled placeholder="Disabled" />);

    expect(container.firstElementChild).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();

    rerender(<Textarea readOnly placeholder="Read only" />);

    expect(container.firstElementChild).toHaveAttribute('data-read-only', 'true');
    expect((screen.getByPlaceholderText('Read only') as HTMLTextAreaElement).readOnly).toBe(true);
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(
      <Textarea
        ref={ref}
        id="message"
        name="message"
        rows={5}
        className="custom"
        aria-describedby="message-help"
        placeholder="Message"
      />,
    );

    const textarea = screen.getByPlaceholderText('Message') as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute('id', 'message');
    expect(textarea).toHaveAttribute('name', 'message');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('aria-describedby', 'message-help');
    expect(textarea).toHaveClass('custom');
    expect(ref.current).toBe(textarea);
  });

  it('calls onChange while typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Textarea onChange={onChange} placeholder="Type" />);
    await user.type(screen.getByPlaceholderText('Type'), 'abc');

    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
