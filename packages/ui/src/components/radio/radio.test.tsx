import { createRef, type ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Radio, RadioGroup } from './radio';

describe('RadioGroup', () => {
  function renderGroup(props: Partial<ComponentProps<typeof RadioGroup>> = {}) {
    return render(
      <RadioGroup aria-label="Plan" {...props}>
        <Radio label="Basic" value="basic" />
        <Radio label="Pro" value="pro" />
        <Radio label="Enterprise" value="enterprise" />
      </RadioGroup>,
    );
  }

  it('renders a radiogroup and selects a default value', () => {
    renderGroup({ defaultValue: 'pro' });

    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Basic' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('selects one option and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderGroup({ defaultValue: 'basic', onValueChange });

    await user.click(screen.getByText('Pro'));

    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Basic' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('supports arrow-key selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderGroup({ defaultValue: 'basic', onValueChange });

    await user.click(screen.getByText('Basic'));
    await user.keyboard('{ArrowDown}');

    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('shares a single generated name across the group', () => {
    const { container } = renderGroup();

    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    );
    expect(inputs).toHaveLength(3);

    const names = new Set(inputs.map((input) => input.getAttribute('name')));
    expect(names.size).toBe(1);
  });

  it('supports controlled values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderGroup({ value: 'basic', onValueChange });

    await user.click(screen.getByText('Enterprise'));

    expect(onValueChange).toHaveBeenCalledWith('enterprise');
    expect(screen.getByRole('radio', { name: 'Basic' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('propagates disabled, required, orientation, and size', () => {
    renderGroup({
      disabled: true,
      required: true,
      orientation: 'horizontal',
      size: 'lg',
    });

    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(group).toHaveAttribute('aria-required', 'true');
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(group).toHaveAttribute('data-orientation', 'horizontal');

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('aria-disabled', 'true');
      expect(radio.closest('label')).toHaveAttribute('data-size', 'lg');
    }
  });

  it('forwards group refs and attributes', () => {
    const ref = createRef<HTMLDivElement>();

    renderGroup({ ref, id: 'plan-group', className: 'custom' });

    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute('id', 'plan-group');
    expect(group).toHaveClass('custom');
  });

  it('forwards radio refs and hidden input attributes', () => {
    const ref = createRef<HTMLElement>();
    const inputRef = createRef<HTMLInputElement>();

    render(
      <RadioGroup aria-label="Plan">
        <Radio
          ref={ref}
          inputRef={inputRef}
          label="Pro"
          value="pro"
          aria-describedby="plan-help"
        />
      </RadioGroup>,
    );

    const radio = screen.getByRole('radio', { name: 'Pro' });
    expect(ref.current).toBe(radio);
    expect(inputRef.current).toHaveAttribute('value', 'pro');
    expect(radio).toHaveAttribute('aria-describedby', 'plan-help');
  });
});
