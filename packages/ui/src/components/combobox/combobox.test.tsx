import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Combobox } from './combobox';
import type { SelectItem } from '../select/select-types';

const options: SelectItem[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
];

const grouped: SelectItem[] = [
  {
    label: 'Fruit',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [{ value: 'carrot', label: 'Carrot' }],
  },
];

describe('Combobox', () => {
  it('shows the placeholder until a value is picked', () => {
    render(<Combobox aria-label="Fruit" options={options} placeholder="Pick a fruit" />);

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveAttribute(
      'placeholder',
      'Pick a fruit',
    );
  });

  it('filters the options as the user types', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <Combobox aria-label="Fruit" options={options} onSearchChange={onSearchChange} />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(combobox);
    await user.type(combobox, 'ap');

    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apricot' })).toBeInTheDocument();
    expect(onSearchChange).toHaveBeenLastCalledWith('ap');
  });

  it('commits the clicked option and writes it back into the field', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Combobox aria-label="Fruit" options={options} onChange={onChange} />);

    const combobox = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Banana' }));

    expect(onChange).toHaveBeenCalledWith(
      'banana',
      expect.objectContaining({ value: 'banana', label: 'Banana' }),
    );
    expect(combobox).toHaveValue('Banana');
  });

  it('selects the highlighted option with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Combobox aria-label="Fruit" options={options} onChange={onChange} />);

    const combobox = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(combobox);
    await user.type(combobox, 'apr');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith(
      'apricot',
      expect.objectContaining({ value: 'apricot' }),
    );
  });

  it('shows a controlled value and skips the internal state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Combobox
        aria-label="Fruit"
        options={options}
        value="apricot"
        onChange={onChange}
      />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Fruit' });

    expect(combobox).toHaveValue('Apricot');

    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Banana' }));

    expect(onChange).toHaveBeenCalledWith('banana', expect.anything());
    expect(combobox).toHaveValue('Apricot');
  });

  it('clears the selection from the field action', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Combobox
        aria-label="Fruit"
        options={options}
        value="apple"
        clearable
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(onChange).toHaveBeenCalledWith(null, undefined);
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveValue('');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();

    render(<Combobox aria-label="Fruit" options={options} disabled />);

    const combobox = screen.getByRole('combobox', { name: 'Fruit' });

    expect(combobox).toBeDisabled();
    await user.click(combobox);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not select a disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Combobox aria-label="Fruit" options={options} onChange={onChange} />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    await user.click(screen.getByRole('option', { name: 'Cherry' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders group labels', async () => {
    const user = userEvent.setup();

    render(<Combobox aria-label="Produce" options={grouped} />);

    await user.click(screen.getByRole('combobox', { name: 'Produce' }));

    expect(screen.getByRole('group', { name: 'Fruit' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Vegetables' })).toBeInTheDocument();

    const fruit = screen.getByRole('group', { name: 'Fruit' });

    expect(within(fruit).getAllByRole('option')).toHaveLength(2);
  });

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup();

    render(
      <Combobox aria-label="Fruit" options={options} emptyMessage="Nothing matched" />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(combobox);
    await user.type(combobox, 'zzz');

    expect(screen.getByText('Nothing matched')).toBeInTheDocument();
  });

  it('marks the list busy while loading', async () => {
    const user = userEvent.setup();

    render(<Combobox aria-label="Fruit" options={[]} loading />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    // Base UI appends a zero-width marker to the first render of a live region.
    expect(screen.getByText(/Loading options…/)).toBeInTheDocument();
  });

  it('does not show the previous rows while a query is loading', async () => {
    const user = userEvent.setup();

    render(<Combobox aria-label="Fruit" options={options} loading />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    expect(screen.getByText(/Loading options…/)).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('leaves filtering to the caller when filterOption is null', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <Combobox
        aria-label="Fruit"
        options={options}
        filterOption={null}
        onSearchChange={onSearchChange}
      />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(combobox);
    await user.type(combobox, 'zzz');

    // A server search already narrowed the rows, so nothing is filtered again.
    expect(screen.getAllByRole('option')).toHaveLength(4);
    expect(onSearchChange).toHaveBeenLastCalledWith('zzz');
  });

  it('renders custom option content', async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        aria-label="Fruit"
        options={options}
        renderItem={(option) => (
          <span>
            {option.label} <em>custom</em>
          </span>
        )}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    expect(screen.getByRole('option', { name: 'Apple custom' })).toBeInTheDocument();
  });

  it('submits the selected value through a hidden input', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Combobox aria-label="Fruit" options={options} name="fruit" required />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(screen.getByRole('option', { name: 'Apple' }));

    const hidden = container.querySelector<HTMLInputElement>('input[name="fruit"]');

    expect(hidden?.value).toBe('apple');
    expect(hidden).toBeRequired();
  });
});
