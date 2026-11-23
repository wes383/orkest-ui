import { getPrimitiveToken, getPrimitiveTokensByPrefix, type TokenRecord } from '@/lib/tokens';

import { TableScroll } from './table-scroll';

export function TokenTable({
  title,
  prefix,
  tokens,
}: {
  title?: string;
  prefix?: string;
  tokens?: string[];
}) {
  if (!prefix && !tokens) {
    throw new Error('TokenTable requires either a "prefix" or a "tokens" prop.');
  }

  const records: TokenRecord[] = tokens
    ? tokens.map((token) => getPrimitiveToken(token))
    : getPrimitiveTokensByPrefix(prefix ?? '');

  return (
    <div className="token-table token-table-pair">
      {title ? <p className="token-table-title">{title}</p> : null}
      <TableScroll>
        <table>
          <caption className="sr-only">{title ? `${title} tokens` : 'Design tokens'}</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {records.map((token) => (
              <tr key={token.name}>
                <th scope="row">
                  <code>{token.name}</code>
                </th>
                <td>
                  <code className="token-value">{token.value}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </div>
  );
}
