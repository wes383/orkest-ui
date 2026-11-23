import { createRef } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './select';
import type { SelectItem } from './select-types';

const options: SelectItem[] = [
  { value: 'design', label: 'Design' },
  {
    value: 'engineering',
    label: 'Engineering',
    description: 'Product engineering',
  },
  { value: 'product', label: 'Product', disabled: true },
];

async function openSelect(name = 'Team') {
  const user = userEvent.setup();
  const combobox = screen.getByRole('combobox', { name });

  await user.click(combobox);
  // The popup mounts after the click resolves, so wait for it before querying options.
  await screen.findByRole('listbox');
  return { user, combobox };
}

describe('Select', () => {
  it('renders a closed combobox with a placeholder', () => {
    render(<Select aria-label="Team" options={options} />);

    const combobox = screen.getByRole('combobox', { name: 'Team' });
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
    expect(combobox).toHaveTextContent('Select an option');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the listbox and selects an option', async () => {
    const onChange = vi.fn();

    render(<Select aria-label="Team" options={options} onChange={onChange} />);

    const { user, combobox } = await openSelect();
    const listbox = screen.getByRole('listbox');

    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(within(listbox).getAllByRole('option')).toHaveLength(3);

    await user.click(screen.getByRole('option', { name: /Engineering/ }));

    expect(onChange).toHaveBeenCalledWith(
      'engineering',
      expect.objectContaining({ value: 'engineering' }),
    );
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveTextContent('Engineering');
  });

  it('supports controlled values without changing internally', async () => {
    const onChange = vi.fn();

    render(<Select aria-label="Team" options={options} value="design" onChange={onChange} />);

    const { user, combobox } = await openSelect();

    await user.click(screen.getByRole('option', { name: /Engineering/ }));

    expect(onChange).toHaveBeenCalledWith(
      'engineering',
      expect.objectContaining({ value: 'engineering' }),
    );
    expect(combobox).toHaveTextContent('Design');
  });

  it('selects the default value', () => {
    render(<Select aria-label="Team" options={options} defaultValue="engineering" />);

    expect(screen.getByRole('combobox', { name: 'Team' })).toHaveTextContent('Engineering');
  });

  it('clears the value when clearable', async () => {
    const onChange = vi.fn();

    render(
      <Select
        aria-label="Team"
        options={options}
        defaultValue="design"
        clearable
        onChange={onChange}
      />,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(onChange).toHaveBeenCalledWith(undefined, undefined);
    expect(screen.getByRole('combobox', { name: 'Team' })).toHaveTextContent('Select an option');
    expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
  });

  it('does not select disabled options', async () => {
    const onChange = vi.fn();

    render(<Select aria-label="Team" options={options} onChange={onChange} />);

    const { user } = await openSelect();
    const disabledOption = screen.getByRole('option', { name: 'Product' });

    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    await user.click(disabledOption);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('supports keyboard navigation and selection', async () => {
    const onChange = vi.fn();

    render(
      <Select aria-label="Team" options={options} defaultValue="design" onChange={onChange} />,
    );

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Team' });
    combobox.focus();

    await user.keyboard('{ArrowDown}');
    const listbox = await screen.findByRole('listbox');

    // Opening aligns the highlight with the selected option in an effect, not during the key
    // press. Wait for it so the next arrow key is a navigation step; otherwise it only performs
    // the initial highlight and Enter commits the current value.
    await waitFor(() => {
      expect(within(listbox).getByRole('option', { name: 'Design' })).toHaveAttribute(
        'data-highlighted',
      );
    });

    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith(
      'engineering',
      expect.objectContaining({ value: 'engineering' }),
    );
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens with Space', async () => {
    render(<Select aria-label="Team" options={options} />);

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Team' });
    combobox.focus();

    await user.keyboard(' ');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
  });

  it('closes with Escape and keeps focus on the trigger', async () => {
    render(<Select aria-label="Team" options={options} />);

    const { user, combobox } = await openSelect();

    await user.keyboard('{Escape}');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveFocus();
  });

  it('matches option labels with typeahead', async () => {
    render(<Select aria-label="Team" options={options} />);

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Team' });
    combobox.focus();

    await user.keyboard('{ArrowDown}');
    await user.keyboard('e');
    await user.keyboard('{Enter}');

    expect(combobox).toHaveTextContent('Engineering');
  });

  it('filters searchable options case-insensitively', async () => {
    const onSearchChange = vi.fn();

    render(
      <Select aria-label="Team" options={options} searchable onSearchChange={onSearchChange} />,
    );

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Team' });

    await user.click(combobox);
    await user.type(combobox, 'ENG');

    expect(screen.getByRole('option', { name: /Engineering/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Design/ })).not.toBeInTheDocument();
    expect(onSearchChange).toHaveBeenLastCalledWith('ENG');

    await user.click(screen.getByRole('option', { name: /Engineering/ }));

    expect(combobox).toHaveValue('Engineering');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the menu and query when Enter has no matching option', async () => {
    const user = userEvent.setup();

    render(<Select aria-label="Team" options={options} searchable />);

    const combobox = screen.getByRole('combobox', { name: 'Team' });

    await user.click(combobox);
    await user.type(combobox, 'zzz');

    expect(screen.getByText('No options')).toBeInTheDocument();

    await user.keyboard('{Enter}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(combobox).toHaveValue('zzz');
  });

  it('shows an empty state and loading row', async () => {
    const { rerender } = render(<Select aria-label="Team" options={options} searchable />);

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Team' });

    await user.click(combobox);
    await user.type(combobox, 'zzz');

    expect(screen.getByText('No options')).toBeInTheDocument();

    rerender(<Select aria-label="Team" options={options} searchable loading />);

    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByText('Loading options…').length).toBeGreaterThan(0);
    // The rows belong to the previous result set, so they step aside for the
    // loading row instead of sitting underneath it.
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('hides matching rows while a searchable select is loading', async () => {
    render(<Select aria-label="Team" options={options} searchable loading />);

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Team' });

    await user.click(combobox);
    await screen.findByRole('listbox');

    expect(screen.getByText(/Loading options…/)).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('does not select a disabled option while searching', async () => {
    const onChange = vi.fn();

    render(<Select aria-label="Team" options={options} searchable onChange={onChange} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox', { name: 'Team' }));

    const disabledOption = await screen.findByRole('option', { name: 'Product' });

    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');

    await user.click(disabledOption);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports custom filtering and empty messages', async () => {
    render(
      <Select
        aria-label="Team"
        options={options}
        searchable
        emptyMessage="Nothing matched"
        filterOption={(option, query) => option.value === 'product' && query === 'prod'}
      />,
    );

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Team' });

    await user.click(combobox);
    await user.type(combobox, 'prod');

    expect(screen.getByRole('option', { name: 'Product' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Design/ })).not.toBeInTheDocument();

    await user.clear(combobox);
    await user.type(combobox, 'design');

    expect(screen.getByText('Nothing matched')).toBeInTheDocument();
  });

  it('renders grouped options with descriptions', async () => {
    const grouped: SelectItem[] = [
      {
        label: 'Teams',
        options: [
          { value: 'design', label: 'Design', description: 'Product design' },
          { value: 'engineering', label: 'Engineering' },
        ],
      },
      { value: 'none', label: 'No team' },
    ];

    render(<Select aria-label="Team" options={grouped} />);

    const { user } = await openSelect();
    const group = screen.getByRole('group', { name: 'Teams' });

    expect(within(group).getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: /Design Product design/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'No team' })).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'No team' }));
    expect(screen.getByRole('combobox', { name: 'Team' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes on outside click and Tab', async () => {
    render(<Select aria-label="Team" options={options} />);

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox', { name: 'Team' });

    combobox.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(document.body);
    expect(combobox).toHaveAttribute('aria-expanded', 'false');

    // Open from the pointer: a keyboard highlight makes the active option
    // tabbable, so the first Tab would enter the list instead of leaving it.
    await user.click(combobox);
    await screen.findByRole('listbox');
    await user.tab();

    await waitFor(() => {
      expect(combobox).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('forwards ids, refs, classes, and form attributes', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Select
        ref={ref}
        id="team-select"
        aria-label="Team"
        className="custom"
        options={options}
        defaultValue="design"
        name="team"
        required
        invalid
        aria-describedby="team-help"
        size="lg"
      />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Team' });
    expect(ref.current).toBe(combobox);
    expect(combobox).toHaveAttribute('id', 'team-select');
    expect(combobox).toHaveAttribute('aria-required', 'true');
    expect(combobox).toHaveAttribute('aria-invalid', 'true');
    expect(combobox).toHaveAttribute('aria-describedby', 'team-help');

    const hidden = container.querySelector<HTMLInputElement>('input[name="team"]');
    expect(hidden?.value).toBe('design');
    expect(hidden).toBeRequired();

    expect(container.firstElementChild).toHaveClass('custom');
    expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    render(<Select aria-label="Team" options={options} disabled />);

    const combobox = screen.getByRole('combobox', { name: 'Team' });
    expect(combobox).toBeDisabled();

    await userEvent.setup().click(combobox);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
