import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MultiSelect } from './multi-select';
import type { SelectItem } from './select-types';

const options: SelectItem[] = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product', disabled: true },
];

async function openMultiSelect(name = 'Teams') {
  const user = userEvent.setup();
  const combobox = screen.getByRole('combobox', { name });

  await user.click(combobox);
  return { user, combobox };
}

describe('MultiSelect', () => {
  it('renders selected values as removable tags', () => {
    render(
      <MultiSelect
        aria-label="Teams"
        options={options}
        defaultValue={['design', 'engineering']}
      />,
    );

    expect(screen.getByRole('button', { name: 'Remove Design' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove Engineering' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Teams' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('opens a multi-selectable listbox and toggles values', async () => {
    const onChange = vi.fn();

    render(
      <MultiSelect aria-label="Teams" options={options} onChange={onChange} />,
    );

    const { user, combobox } = await openMultiSelect();
    const listbox = screen.getByRole('listbox');

    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('option', { name: 'Design' }));

    expect(onChange).toHaveBeenCalledWith(
      ['design'],
      [expect.objectContaining({ value: 'design' })],
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Design' })).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Design' }));

    expect(onChange).toHaveBeenLastCalledWith([], []);
    expect(
      screen.queryByRole('button', { name: 'Remove Design' }),
    ).not.toBeInTheDocument();
  });

  it('removes a single value and clears all values', async () => {
    const onChange = vi.fn();

    render(
      <MultiSelect
        aria-label="Teams"
        options={options}
        defaultValue={['design', 'engineering']}
        clearable
        onChange={onChange}
      />,
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Remove Design' }));

    expect(onChange).toHaveBeenCalledWith(
      ['engineering'],
      [expect.objectContaining({ value: 'engineering' })],
    );
    expect(
      screen.queryByRole('button', { name: 'Remove Design' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(onChange).toHaveBeenLastCalledWith([], []);
    expect(
      screen.queryByRole('button', { name: 'Remove Engineering' }),
    ).not.toBeInTheDocument();
  });

  it('enforces maxSelected', async () => {
    const onChange = vi.fn();

    render(
      <MultiSelect
        aria-label="Teams"
        options={options}
        defaultValue={['design']}
        maxSelected={1}
        onChange={onChange}
      />,
    );

    const { user } = await openMultiSelect();
    const engineering = screen.getByRole('option', { name: 'Engineering' });

    expect(engineering).toHaveAttribute('aria-disabled', 'true');
    await user.click(engineering);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('hides selected options when hideSelected is set', async () => {
    render(
      <MultiSelect
        aria-label="Teams"
        options={options}
        defaultValue={['design']}
        hideSelected
      />,
    );

    await openMultiSelect();

    expect(screen.queryByRole('option', { name: 'Design' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Engineering' })).toBeInTheDocument();
  });

  it('supports a custom value renderer', async () => {
    const onChange = vi.fn();

    render(
      <MultiSelect
        aria-label="Teams"
        options={options}
        defaultValue={['design', 'engineering']}
        onChange={onChange}
        renderValue={(selected, remove) => (
          <button type="button" onClick={() => remove('design')}>
            {selected.length} selected
          </button>
        )}
      />,
    );

    const user = userEvent.setup();

    expect(screen.getByRole('button', { name: '2 selected' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '2 selected' }));

    expect(onChange).toHaveBeenCalledWith(
      ['engineering'],
      [expect.objectContaining({ value: 'engineering' })],
    );
    expect(screen.getByRole('button', { name: '1 selected' })).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard toggling with Space and Enter', async () => {
    const onChange = vi.fn();

    render(
      <MultiSelect aria-label="Teams" options={options} onChange={onChange} />,
    );

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Teams' });
    combobox.focus();

    await user.keyboard(' ');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(
      ['design'],
      [expect.objectContaining({ value: 'design' })],
    );

    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(
      ['design', 'engineering'],
      [
        expect.objectContaining({ value: 'design' }),
        expect.objectContaining({ value: 'engineering' }),
      ],
    );

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(combobox).toHaveFocus();
  });

  it('searches options when searchable', async () => {
    const onSearchChange = vi.fn();

    render(
      <MultiSelect
        aria-label="Teams"
        options={options}
        searchable
        onSearchChange={onSearchChange}
      />,
    );

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Teams' });

    await user.click(combobox);
    await user.type(combobox, 'eng');

    expect(screen.getByRole('option', { name: 'Engineering' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Design' })).not.toBeInTheDocument();
    expect(onSearchChange).toHaveBeenLastCalledWith('eng');

    await user.click(screen.getByRole('option', { name: 'Engineering' }));

    expect(
      screen.getByRole('button', { name: 'Remove Engineering' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('does not select disabled options', async () => {
    const onChange = vi.fn();

    render(
      <MultiSelect aria-label="Teams" options={options} onChange={onChange} />,
    );

    const { user } = await openMultiSelect();
    const product = screen.getByRole('option', { name: 'Product' });

    expect(product).toHaveAttribute('aria-disabled', 'true');
    await user.click(product);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards ids, refs, sizes, and form attributes', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <MultiSelect
        ref={ref}
        id="teams-select"
        aria-label="Teams"
        options={options}
        defaultValue={['design', 'engineering']}
        name="teams"
        required
        invalid
        aria-describedby="teams-help"
        size="lg"
      />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Teams' });
    expect(ref.current).toBe(combobox);
    expect(combobox).toHaveAttribute('id', 'teams-select');
    expect(combobox).toHaveAttribute('aria-required', 'true');
    expect(combobox).toHaveAttribute('aria-invalid', 'true');
    expect(combobox).toHaveAttribute('aria-describedby', 'teams-help');

    const hidden = container.querySelectorAll<HTMLInputElement>('input[name="teams"]');
    expect(Array.from(hidden, (input) => input.value)).toEqual([
      'design',
      'engineering',
    ]);
    expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    render(<MultiSelect aria-label="Teams" options={options} disabled />);

    const combobox = screen.getByRole('combobox', { name: 'Teams' });
    expect(combobox).toBeDisabled();

    await userEvent.setup().click(combobox);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
