import { createRef, type ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

function ExampleToggleGroup(props: Partial<ComponentProps<typeof ToggleGroup>> = {}) {
  return (
    <ToggleGroup aria-label="Text alignment" {...props}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}

describe('ToggleGroup', () => {
  it('renders a group and selects one item at a time by default', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<ExampleToggleGroup onValueChange={onValueChange} />);

    const group = screen.getByRole('group', { name: 'Text alignment' });
    const left = screen.getByRole('button', { name: 'Left' });
    const center = screen.getByRole('button', { name: 'Center' });

    expect(group).toHaveAttribute('data-variant', 'ghost');
    expect(group).toHaveAttribute('data-size', 'md');
    expect(left).toHaveAttribute('aria-pressed', 'false');

    await user.click(left);

    expect(left).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(
      ['left'],
      expect.objectContaining({ reason: 'none' }),
    );

    await user.click(center);

    expect(center).toHaveAttribute('aria-pressed', 'true');
    expect(left).toHaveAttribute('aria-pressed', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith(
      ['center'],
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('toggles items independently in multiple mode', async () => {
    const user = userEvent.setup();

    render(<ExampleToggleGroup multiple defaultValue={['left']} />);

    const left = screen.getByRole('button', { name: 'Left' });
    const center = screen.getByRole('button', { name: 'Center' });

    await user.click(center);

    expect(left).toHaveAttribute('aria-pressed', 'true');
    expect(center).toHaveAttribute('aria-pressed', 'true');

    await user.click(left);

    expect(left).toHaveAttribute('aria-pressed', 'false');
    expect(center).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps the controlled value until the parent updates it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<ExampleToggleGroup value={['left']} onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Center' }));

    expect(onValueChange).toHaveBeenCalledWith(
      ['center'],
      expect.objectContaining({ reason: 'none' }),
    );
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('disables the whole group', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<ExampleToggleGroup disabled onValueChange={onValueChange} />);

    const group = screen.getByRole('group', { name: 'Text alignment' });
    const left = screen.getByRole('button', { name: 'Left' });

    expect(group).toHaveAttribute('data-disabled');
    expect(left).toBeDisabled();

    await user.click(left);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(left).toHaveAttribute('aria-pressed', 'false');
  });

  it('disables a single item', async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup aria-label="Text alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center" disabled>
          Center
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const center = screen.getByRole('button', { name: 'Center' });

    expect(center).toBeDisabled();
    expect(center).toHaveAttribute('data-disabled');

    await user.click(center);

    expect(center).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves focus with arrow keys', async () => {
    const user = userEvent.setup();

    render(<ExampleToggleGroup defaultValue={['left']} />);

    const left = screen.getByRole('button', { name: 'Left' });
    const center = screen.getByRole('button', { name: 'Center' });

    left.focus();
    await user.keyboard('{ArrowRight}');
    expect(center).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(left).toHaveFocus();
  });

  it('moves focus with vertical arrow keys', async () => {
    const user = userEvent.setup();

    render(<ExampleToggleGroup defaultValue={['left']} orientation="vertical" />);

    const left = screen.getByRole('button', { name: 'Left' });
    const center = screen.getByRole('button', { name: 'Center' });

    left.focus();
    await user.keyboard('{ArrowDown}');
    expect(center).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(left).toHaveFocus();
  });

  it('exposes size, variant, and orientation', () => {
    render(<ExampleToggleGroup size="lg" variant="outline" orientation="vertical" />);

    const group = screen.getByRole('group', { name: 'Text alignment' });

    expect(group).toHaveAttribute('data-size', 'lg');
    expect(group).toHaveAttribute('data-variant', 'outline');
    expect(group).toHaveAttribute('data-orientation', 'vertical');
  });

  it('forwards class names and refs', () => {
    const groupRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();

    render(
      <ToggleGroup ref={groupRef} className="custom-group" aria-label="Text alignment">
        <ToggleGroupItem ref={itemRef} className="custom-item" value="left">
          Left
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(groupRef.current).toBe(screen.getByRole('group', { name: 'Text alignment' }));
    expect(groupRef.current).toHaveClass('custom-group');
    expect(itemRef.current).toBe(screen.getByRole('button', { name: 'Left' }));
    expect(itemRef.current).toHaveClass('custom-item');
  });
});
