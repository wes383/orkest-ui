import { getSemanticTokensByPrefix } from '@/lib/tokens';

import { TableScroll } from './table-scroll';

/**
 * Semantic tokens differ per theme, so the table shows both values. Unlike
 * `SemanticColorTable` there is no swatch: elevation and focus tokens are not
 * colours, and a colour chip for them would render as an empty cell.
 */
export function SemanticTokenTable({ title, prefix }: { title?: string; prefix: string }) {
  const records = getSemanticTokensByPrefix(prefix);

  if (records.length === 0) {
    throw new Error(`SemanticTokenTable found no tokens for prefix "${prefix}".`);
  }

  return (
    <div className="token-table">
      {title ? <p className="token-table-title">{title}</p> : null}
      <TableScroll>
        <table>
          <caption className="sr-only">{title ? `${title} tokens` : 'Semantic tokens'}</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Light</th>
              <th scope="col">Dark</th>
            </tr>
          </thead>
          <tbody>
            {records.map((token) => (
              <tr key={token.name}>
                <th scope="row">
                  <code>{token.name}</code>
                </th>
                <td>
                  <code className="token-value">{token.light}</code>
                </td>
                <td>
                  <code className="token-value">{token.dark}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </div>
  );
}
