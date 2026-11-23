import { isColorValue, needsSwatchOutline } from '@/lib/color';
import { getSemanticTokenGroups } from '@/lib/tokens';

import { TableScroll } from './table-scroll';

export function SemanticColorTable() {
  return (
    <div className="semantic-colors">
      {getSemanticTokenGroups().map((group) => (
        <section className="semantic-color-group" key={group.title}>
          <h3>{group.title}</h3>
          <TableScroll>
            <table>
              <caption className="sr-only">{group.title} semantic color tokens</caption>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Swatch</th>
                  <th scope="col">Light</th>
                  <th scope="col">Dark</th>
                </tr>
              </thead>
              <tbody>
                {group.tokens.map((token) => (
                  <tr key={token.name}>
                    <th scope="row">
                      <code>{token.name}</code>
                    </th>
                    <td>
                      {/* The chip shows the documented value rather than the live custom
                          property: the docs site overrides a few tokens (page background),
                          and a live chip would contradict the value printed beside it. */}
                      {isColorValue(token.value) ? (
                        <span
                          className={
                            needsSwatchOutline(token.value)
                              ? 'semantic-swatch semantic-swatch-outlined'
                              : 'semantic-swatch'
                          }
                          style={{ backgroundColor: token.value }}
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          className="semantic-swatch semantic-swatch-shadow"
                          style={{ boxShadow: token.value }}
                          aria-hidden="true"
                        />
                      )}
                    </td>
                    <td>
                      <code>{token.light}</code>
                    </td>
                    <td>
                      <code>{token.dark}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        </section>
      ))}
    </div>
  );
}
