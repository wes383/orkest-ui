import { createRef, type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableSize,
  type TableVariant,
} from './table';

const variants: TableVariant[] = ['default', 'bordered'];
const sizes: TableSize[] = ['sm', 'md', 'lg'];

function renderTable(element: ReactElement) {
  const { container } = render(element);

  return container.firstElementChild as HTMLElement;
}

describe('Table', () => {
  it('renders the table sections and cells', () => {
    render(
      <Table>
        <TableCaption>Invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV-1</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const table = screen.getByRole('table', { name: 'Invoices' });
    expect(table.tagName).toBe('TABLE');
    expect(table.querySelector('thead')).not.toBeNull();
    expect(table.querySelector('tbody')).not.toBeNull();
    expect(table.querySelector('tfoot')).not.toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Invoice' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'INV-1' })).toBeInTheDocument();
  });

  it('applies the default attributes to the wrapper', () => {
    const wrapper = renderTable(<Table />);

    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper).toHaveAttribute('data-variant', 'default');
    expect(wrapper).toHaveAttribute('data-size', 'md');
    expect(wrapper).not.toHaveAttribute('data-striped');
    expect(wrapper).not.toHaveAttribute('data-hoverable');
  });

  it.each(variants)('applies the %s variant', (variant) => {
    expect(renderTable(<Table variant={variant} />)).toHaveAttribute('data-variant', variant);
  });

  it.each(sizes)('applies the %s size', (size) => {
    expect(renderTable(<Table size={size} />)).toHaveAttribute('data-size', size);
  });

  it('enables striping and hover only when requested', () => {
    const wrapper = renderTable(<Table striped hoverable />);

    expect(wrapper).toHaveAttribute('data-striped', 'true');
    expect(wrapper).toHaveAttribute('data-hoverable', 'true');
  });

  it('keeps attributes and the ref on the table element', () => {
    const ref = createRef<HTMLTableElement>();

    render(
      <Table ref={ref} aria-label="Invoices" id="invoices" className="custom">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = screen.getByRole('table', { name: 'Invoices' });
    expect(table).toHaveAttribute('id', 'invoices');
    expect(table).toHaveClass('custom');
    expect(ref.current).toBe(table);
  });
});

describe('Table cells', () => {
  it('defaults header cells to scope col', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
  });

  it('supports row header scope', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableHead scope="row">Name</TableHead>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole('rowheader', { name: 'Name' })).toBeInTheDocument();
  });

  it.each(['left', 'center', 'right'] as const)('applies the %s alignment', (align) => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align={align}>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole('cell', { name: 'Value' })).toHaveAttribute('data-align', align);
  });

  it('defaults cells to left alignment', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole('cell', { name: 'Value' })).toHaveAttribute('data-align', 'left');
  });

  it('treats numeric widths as pixels', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={120} minWidth={80} verticalAlign="middle">
              Value
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const cell = screen.getByRole('cell', { name: 'Value' });
    expect(cell.style.width).toBe('120px');
    expect(cell.style.minWidth).toBe('80px');
    expect(cell.style.verticalAlign).toBe('middle');
  });

  it('keeps string widths unchanged', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width="40%" minWidth="6rem">
              Value
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const cell = screen.getByRole('cell', { name: 'Value' });
    expect(cell.style.width).toBe('40%');
    expect(cell.style.minWidth).toBe('6rem');
  });

  it('forwards colSpan and rowSpan', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2} rowSpan={3}>
              Merged
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const cell = screen.getByRole('cell', { name: 'Merged' });
    expect(cell).toHaveAttribute('colspan', '2');
    expect(cell).toHaveAttribute('rowspan', '3');
  });

  it('forwards class names and refs on parts', () => {
    const ref = createRef<HTMLTableSectionElement>();

    render(
      <Table>
        <TableBody ref={ref} className="custom" />
      </Table>,
    );

    expect(ref.current).toHaveClass('custom');
  });
});
