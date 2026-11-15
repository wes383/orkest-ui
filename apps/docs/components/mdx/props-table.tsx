import { Fragment } from 'react';

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="table-wrap">
      <table className="props-table">
        <caption className="sr-only">Component props</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Fragment key={row.name}>
              <tr>
                <th scope="row">
                  <code>{row.name}</code>
                </th>
                <td>
                  <code>{row.type}</code>
                </td>
                <td>{row.default ? <code>{row.default}</code> : '—'}</td>
              </tr>
              <tr className="props-description">
                <td colSpan={3}>{row.description}</td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
