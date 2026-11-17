import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Ellipsis } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from '../dropdown-menu';
import { IconButton } from '../icon-button';

import { DataTable, type DataColumn } from './data-table';

interface Person {
  id: string;
  name: string;
  role: string;
  age: number;
}

const people: Person[] = [
  { id: 'a', name: 'Ada', role: 'Engineer', age: 36 },
  { id: 'b', name: 'Grace', role: 'Admiral', age: 45 },
  { id: 'c', name: 'Linus', role: 'Engineer', age: 24 },
];

const columns: DataColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: (row) => row.name },
  { id: 'role', header: 'Role', accessor: (row) => row.role },
  { id: 'age', header: 'Age', accessor: (row) => row.age, align: 'right' },
];

const manyPeople: Person[] = Array.from({ length: 12 }, (_, index) => ({
  id: `${index}`,
  name: `Person ${index + 1}`,
  role: index % 2 === 0 ? 'Engineer' : 'Designer',
  age: 20 + index,
}));

function bodyRows() {
  const body = document.querySelector('tbody');

  return body ? within(body).getAllByRole('row') : [];
}

function first<T>(items: T[]): T {
  const [item] = items;

  if (item === undefined) {
    throw new Error('Expected at least one element');
  }

  return item;
}

function bodyNames() {
  return bodyRows().map((row) => within(row).getAllByRole('cell')[0]?.textContent);
}

describe('DataTable', () => {
  it('renders a caption, header cells, and rows', () => {
    render(<DataTable columns={columns} data={people} caption="Team" getRowId={(row) => row.id} />);

    const table = screen.getByRole('table', { name: 'Team' });
    expect(table).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(3);
    expect(bodyNames()).toEqual(['Ada', 'Grace', 'Linus']);
  });

  it('sorts a column through ascending, descending, and unsorted', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />);

    const header = screen.getByRole('columnheader', { name: /Name/ });
    const sortButton = within(header).getByRole('button');

    await user.click(sortButton);
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(bodyNames()).toEqual(['Ada', 'Grace', 'Linus']);

    await user.click(sortButton);
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(bodyNames()).toEqual(['Linus', 'Grace', 'Ada']);

    await user.click(sortButton);
    expect(header).toHaveAttribute('aria-sort', 'none');
    expect(bodyNames()).toEqual(['Ada', 'Grace', 'Linus']);
  });

  it('sorts numeric columns by value', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />);

    await user.click(within(screen.getByRole('columnheader', { name: /Age/ })).getByRole('button'));

    expect(bodyNames()).toEqual(['Linus', 'Ada', 'Grace']);
  });

  it('filters rows through the global search', async () => {
    const user = userEvent.setup();
    render(
      <DataTable columns={columns} data={people} caption="Team" getRowId={(row) => row.id} />,
    );

    await user.type(screen.getByLabelText('Search rows'), 'engineer');

    expect(bodyNames()).toEqual(['Ada', 'Linus']);
    expect(screen.getByText('Showing 1–2 of 2')).toBeInTheDocument();
  });

  it('paginates rows and resets the page when searching', async () => {
    const user = userEvent.setup();
    render(
      <DataTable columns={columns} data={manyPeople} pageSize={5} getRowId={(row) => row.id} />,
    );

    expect(screen.getByText('Showing 1–5 of 12')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(screen.getByText('Showing 6–10 of 12')).toBeInTheDocument();
    expect(bodyNames()[0]).toBe('Person 6');

    await user.type(screen.getByLabelText('Search rows'), 'Designer');

    expect(screen.getByText('Showing 1–5 of 6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('selects rows on the page and reports them', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={people}
        selectable
        getRowId={(row) => row.id}
        onSelectionChange={onSelectionChange}
      />,
    );

    await user.click(screen.getByLabelText('Select all rows on this page'));

    expect(onSelectionChange).toHaveBeenLastCalledWith(people);

    const rowCheckboxes = screen.getAllByLabelText('Select row');
    expect(rowCheckboxes).toHaveLength(3);

    await user.click(first(rowCheckboxes));

    expect(onSelectionChange).toHaveBeenLastCalledWith([people[1], people[2]]);
  });

  it('expands a row to reveal custom content', async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        columns={columns}
        data={people}
        expandable
        getRowId={(row) => row.id}
        renderExpanded={(row) => <p>{row.name} details</p>}
      />,
    );

    const toggle = first(screen.getAllByRole('button', { name: 'Expand row' }));

    await user.click(toggle);

    expect(screen.getByText('Ada details')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Collapse row' })).toHaveLength(1);
  });

  it('hides a column through the visibility menu', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />);

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Role' }));

    expect(screen.queryByRole('columnheader', { name: /Role/ })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument();
  });

  it('passes the table variant through to the table', () => {
    const { container } = render(
      <DataTable columns={columns} data={people} variant="bordered" getRowId={(row) => row.id} />,
    );

    expect(container.querySelector('table')?.parentElement).toHaveAttribute(
      'data-variant',
      'bordered',
    );
  });

  it('renders an interactive menu from a custom cell', async () => {
    const user = userEvent.setup();
    const actionColumns: DataColumn<Person>[] = [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        accessor: () => null,
        sortable: false,
        searchable: false,
        cell: (row) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<IconButton icon={Ellipsis} label={`Actions for ${row.name}`} size="sm" variant="ghost" />}
            />
            <DropdownMenuPortal>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit {row.name}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        ),
      },
    ];

    render(<DataTable columns={actionColumns} data={people} getRowId={(row) => row.id} />);

    await user.click(screen.getByRole('button', { name: 'Actions for Grace' }));

    expect(await screen.findByRole('menuitem', { name: 'Edit Grace' })).toBeInTheDocument();
  });

  it('renders an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />);

    await user.type(screen.getByLabelText('Search rows'), 'zzz');

    expect(screen.getByText('No results.')).toBeInTheDocument();
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('labels the pagination landmark', () => {
    render(
      <DataTable
        columns={columns}
        data={manyPeople}
        pageSize={5}
        paginationLabel="Team pages"
        getRowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Team pages' })).toBeInTheDocument();
  });

  it('supports disabling search and pagination', () => {
    render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => row.id}
        searchable={false}
        paginated={false}
      />,
    );

    expect(screen.queryByLabelText('Search rows')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
    expect(bodyRows()).toHaveLength(3);
  });
});
