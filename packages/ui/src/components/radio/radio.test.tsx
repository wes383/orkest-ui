import { createRef, type ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Radio, RadioGroup } from './radio';

describe('Radio', () => {
  it('renders a labelled native radio', () => {
    render(<Radio label="Basic" name="plan" value="basic" />);

    const radio = screen.getByRole('radio', { name: 'Basic' });
    expect(radio).not.toBeChecked();
    expect(radio).toHaveAttribute('name', 'plan');
    expect(radio).toHaveAttribute('value', 'basic');
  });

  it('supports defaultChecked and onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Radio label="Pro" name="plan" value="pro" defaultChecked onChange={onChange} />);

    const radio = screen.getByRole('radio', { name: 'Pro' });
    expect(radio).toBeChecked();

    await user.click(screen.getByText('Pro'));
    expect(onChange).not.toHaveBeenCalled();
    expect(radio).toBeChecked();
  });

  it('forwards refs and native attributes', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Radio
        ref={ref}
        label="Enterprise"
        name="plan"
        value="enterprise"
        required
        disabled
        aria-describedby="plan-help"
      />,
    );

    const radio = screen.getByRole('radio', { name: 'Enterprise' });
    expect(ref.current).toBe(radio);
    expect(radio).toBeRequired();
    expect(radio).toBeDisabled();
    expect(radio).toHaveAttribute('aria-describedby', 'plan-help');
  });
});

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

    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Basic' })).not.toBeChecked();
  });

  it('selects one option and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderGroup({ defaultValue: 'basic', onValueChange });

    await user.click(screen.getByText('Pro'));

    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Basic' })).not.toBeChecked();
  });

  it('shares a single generated name across the group', () => {
    renderGroup();

    const radios = screen.getAllByRole('radio');
    const names = new Set(radios.map((radio) => radio.getAttribute('name')));
    expect(names.size).toBe(1);
  });

  it('supports controlled values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderGroup({ value: 'basic', onValueChange });

    await user.click(screen.getByText('Enterprise'));

    expect(onValueChange).toHaveBeenCalledWith('enterprise');
    expect(screen.getByRole('radio', { name: 'Basic' })).toBeChecked();
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
      expect(radio).toBeDisabled();
      expect(radio).toBeRequired();
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
});
