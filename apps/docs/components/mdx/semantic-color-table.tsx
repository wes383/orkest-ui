import { getSemanticTokenGroups } from '@/lib/tokens';

export function SemanticColorTable() {
  return (
    <div className="semantic-colors">
      {getSemanticTokenGroups().map((group) => (
        <section className="semantic-color-group" key={group.title}>
          <h3>{group.title}</h3>
          <div className="table-wrap">
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
                    <td data-label="Swatch">
                      <span
                        className={
                          token.value.toLowerCase() === '#ffffff'
                            ? 'semantic-swatch semantic-swatch-outlined'
                            : 'semantic-swatch'
                        }
                        style={{ backgroundColor: `var(${token.name})` }}
                        aria-hidden="true"
                      />
                    </td>
                    <td data-label="Light">
                      <code>{token.light}</code>
                    </td>
                    <td data-label="Dark">
                      <code>{token.dark}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
